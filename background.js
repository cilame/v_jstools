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
var ast_dyn_hook = false
var html_copy = false
function close_debugger(){
  attached = false
  ast_dyn_hook = false
  html_copy = false
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
        break; }
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
        ] }, currtab);
      });
    }
  );
}
var currtabid;
var currdomain;
function get_cookie(){
  chrome.cookies.getAll({}, function(cookie){ 
    var cookies = []
    for (var i = 0; i < cookie.length; i++) {
      var _domain = cookie[i].domain
      if (_domain.charAt() == '.'){
        _domain = _domain.slice(1)
      }
      if (currdomain.indexOf(_domain) != -1){
        cookies.push(cookie[i])
      }
    }
    chrome.tabs.sendMessage(currtabid, {action: {type:'getcookie', info: cookies}}, function(){})
  });
}
chrome.extension.onMessage.addListener(function (req, sender, sendResponse){
  if (req.getcookie){
    currtabid = sender.tab.id
    currdomain = req.domain
    get_cookie()
    sendResponse({})
  }
})
chrome.cookies.onChanged.addListener(function(info){
  if (currtabid){
    get_cookie()
  }
});

function get_html(url){
    var json = save_cache
    function replaceX(e, r, n) {
        var t, u, f, i, l;
        t = e.indexOf(r);
        if (t >= 0) {
            f = e.substr(0, t);
            u = r.length;
            i = e.substr(t + u, e.length - (t + u) + 1);
            l = f + n + i;
            t = l.indexOf(r);
            return t >= 0 ? replaceX(l, r, n) : l;
        }
        return e;
    }
    function script_escape(str){
        str = str.replace(/<( *\/ *script *>)/g, '\\x3C$1')
        return str.replace(/<( *script *>)/g, '\\x3C$1')
    }
    if (!json[url]){
        return
    }
    var $ = cheerio.load(json[url].data)
    var keys = Object.keys(json)
    var used_script = []
    function get_match(src, type) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf(src) != -1 && json[keys[i]].type == type){
                if (json[keys[i]].type == 'Script'){
                    used_script.push(keys[i])
                }
                return json[keys[i]].data
            }
        }
    }
    var scripts = $("script")
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i]
        if (script.attribs && script.attribs.src){
            console.log(script.attribs.src)
            var src = script.attribs.src
            var rep = get_match(src, 'Script')
            if (rep){
                script.children.push({
                    type: 'text',
                    data: script_escape(rep),
                    parent: script,
                    prev: null,
                    next: null,
                })
                delete script.attribs.src
            }else{
                console.log('not find...', src)
            }
        }
    }
    var links = $("link")
    for (var i = 0; i < links.length; i++) {
        var link = links[i]
        if (link.attribs && link.attribs.href){
            var href = link.attribs.href
            var data = get_match(href, 'Stylesheet')
            if (data){
                var mlist = data.match(/url\( *[^\( ]+ *\)/g)
                if (mlist){
                    mlist = mlist.map(function(e){
                        return /url\( *([^\( ]+) *\)/g.exec(e)[1]
                    })
                    for (var j = 0; j < mlist.length; j++) {
                        var woff = get_match(mlist[j], 'Font')
                        if (woff){
                            console.log(mlist[j])
                            data = replaceX(data, mlist[j], 'data:application/x-font-woff;charset=utf-8;base64,' + woff)
                        }
                    }
                }
                var style = cheerio.load("<style>" + data + "</style>")("style")
                $(link).replaceWith(style);
            }
            // var data = get_match(href, 'Font')
            // if (data){
            //     console.log(href, href in json)
            // }
            var data = get_match(href, 'Other')
            if (data){
                link.attribs.href = "data:;base64," + data
            }
            // console.log(link)
            console.log(href)
        }
    }
    var imgs = $('img')
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i]
        if (img.attribs && img.attribs.src){
            var src = img.attribs.src
            var rep = get_match(src, 'Image')
            if (rep){
                console.log('ok', src)
                img.attribs.src = "data:image/png;base64," + rep
            }else{
                console.log('img not find...', src)
            }
        }
    }
    var json_obj = {};
    var func_str = ''
    for (var i = 0; i < keys.length; i++) {
        if (json[keys[i]].type == 'Script' && used_script.indexOf(keys[i]) == -1){
            console.log('not find script...', keys[i], json[keys[i]].data.length)
            json_obj[keys[i]] = {}
            json_obj[keys[i]].type = json[keys[i]].type
            json_obj[keys[i]].func = `vilame_run${i}`
            func_str += script_escape(`vilame_json['vilame_run${i}'] = function (){${json[keys[i]].data}}`) + '\n'
        }
    }
    var insert_code = `
    var vilame_json = ` + JSON.stringify(json_obj) + `
    ` + func_str + `
    var vilame_keys = Object.keys(vilame_json)
    function get_match(src){
        for (var i = 0; i < vilame_keys.length; i++) {
            if (vilame_keys[i].indexOf(src) != -1){
                return vilame_json[vilame_json[vilame_keys[i]].func]
            }
        }
    }
    var v_insertBefore = Node.prototype.insertBefore
    Node.prototype.insertBefore = function(v){
        var src;
        if (v && v.getAttribute && (src = v.getAttribute('src'))){
            var func = get_match(src)
            if (func){
                setTimeout(func, 0)
                return
            }
        }
        return v_insertBefore.apply(this, arguments)
    }
    var v_appendChild = Node.prototype.appendChild
    Node.prototype.appendChild = function(v){
        if (v && v.getAttribute && (src = v.getAttribute('src'))){
            var func = get_match(src)
            if (func){
                setTimeout(func, 0)
                return
            }
        }
        return v_appendChild.apply(this, arguments)
    }
    `
    var insert_script = cheerio.load("<script>" + script_escape(insert_code) + "</script>")("script")[0]
    var head = $("head")
    if (head.length){
        head.append(insert_script)
    }
    return $.html()
}


var typeMap = {
  "txt"   : "text/plain",
  "html"  : "text/html",
  "htm"   : "text/html",
  "css"   : "text/css",
  "js"    : "text/javascript",
  "json"  : "text/json",
  "xml"   : "text/xml",
  "jpg"   : "image/jpeg",
  "gif"   : "image/gif",
  "png"   : "image/png",
  "webp"  : "image/webp"
}

function getLocalFileUrl(url) {
  var arr = url.split('.');
  var type = arr[arr.length-1];
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, false);
  xhr.send(null);
  var content = xhr.responseText || xhr.responseXML;
  if (!content) {
    return false;
  }
  var wordArray = CryptoJS.enc.Utf8.parse(content);
  var base64 = CryptoJS.enc.Base64.stringify(wordArray);
  return ("data:" + (typeMap[type] || typeMap.txt) + ";charset=utf-8;base64," + base64);
}

function sub_logger(){
  chrome.storage.local.get([
    'config-hook-global',
    'config-myinject_toggle',
    ], function(e){
    chrome.browserAction.setBadgeBackgroundColor({color: '#BC1717'});
    var info = ''
    if (e['config-hook-global']){
      info += 'v'
    }
    if (e['config-myinject_toggle']){
      info += 'i'
    }
    chrome.browserAction.setBadgeText({text: info});
  })
}
sub_logger()

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    var url = details.url;
    for (var i = 0; i < webRedirect.length; i++) {
      var [mstr, rurl] = webRedirect[i]
      if (url.indexOf(mstr) != -1){
        if (rurl.trim().indexOf('file:///') == 0){
          var rdata = getLocalFileUrl(rurl)
          if (rdata){
            return { redirectUrl: rdata };
          }
        }
      }
    }
    return {}
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

var webRedirect = []
var webRedirect_toggle = JSON.parse(localStorage.webRedirect_toggle || "false");
window.addEventListener('storage', function(){
  webRedirect = JSON.parse(localStorage.webRedirect || "[]")
}, false);
chrome.storage.local.get([
  "response_changer",
  ], function(res){
  var init_data = JSON.parse(res["response_changer"] || "[]")
  webRedirect = init_data
})