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
      // console.log(e.target.dataset.key, e.target.checked)
      if (e.target.dataset.key == 'config-hook-log-toggle'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {action: {type:'logtoggle', info: 'logtoggle'}}, function(response) {});
        });
      }
      if (e.target.dataset.key == 'config-pac_proxy'){
        if (e.target.checked){
          chrome.storage.local.get(['config-proxy_config'], function(res){
            if (res['config-proxy_config']){
              set_my_proxy(res['config-proxy_config'])
            }
          })
        }else{
          set_my_proxy()
        }
      }
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.checked
      })
      sub_logger()
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

// document.getElementById('logtoggle').addEventListener('click', function(e){
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//     chrome.tabs.sendMessage(tabs[0].id, {action: {type:'logtoggle', info: 'logtoggle'}}, function(response) {});
//   });
// })

const bg = chrome.extension.getBackgroundPage()
var clone_page = document.getElementById('clone_page')
if (clone_page){
  clone_page.addEventListener('click', function(e){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var url = tabs[0].url
      var html = bg.get_html(url)
      if (html){
        var url = URL.createObjectURL(new Blob(html.split(''), {type: 'text/html'}))
        chrome.downloads.download({
          url: url,
          filename: 'clone_html.html'
        });
      }else{
        alert('获取html结构失败，请右键需要拷贝的页面的空白处，选择“打开 html 调试拷贝”。刷新页面后，确保页面资源加载充足后再重新点击“拷贝当前页面”')
      }
    });
  })
}

var update_page = document.getElementById('update_page')
if(update_page){
  update_page.addEventListener('click', function(e){
    function closePopup() {
      window.close();
      document.body.style.opacity = 0;
      setTimeout(function() { history.go(0); }, 300);
    }
    closePopup()
    chrome.tabs.create({
      url: 'https://github.com/cilame/v_jstools',
    });
  })
}

document.getElementById('ast_page')?.addEventListener('click', function(){
  var temp = chrome.runtime.getURL('astexplorer_babel.html')
  chrome.tabs.create({
    url: temp
  });
  
})
document.getElementById('diff_page')?.addEventListener('click', function(){
  var temp = chrome.runtime.getURL('diff_text.html')
  chrome.tabs.create({
    url: temp
  });
})
