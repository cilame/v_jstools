// background.js










chrome.contextMenus.create({
  title: "打开配置页面",
  contexts: ['all'],
  onclick: function(){
    chrome.tabs.create({
      url: chrome.extension.getURL('options.html')
    });
  }
});