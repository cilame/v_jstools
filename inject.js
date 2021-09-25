const script = document.createElement('script');

function injectfunc(e, window) {
  var globalConfig = e;
  console.log("inject start!", e)
  // 备份 console.log
  !function(){ window.v_log = console.log }()
  // 保护 toString 函数
  var saf,saf_class;
  !function() {
    var v=console.log,n=Function,t="prototype",e="toString",o=n[e],i=Symbol("(".concat("",")_",(Math.random() + "")[e](36))),c=function() {
      try{return"function"==typeof this&&this[i]||o.call(this);}catch(n){return v("[ERROR toString]",this+''),"";}};
    function r(n,t,e){Object.defineProperty(n,t,{enumerable:!1,configurable:!0,writable:!0,value:e});}
    delete n[t][e],r(n[t],e,c),r(n[t][e],i,"function toString() { [native code] }"),
    saf=function(n,m){return r(n,i,`function ${m?m:n.name||""}() { [native code] }`),n;};
  }();

  if (e["config-hook-test"]) {
    debugger
  }
  if (e["config-hook-Function"]){
    !function(){
      // hook function
      var _oldFunction = Function
      var _newFunction = function Function(){
        if (window.v_func){
          // modify on outside: 
          //   window.v_func = function(e){e[e.length-1]=e[e.length-1].replace(/debugger/g, '        ')}
          window.v_func(arguments)
        }else{ window.v_log('Function code:', arguments[arguments.length-1]) }
        return _oldFunction.apply(this, arguments)
      }
      saf(_newFunction)
      Object.defineProperty(Function.prototype, 'constructor', {
        value: _newFunction,
        enumerable: false, 
        configurable: true,
        writable: true, 
      })
      Function = _newFunction
      Function.prototype = _oldFunction.prototype
    }()
  }
  if (e["config-hook-eval"]){
    !function(){
      // hook eval
      var _oldeval = eval
      eval = function eval(){
        if (window.v_eval){
          // modify on outside: 
          //   window.v_eval = function(e){e[e.length-1]=e[e.length-1].replace(/debugger/g, '        ')}
          window.v_eval(arguments)
        }else{ window.v_log('eval code:', arguments[arguments.length-1]) }
        return _oldeval.apply(this, arguments)
      }
      saf(eval)
    }()
  }
  if (e["config-hook-remove-dyn-debugger"]){
    !function(){
      function mk_func(fname){
        function replace_debugger(e){
          if (/debugger/.test(e[e.length-1])){
            window.v_log(`[replace_debugger:${fname}]: debugger is exist, replace it with empty string.`)
            e[e.length-1]=e[e.length-1].replace(/debugger/g, '    ')
          }else{ window.v_log(`[replace_debugger:${fname}]: ${e[e.length-1]}`) }
        }
        return replace_debugger
      }
      window.v_func = mk_func('Function')
      window.v_eval = mk_func('eval')
    }()
  }
  if (e["config-hook-cookie"]){
    !function(){
      // hook cookie get set
      var _old_cookie_get = Object.getOwnPropertyDescriptors(document.__proto__.__proto__).cookie.get
      var _old_cookie_set = Object.getOwnPropertyDescriptors(document.__proto__.__proto__).cookie.set
      var _new_cookie_get = function get(){
        var r = _old_cookie_get.apply(this, arguments)
        if (window.v_cookie_get){
          window.v_cookie_get(r)
        }else{ window.v_log('[cookie get]') }
        return r
      }
      saf(_new_cookie_get)
      var _new_cookie_set = function set(v){
        if (window.v_cookie_set){
          window.v_cookie_set(arguments)
        }else{ window.v_log('[cookie set]', v) }
        return _old_cookie_set.apply(this, arguments)
      }
      saf(_new_cookie_set)
      Object.defineProperty(document.__proto__.__proto__, 'cookie', {
        get: _new_cookie_get, 
        set: _new_cookie_set,
        enumerable: true, 
        configurable: true, 
      })
    }()
  }
  if (e["config-hook-settimeout"]){
    !function(){
      // hook setTimeout
      var _setTimeout = setTimeout
      setTimeout = function setTimeout(){
        if (window.v_settimeout){
          window.v_settimeout(arguments)
        }else{ window.v_log('[settimeout]', ...arguments) }
        _setTimeout.apply(this, arguments)
      }
      saf(setTimeout)
    }()
  }
  if (e["config-hook-setinterval"]){
    !function(){
      // hook setInterval
      var _setInterval = setInterval
      setInterval = function setInterval(){
        if (window.v_setinterval){
          window.v_setinterval(arguments)
        }else{ window.v_log('[setinterval]', ...arguments) }
        _setInterval.apply(this, arguments)
      }
      saf(setInterval)
    }()
  }
  var v_parse = JSON.parse
  var v_stringify = JSON.stringify
  var v_decodeURI = decodeURI
  var v_decodeURIComponent = decodeURIComponent
  var v_encodeURI = encodeURI
  var v_encodeURIComponent = encodeURIComponent
  var v_escape = escape
  var v_unescape = unescape
  var util = (typeof require!=='undefined')?require('util'):{
    inspect:function(e){
      var r;
      if (typeof e == 'string'){
        r=e+'';
        if(r.length>100){
          r=r.slice(0,100)+'...'
        };
      }else if( Object.prototype.toString.call(e) == '[object Arguments]' ){
        r = [].slice.call(e)
      }
      else{ r = e }
      return r
    }
  }
  var v_logs = function (a, b, c) {
    window.v_log('  (*)', a, util.inspect(b), '===>', c)
    return c
  }
  if (e["config-hook-JSON.parse"]){
    JSON.parse = saf(function parse(){return v_logs('[JSON.parse]:', arguments, v_parse.apply(this, arguments))})
  }
  if (e["config-hook-JSON.stringify"]){
    JSON.stringify = saf(function stringify(){return v_logs('[JSON.stringify]:', arguments, v_stringify.apply(this, arguments))})
  }
  if (e["config-hook-decodeURI"]){
    decodeURI = saf(function decodeURI(){return v_logs('[decodeURI]:', arguments, v_decodeURI.apply(this, arguments))})
  }
  if (e["config-hook-decodeURIComponent"]){
    decodeURIComponent = saf(function decodeURIComponent(){return v_logs('[decodeURIComponent]:', arguments, v_decodeURIComponent.apply(this, arguments))})
  }
  if (e["config-hook-encodeURI"]){
    encodeURI = saf(function encodeURI(){return v_logs('[encodeURI]:', arguments, v_encodeURI.apply(this, arguments))})
  }
  if (e["config-hook-encodeURIComponent"]){
    encodeURIComponent = saf(function encodeURIComponent(){return v_logs('[encodeURIComponent]:', arguments, v_encodeURIComponent.apply(this, arguments))})
  }
  if (e["config-hook-escape"]){
    escape = saf(function escape(){return v_logs('[escape]:', arguments, v_escape.apply(this, arguments))})
  }
  if (e["config-hook-unescape"]){
    unescape = saf(function unescape(){return v_logs('[unescape]:', arguments, v_unescape.apply(this, arguments))})
  }
}
chrome.storage.sync.get([
  "config-hook-test",
  "config-hook-Function",
  "config-hook-eval",
  "config-hook-remove-dyn-debugger",
  "config-hook-cookie",
  "config-hook-settimeout",
  "config-hook-setinterval",
  "config-hook-JSON.parse",
  "config-hook-JSON.stringify",
  "config-hook-decodeURI",
  "config-hook-decodeURIComponent",
  "config-hook-encodeURI",
  "config-hook-encodeURIComponent",
  "config-hook-escape",
  "config-hook-unescape",
], function (result) {
  script.text = `(${injectfunc})(${JSON.stringify(result)},window)`;
  script.onload = function(){ 
    script.parentNode.removeChild(script) 
  }
  var scriptin = (document.head || document.documentElement)
  scriptin.appendChild(script);
})