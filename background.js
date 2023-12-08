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
function add_hook_event_code(tabs, callback){
  var run_code_before = `
  !function(){
    var toggle = true
    var elelist = []
    var v_stringify = JSON.stringify
    var v_parse = JSON.parse
    function log_ele(name, e){
      if (toggle){
        if (!e.target.tagName){
          var css = ''
        }else{
          var css = e.target.tagName.toLowerCase()
                    + (e.target.id ? '#' + e.target.id : '') 
                    + (e.target.classList.length ? '.' + e.target.classList[0] : '')
        }
        function tofixnum(dict, num){
          num = num || 1
          var keys = Object.keys(v_parse(v_stringify(dict)))
          for (var i = 0; i < keys.length; i++) {
            if (typeof dict[keys[i]] == 'number'){
              dict[keys[i]] = +dict[keys[i]].toFixed(num)
            }
          }
          return dict
        }
        elelist.push([name, e, 
        v_stringify({
          type:name, 
          x: e.clientX, 
          y: e.clientY, 
          screenX: e.screenX, 
          screenY: e.screenY, 
          timeStamp: e.timeStamp, 
          css: {
            selector: css,
            rect: tofixnum(e.target.getBoundingClientRect ? e.target.getBoundingClientRect() : {}),
            tagName: e.target.tagName || undefined,
            id: e.target.id || undefined,
          }, 
        })])
      }
    }
    function copyToClipboard(str, maxtime){
      if (maxtime === undefined){ maxtime = 2 }
      const el = document.createElement('textarea');
      el.value = str;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
        alert('已将代码存放到剪贴板中。')
      }else{
        if (maxtime > 0){
          return copyToClipboard(str, maxtime-1)
        }
        alert('保存至剪贴板失败。尝试直接将代码用 console.log 直接输出在控制台中。(因为可能会保存失败，可以多点几次 “生成临时环境”)')
        console.log(str)
      }
    };
    function make_log_str(elelist){
      var ret = []
      for (var i = 0; i < elelist.length; i++) {
        ret.push('    ' + elelist[i][2] + ',')
      }
      var enter = String.fromCharCode(10)
      return '[' + enter + ret.join(enter) + enter + ']'
    }
    document.addEventListener('keyup',(e)=>{
      if (e.keyCode===27){
        if (toggle){
          console.log(elelist)
          copyToClipboard(make_log_str(elelist), 2)
          elelist = []
        }
        toggle = !toggle
      }
    })
    document.addEventListener('mousemove', function(e){
      var nDiv = document.createElement('div')
      var e = event || window.event
      nDiv.style.cssText = "position:absolute; width:5px; height:5px; background-color:red; border-radius:50%"   
      nDiv.style.left = e.pageX + 5 + "px"
      nDiv.style.top = e.pageY + 5 + "px"
      document.body.appendChild(nDiv)
      setTimeout(function(){ nDiv.remove(); },1000)
      log_ele.bind(null, 'mousemove')(e)
    })
    function log2_ele(name, e){
      if (toggle){
        elelist.push([name, e, v_stringify({type:name, key: e.key, keyCode: e.keyCode, code: e.code, timeStamp: e.timeStamp})])
      }
    }
    document.addEventListener('mousedown', log_ele.bind(null, 'mousedown'), true)
    document.addEventListener('mouseup', log_ele.bind(null, 'mouseup'), true)
    document.addEventListener('click', log_ele.bind(null, 'click'), true)
    document.addEventListener('keydown', log2_ele.bind(null, 'keydown'), true)
    document.addEventListener('keyup', log2_ele.bind(null, 'keyup'), true)
  }()
  `
  var currtab = { tabId: tabs[0].id };
  chrome.debugger.attach(currtab, "1.2", function () {
    chrome.debugger.sendCommand(currtab, "Page.enable", function(){
      chrome.debugger.sendCommand(currtab, "Page.addScriptToEvaluateOnNewDocument", {
        source: run_code_before
      }, function(){
        callback()
      });
    });
  });
}
function flash_page(tabs){
  var codeToExec = `setTimeout(function(){ location = location }, 100); `
  chrome.tabs.executeScript( tabs[0].id, {code:codeToExec}, function(result) { 
    console.log('Result = ' + result); } 
  );
}
chrome.contextMenus.create({
  title: "挂钩并记录事件",
  contexts: ['all'],
  onclick: function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      alert(`准备开始挂钩事件记录。\n\n\n页面刷新后，所有事件都将被记录操作，直到你按下 ESC 键停止记录，并将结果保存到剪贴板里面。`)
      add_hook_event_code(tabs, function(){
        flash_page(tabs)
      })
    });
  }
});
chrome.contextMenus.create({
  title: "拷贝当前页面资源",
  contexts: ['all'],
  onclick: function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      function format_cache(){
        function base64(str){
          return CryptoJS.enc.Utf8.parse(str).toString(CryptoJS.enc.Base64)
        }
        var keys = Object.keys(save_cache).sort()
        var rets = []
        for (var i = 0; i < keys.length; i++) {
          var s = document.createElement('a')
          s.href = keys[i]
          var url = s.href
          var odata = save_cache[keys[i]]
          if (odata.type == 'Script'||
            odata.type == 'Document'||
            odata.type == 'Stylesheet'){
            rets.push('    ' + JSON.stringify([url, base64(odata.data), 'base64', odata.responseHeaders, odata.responseStatusCode])+',')
          }else{
            rets.push('    ' + JSON.stringify([url, odata.data, 'null', odata.responseHeaders, odata.responseStatusCode])+',')
          }
        }
        return rets.join('\n').trim() 
      }
      var html = format_cache()
      if (html && html_copy){
        var url = URL.createObjectURL(new Blob(html.split(''), {type: 'text/javascript'}))
        chrome.downloads.download({
          url: url,
          filename: 'clone_cache.js'
        });
      }else{
        alert(`准备打开调试拷贝。\n\n\n请在打开调试模式之后，手动刷新页面等待页面资源加载充足后，再次右键选择 "拷贝当前页面资源"`)
        html_copy = true
        AttachDebugger();
        flash_page(tabs)
      }
    });
  }
});
chrome.contextMenus.create({
  title: "拷贝当前页面",
  contexts: ['all'],
  onclick: function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var url = tabs[0].url
      var html = get_html(url)
      if (html && html_copy){
        var url = URL.createObjectURL(new Blob(html.split(''), {type: 'text/html'}))
        chrome.downloads.download({
          url: url,
          filename: 'clone_html.html'
        });
      }else{
        alert(`准备打开调试拷贝。\n\n\n请在打开调试模式之后，手动刷新页面等待页面资源加载充足后，再次右键选择 "拷贝当前页面"`)
        html_copy = true
        AttachDebugger();
        flash_page(tabs)
      }
    });
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
      window.eval(res["config-request_hook"])
    }catch(e){
      change_request = undefined;
      console.log('evaluate code init change_request func err.', e)
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
                  save_cache[url] = {data: save_info, type: type, responseHeaders: params.responseHeaders, responseStatusCode: params.responseStatusCode}
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
          var { url, method, postData, headers } = params.request
          var config = { url, method, postData, headers }

          if (typeof change_request != 'undefined'){
            try{
              change_request(config)
            }catch(e){
              console.log('run change_request err.', e)
            }
          }

          var { url, method, postData, headers } = config

          function base64(str){
            return CryptoJS.enc.Utf8.parse(str).toString(CryptoJS.enc.Base64)
          }
          // 这里处理更新操作
          try{
            if (url){
              options.url = url
            }
            if (method){
              options.method = method
            }
            if (postData){
              options.postData = base64(postData)
            }
            if (headers){
              var keys = Object.keys(headers)
              var headers_list = []
              for (var i = 0; i < keys.length; i++) {
                headers_list.push({name:keys[i], value:headers[keys[i]]})
              }
              options.headers = headers_list
            }
          }catch(e){
            console.log('set change request err.', e)
          }
          console.log('change request options:', options)
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

