chrome.storage.local.get(["config-hook-new-tab"], function(e) {
  if(!e['config-hook-new-tab']) {
    chrome.tabs.update({ url: "chrome-search://local-ntp/local-ntp.html" })
  }else{
  	var option_page = chrome.runtime.getURL('options.html')
    chrome.tabs.update({ url: option_page })
  }
})