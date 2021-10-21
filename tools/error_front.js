function send_error_info_to_front(e, tid){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tid, {action: {type:'error', info: e}}, function(response) {});
  });
}