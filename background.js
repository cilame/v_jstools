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
          if (result.body !== undefined){ // 收到的 result.body 是 base64(代码) 的代码，使用时需要解码一下
            chrome.storage.local.get(["config-fetch_hook"], function (res) {
              try{      fillresponse.bind(null, params, source)(btoa(eval((res["config-fetch_hook"]||'')+';fetch_hook')(atob(result.body), params.resourceType, params.request.url))) }
              catch(e){ fillresponse.bind(null, params, source)(result.body) }
            })
            return }
          fillresponse.bind(null, params, source)(result.body) // body 只能传 base64(指定代码) 
        }); 
        break; }
  }
})
chrome.debugger.onDetach.addListener(function(){ attached = false })
var attached = false
function AttachDebugger() {
  if (attached){ return }
  attached = true
  chrome.tabs.query(
    { active: true, currentWindow: true }, 
    function (tabs) {
      var currtab = { tabId: tabs[0].id };
      chrome.debugger.attach(currtab, "1.2", function () {
        // Document, Stylesheet, Image, Media, Font, Script, TextTrack, XHR, Fetch, EventSource, WebSocket, Manifest, SignedExchange, Ping, CSPViolationReport, Preflight, Other
        sendCommand("Network.enable", {}, currtab, function(){ sendCommand("Network.setCacheDisabled", {cacheDisabled: true}, currtab)} ) // 确保 Fetch.getResponseBody 一定能收到东西
        sendCommand("Fetch.enable", { patterns: [
          {urlPattern:"*",resourceType:"Script",requestStage:"Response"}, // 暂时先只 hook Script 类型的脚本
          // {urlPattern:"*",resourceType:"Document",requestStage:"Response"}, 
        ] }, currtab);
      });
    }
  );
}