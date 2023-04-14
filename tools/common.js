function set_my_proxy(proxy){
  if (proxy){
    var proxylist = proxy.trim().split('\n').map(function(e){
      return e.trim()
    })
    var toggle = false
    for (var i = 0; i < proxylist.length; i++) {
      if (proxylist[i] && !proxylist[i].startsWith('//')){
        proxy = proxylist[i]
        toggle = true
        break
      }
    }
    if(!toggle){
      proxy = ''
    }
  }else{
    proxy = proxy||''
  }
  var pacScriptConfig = {
    mode: 'pac_script',
    pacScript: {
      data: `
      function FindProxyForURL(url, host) {
        return "${proxy};DIRECT";
      }
      `
    }
  };
  chrome.proxy.settings.set({ value: pacScriptConfig, scope: 'regular' }, function() { 
    if (proxy){
      // alert("代理设置完成"); 
    }else{
      // alert("取消代理链接"); 
    }
  });
}