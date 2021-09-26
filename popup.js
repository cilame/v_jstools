// var background = chrome.extension.getBackgroundPage();
// var gettabid = background.gettabid

function sendMessageToContentScript(message, callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, message, function(response){
      if(callback) callback(response);
    });
  });
}

document.querySelectorAll("input").forEach(function(v){
  chrome.storage.sync.get([v.dataset.key], function (result) {
    v.checked = result[v.dataset.key];
  })
  v.addEventListener("change", function (e) {
    sendMessageToContentScript({[e.target.dataset.key]: e.target.checked})
    chrome.storage.sync.set({
      [e.target.dataset.key]: e.target.checked
    })
  })
})