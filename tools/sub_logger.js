function sub_logger(){
  chrome.storage.local.get([
    'config-hook-global',
    'config-myinject_toggle',
    'config-replacer_toggle',
    'config-pac_proxy',
    ], function(e){
    chrome.browserAction.setBadgeBackgroundColor({color: '#BC1717'});
    var info = ''
    if (e['config-hook-global']){
      info += 'H'
    }
    if (e['config-myinject_toggle']){
      info += 'I'
    }
    if (e['config-pac_proxy']){
      info += 'P'
    }
    if (e['config-replacer_toggle']){
      info += 'R'
      localStorage.webRedirect_toggle = JSON.stringify(true)
    }else{
      localStorage.webRedirect_toggle = JSON.stringify(false)
    }

    chrome.browserAction.setBadgeText({text: info});
  })
}