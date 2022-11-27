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