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
  var check_list = [ "config-hook-global", "config-hook-domobj", "config-hook-domobj-get", "config-hook-domobj-set", "config-hook-domobj-func" ]
  chrome.storage.local.get(check_list, function (result) {
    if (!(result["config-hook-global"] && result["config-hook-domobj"] && result["config-hook-domobj-get"] && result["config-hook-domobj-set"] && result["config-hook-domobj-func"])){
      var result = confirm(`
启用该功能需要让以下四个配置选中：
1: 是否启用挂钩 DOM 对象的原型的功能调试输出
2: hook-domobj-显示get输出
3: hook-domobj-显示set输出
4: hook-domobj-显示func输出

点击 “确认” 会刷新页面并自动选中所需配置，
然后重新点击 “生成临时环境” 即可生成代码。`);
      if(result){
        function make_hook(input, name){
          var ret = ['config-hook-all-'+name]
          for (var i = 0; i < input.length; i++) {
            var kv = input[i]
            var k = kv[0]
            var v = kv[1]
            ret.push(`config-hook-${k}-${v}`)
          }
          return ret
        }
        var all_list = ["config-hook-log-toggle"]
        .concat(check_list)
        .concat(make_hook(getsets_0, 'getsets_0'))
        .concat(make_hook(funcs_0, 'funcs_0'))
        .concat(make_hook(getsets_1, 'getsets_1'))
        .concat(make_hook(funcs_1, 'funcs_1'))
        var config_target = {}
        for (var i = 0; i < all_list.length; i++) {
          config_target[all_list[i]] = true
        }
        chrome.storage.local.set(config_target, function(e){
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: {type:'run_in_page', info: `
              window.open(location, '_self')
            `}}, function(response) {});
          });
          sub_logger()
          window.close()
        })
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        //   chrome.tabs.sendMessage(tabs[0].id, {action: {type:'alerterror', info: `123123`}}, function(response) {});
        // });
      }
      return
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: {type:'addlistener', info: 'addlistener'}}, function(response) {});
    });
  })
})


document.getElementById('create_high_env').addEventListener('click', function(e){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    function send(info){
      chrome.tabs.sendMessage(tabs[0].id, {action: {type:'eval', info: info}}, function(response) {});
    }
    get_file("./tools/env_maker.js", send)
  });
})

get_file("./tools/env_maker.js", function(){}, function(){
  document.getElementById('create_high_env').remove()
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
      url: 'https://github.com/cilame/v_jstools'
    });
  })
}

var qq_group_page = document.getElementById('qq_group_page')
if(qq_group_page){
  qq_group_page.addEventListener('click', function(e){
    function closePopup() {
      window.close();
      document.body.style.opacity = 0;
      setTimeout(function() { history.go(0); }, 300);
    }
    closePopup()
    chrome.tabs.create({
      url: 'https://qm.qq.com/q/ZpEfmZxdKy'
    });
  })
}

var wx_zsxq_page = document.getElementById('wx_zsxq_page')
if(wx_zsxq_page){
  wx_zsxq_page.addEventListener('click', function(e){
    function closePopup() {
      window.close();
      document.body.style.opacity = 0;
      setTimeout(function() { history.go(0); }, 300);
    }
    closePopup()
    chrome.tabs.create({
      url: 'https://wx.zsxq.com/dweb2/index/group/15552845822482'
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
