document.querySelectorAll("input").forEach(function(v){
  chrome.storage.local.get([v.dataset.key], function (result) {
    if (v.type == 'checkbox'){
      v.checked = result[v.dataset.key];
    }
    if (v.type == 'text'){
      v.value = result[v.dataset.key] || '';
    }
  })
  v.addEventListener("change", function (e) {
    if (v.type == 'checkbox'){
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.checked
      })
    }
    if (v.type == 'text'){
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.value
      })
    }
  })
})

document.getElementById('showoptions').addEventListener('click', function(e){
  function closePopup() {
    window.close();
    document.body.style.opacity = 0;
    setTimeout(function() { history.go(0); }, 300);
  }
  closePopup()
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html')
  });
})

document.getElementById('addlistener').addEventListener('click', function(e){
  chrome.storage.local.get([ "config-hook-domobj", "config-hook-domobj-get", "config-hook-domobj-set", "config-hook-domobj-func" ], function (result) {
    if (!(result["config-hook-domobj"] && result["config-hook-domobj-get"] && result["config-hook-domobj-set"] && result["config-hook-domobj-func"])){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: {type:'alerterror', info: `请在配置页面中将DOM挂钩功能全部选中。

以下四个必选：
是否启用挂钩 DOM 对象的原型的功能调试输出
hook-domobj-显示get输出
hook-domobj-显示set输出
hook-domobj-显示func输出

后面的选项，你也需要全选。`}}, function(response) {});
      });
      return
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: {type:'addlistener', info: 'addlistener'}}, function(response) {});
    });
  })
})

document.getElementById('logtoggle').addEventListener('click', function(e){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: {type:'logtoggle', info: 'logtoggle'}}, function(response) {});
  });
})