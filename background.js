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
  title: "打开 v_jstools 动态调试",
  contexts: ['all'],
  onclick: function(){
    AttachDebugger();
  }
});
function sendCommand(method, params, source, chainfun){
  chrome.debugger.sendCommand(source, method, params, function(result){
    if (chrome.runtime.lastError) {
      console.error('chrome.runtime.lastError', chrome.runtime.lastError)
      if (chrome.runtime.lastError.message.indexOf('Cannot access a chrome://') != -1){ attached = false }
    } else { if (chainfun){ chainfun(result) } }
  });
}
function fillresponse(params, source, body){
  sendCommand("Fetch.fulfillRequest", {
    requestId: params.requestId, responseCode: params.responseStatusCode, responseHeaders: params.responseHeaders,
    body: body, // body 只能传 base64(指定代码) 
  }, source);
}
chrome.debugger.onEvent.addListener(function (source, method, params){
  switch(method){
    case "Fetch.requestPaused":
      var itheaders = params.responseHeaders;
      if (itheaders.find(function(v){return v.name == "Location"})) {
        sendCommand("Fetch.continueRequest", { requestId: params.requestId, url: itheaders.value }, source);
        break; }
      if ((params.responseStatusCode || params.responseErrorReason)) {
        if (params.responseErrorReason) {
          sendCommand("Fetch.failRequest", { requestId: params.requestId, errorReason: params.responseErrorReason }, source);
          break; }
        sendCommand("Fetch.getResponseBody", { requestId: params.requestId }, source, function(result){
          var fillfunc = fillresponse.bind(null, params, source)
          if (result.body !== undefined){ // 收到的 result.body 是 base64(代码) 的代码，使用时需要解码一下
            chrome.storage.local.get(["config-fetch_hook"], function (res) {
              try{
                var respboby = decodeURIComponent(escape(atob(result.body)))
                var replacer = eval((res["config-fetch_hook"]||'')+';fetch_hook')
                if (params.resourceType == 'Script'){   var replbody = btoa(unescape(encodeURIComponent(replacer(respboby, params.request.url)))) }
                if (params.resourceType == 'Document'){ var replbody = btoa(unescape(encodeURIComponent(html_script_replacer(respboby, replacer, params.request.url)))) }
                fillfunc(replbody) }
              catch(e){ 
                send_error_info_to_front(e.stack, currtab.tabId, params.request.url)
                fillfunc(result.body) }
            })
            return }
          fillfunc(result.body) // body 只能传 base64(指定代码) 
        }); 
        break; }
  }
})
chrome.debugger.onDetach.addListener(function(){ attached = false })
var attached = false
var currtab;
function AttachDebugger() {
  if (attached){ return }
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
        ] }, currtab);
      });
    }
  );
}