// 暂时还在考虑的一种 window hook 方式。需要配合全局 ast 代码修改的方式
;(function(){
  var cache = {}
  function make_cache_hooker(obj, name){
    if (name in cache){ return cache[name] }
    return cache[name] = new Proxy({}, {
      set: function(a,b,c){ return filter_log('set', b, c), window[b]=c },
      get: function(a,b){
        var r = obj[b]
        if (!(b == Symbol.unscopables || b == Symbol.toStringTag || b == Symbol.toPrimitive)){ filter_log(name, 'get', b, r) }
        return r
      },
    })
  }
  var filter_log = console.log
  function make_fake_window(){
    if (window.globalThisWindow){ return window.globalThisWindow }
    var _win = {}
    function mainobj(b, r){
      switch(b){
        case 'window':
        case 'self':
        case 'top':
        case 'frames': // 这两个可能存在问题
        case 'parent': // 这两个可能存在问题
        case 'globalThis':        r = win;                                                              break
        case 'clientInformation': r = make_cache_hooker(clientInformation, 'window.clientInformation'); break
        case 'crypto':            r = make_cache_hooker(crypto, 'window.crypto');                       break
        case 'customElements':    r = make_cache_hooker(customElements, 'window.customElements');       break
        case 'document':          r = make_cache_hooker(document, 'window.document');                   break
        case 'external':          r = make_cache_hooker(external, 'window.external');                   break
        case 'history':           r = make_cache_hooker(history, 'window.history');                     break
        case 'indexedDB':         r = make_cache_hooker(indexedDB, 'window.indexedDB');                 break
        case 'localStorage':      r = make_cache_hooker(localStorage, 'window.localStorage');           break
        case 'locationbar':       r = make_cache_hooker(locationbar, 'window.locationbar');             break
        case 'menubar':           r = make_cache_hooker(menubar, 'window.menubar');                     break
        case 'navigator':         r = make_cache_hooker(navigator, 'window.navigator');                 break
        case 'performance':       r = make_cache_hooker(performance, 'window.performance');             break
        case 'personalbar':       r = make_cache_hooker(personalbar, 'window.personalbar');             break
        case 'screen':            r = make_cache_hooker(screen, 'window.screen');                       break
        case 'scrollbars':        r = make_cache_hooker(scrollbars, 'window.scrollbars');               break
        case 'sessionStorage':    r = make_cache_hooker(sessionStorage, 'window.sessionStorage');       break
        case 'statusbar':         r = make_cache_hooker(statusbar, 'window.statusbar');                 break
        case 'toolbar':           r = make_cache_hooker(toolbar, 'window.toolbar');                     break
        case 'trustedTypes':      r = make_cache_hooker(trustedTypes, 'window.trustedTypes');           break
        case 'visualViewport':    r = make_cache_hooker(visualViewport, 'window.visualViewport');       break
        case 'location':          r = make_cache_hooker(location, 'window.location');                   break
        default:                  r = window[b];                                                 break
      }
      return r
    }
    var win = new Proxy(_win, {
      has: function(a,b){ return true },
      set: function(a,b,c){ return filter_log('window set', b, c), window[b]=c },
      get: function(a,b){
        var r = mainobj(b)
        if (!(b == Symbol.unscopables || b == Symbol.toStringTag || b == Symbol.toPrimitive)){ filter_log('window', 'get', b, r) }
        return r
      },
    })
    var interceptor = new Proxy(_win, { 
      has: function(a,b){ return true },
      set: function(a,b,c){ return filter_log('window set', b, c), window[b]=c },
      get: function(a,b){
        if (!(b in window) && typeof b != 'symbol'){ throw ReferenceError(b + ' is not defined') } // win 和 interceptor 的区别在这里
        var r = mainobj(b)
        if (!(b == Symbol.unscopables || b == Symbol.toStringTag || b == Symbol.toPrimitive)){ filter_log('window', 'get', b, r) }
        return r
      },
    })
    window.globalThisWindow = _win
    return Object.defineProperty(_win, 'v_run', {set:function(v){ v.call(win, interceptor) }})
  }
  return make_fake_window()
})().v_run = function(inter){
with (inter){
/////////////////////////////////////////






// 将需要被 window hook 的代码放在这里面
console.log(this == window)
console.log(window.a)






/////////////////////////////////////////
}},1