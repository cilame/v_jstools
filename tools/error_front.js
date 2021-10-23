function send_error_info_to_front(e, tid, url){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tid, {action: {type:'error', info: url + '\n' + e}}, function(response) {});
  });
}