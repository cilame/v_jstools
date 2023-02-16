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

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if(!JSON.parse(localStorage.webRedirect_toggle || "false")){
      return {}
    }
    var url = details.url;
    for (var i = 0; i < webRedirect.length; i++) {
      var [mstr, rurl_or_data, type] = webRedirect[i]
      if (url.indexOf(mstr) != -1){
        if (type == 'redirect local.' && rurl_or_data.trim().indexOf('file:///') == 0){
          var rdata = getLocalFileUrl(rurl_or_data)
          if (rdata){
            return { redirectUrl: rdata };
          }
        }
        if (type == 'change return data.'){
          var arr = url.split('.')
          var rdata = "data:" + (typeMap[arr[arr.length-1]] || typeMap.txt) + ";charset=utf-8;base64," 
                              + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(rurl_or_data));
          return { redirectUrl: rdata };
        }
      }
    }
    return {}
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

var webRedirect = []
window.addEventListener('storage', function(){
  webRedirect = JSON.parse(localStorage.webRedirect || "[]")
}, false);
chrome.storage.local.get([
  "response_changer",
  ], function(res){
  var init_data = JSON.parse(res["response_changer"] || "[]")
  webRedirect = init_data
})