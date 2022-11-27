// importScripts("./tools/babel_asttool.js", "./tools/cheerio.js", "./tools/replacer.js", "./tools/error_front.js")
// chrome.contextMenus.create({
//   id: "v_menu",
//   title: "打开 v_jstools 动态调试",
//   contexts: ['all']
// });
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId == "v_menu") {
//     AttachDebugger();
//   }
// });
// background.js
chrome.contextMenus.create({
  title: "打开 ast 动态挂钩",
  contexts: ['all'],
  onclick: function(){
    ast_dyn_hook = true
    AttachDebugger();
  }
});
chrome.contextMenus.create({
  title: "打开 html 调试拷贝",
  contexts: ['all'],
  onclick: function(){
    html_copy = true
    AttachDebugger();
  }
});
chrome.contextMenus.create({
  title: "修改发送请求",
  contexts: ['all'],
  onclick: function(){
    init_edit_function()
    edit_request = true
    AttachDebugger();
  }
});

function init_edit_function(){
  chrome.storage.local.get(["config-request_hook"], function (res) {
    try{
      var code = res["config-request_hook"]

    }catch(e){
      console.log(e)
    }
  })
}

var ast_dyn_hook = false
var html_copy = false
var edit_request = false
function close_debugger(){
  attached = false
  ast_dyn_hook = false
  html_copy = false
  edit_request = false
}
function sendCommand(method, params, source, chainfun){
  chrome.debugger.sendCommand(source, method, params, function(result){
    if (chrome.runtime.lastError) {
      console.error('chrome.runtime.lastError', chrome.runtime.lastError)
      if (chrome.runtime.lastError.message.indexOf('Cannot access a chrome://') != -1){ close_debugger() }
    } else { if (chainfun){ chainfun(result) } }
  });
}
function fillresponse(params, source, body){
  sendCommand("Fetch.fulfillRequest", {
    requestId: params.requestId, responseCode: params.responseStatusCode, responseHeaders: params.responseHeaders,
    body: body, // body 只能传 base64(指定代码) 
  }, source);
}
var save_cache = {}
chrome.debugger.onEvent.addListener(function (source, method, params){
  switch(method){
    case "Fetch.requestPaused":
      var itheaders = params.responseHeaders;
      if (itheaders && itheaders.find(function(v){return v.name == "Location"})) {
        sendCommand("Fetch.continueRequest", { requestId: params.requestId, url: itheaders.value }, source);
        break; }
      if ((params.responseStatusCode || params.responseErrorReason)) {
        if (params.responseErrorReason) {
          sendCommand("Fetch.failRequest", { requestId: params.requestId, errorReason: params.responseErrorReason }, source);
          break; }
        sendCommand("Fetch.getResponseBody", { requestId: params.requestId }, source, function(result){
          var fillfunc = fillresponse.bind(null, params, source)
          chrome.storage.local.get(["config-fetch_hook"], function (res) {
            if (!result.body){ fillfunc(result.body); return }
            // save html
            if (html_copy){
              if ( params.resourceType == 'Script'
                || params.resourceType == 'Document'
                || params.resourceType == 'Stylesheet'
                || params.resourceType == 'Image'
                || params.resourceType == 'Font'
                || params.resourceType == 'Other'
              ){
                if (params.resourceType == 'Script'){     var save_info = decodeURIComponent(escape(atob(result.body))) }
                if (params.resourceType == 'Document'){   var save_info = decodeURIComponent(escape(atob(result.body))) }
                if (params.resourceType == 'Stylesheet'){ var save_info = decodeURIComponent(escape(atob(result.body))) }
                if (params.resourceType == 'Image'){      var save_info = result.body }
                if (params.resourceType == 'Font'){       var save_info = result.body }
                if (params.resourceType == 'Other'){      var save_info = result.body }
                function save_html_info(save_info, type, url){
                  save_cache[url] = {data: save_info, type: type}
                }
                save_html_info(save_info, params.resourceType, params.request.url)
                console.log(params.resourceType, params.request.url)
              }
            }
            // ast hook
            if (ast_dyn_hook){
              if ( params.resourceType == 'Script' 
                || params.resourceType == 'Document'
              ){
                try{
                  var respboby = decodeURIComponent(escape(atob(result.body)))
                  var replacer = eval((res["config-fetch_hook"]||'')+';fetch_hook')
                  if (params.resourceType == 'Script'){   var replbody = (replacer(respboby, params.request.url)) }
                  if (params.resourceType == 'Document'){ var replbody = (html_script_replacer(respboby, replacer, params.request.url)) }
                  fillfunc(btoa(unescape(encodeURIComponent(replbody)))) 
                  return }
                catch(e){ 
                  send_error_info_to_front(e.stack, currtab.tabId, params.request.url) }
              }
            }
            fillfunc(result.body) // body 只能传 base64(指定代码) 
          })
          return
        }); 
        break; 
      }else{
        var options = { requestId: params.requestId }
        if (edit_request){
          var url = params.request.url
          var method = params.request.method
          var postData = params.request.postData
          var headers = params.request.headers
          // console.log(method, url, headers, postData)
          // 这里处理更新操作
          // options.url = url
          // options.method = method
          // options.postData = postData
          // options.headers = headers // 这里直接放进去似乎还会有问题
        }
        sendCommand("Fetch.continueRequest", options, source);
        break;
      }
  }
})
chrome.debugger.onDetach.addListener(function(){ 
  close_debugger() 
})
var attached = false
var currtab;
function AttachDebugger() {
  if (attached){ return }
  save_cache = {}; 
  attached = true
  chrome.tabs.query(
    { active: true, currentWindow: true }, 
    function (tabs) {
      currtab = { tabId: tabs[0].id };
      chrome.debugger.attach(currtab, "1.2", function () {
        sendCommand("Network.enable", {}, currtab, function(){ sendCommand("Network.setCacheDisabled", {cacheDisabled: true}, currtab)} ) // 确保 Fetch.getResponseBody 一定能收到东西
        sendCommand("Fetch.enable", { patterns: [
          // Document, Stylesheet, Image, Media, Font, Script, TextTrack, XHR, Fetch, EventSource, WebSocket, Manifest, SignedExchange, Ping, CSPViolationReport, Preflight, Other
          {urlPattern:"*",resourceType:"Script",requestStage:"Response"}, // 暂时先只 hook 少量携带 js 数据类型的请求
          {urlPattern:"*",resourceType:"Document",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Stylesheet",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Image",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Font",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Other",requestStage:"Response"}, 
          // 
          // {urlPattern:"*",resourceType:"XHR",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"Fetch",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"WebSocket",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Media",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"Ping",requestStage:"Response"}, 
          {urlPattern:"*",resourceType:"CSPViolationReport",requestStage:"Response"}, 

          // {urlPattern:"*",resourceType:"TextTrack",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"EventSource",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"Manifest",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"SignedExchange",requestStage:"Response"}, 
          // {urlPattern:"*",resourceType:"Preflight",requestStage:"Response"}, 

          {urlPattern:"*",requestStage:"request"}, 
        ] }, currtab);
      });
    }
  );
}

sub_logger()

