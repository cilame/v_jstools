function v_mk(){
function v_filter(f){
    var js = [
        "Object",
        "Function",
        "Array",
        "Number",
        "parseFloat",
        "parseInt",
        "Infinity",
        "NaN",
        "undefined",
        "Boolean",
        "String",
        "Symbol",
        "Date",
        "RegExp",
        "Error",
        "EvalError",
        "RangeError",
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "URIError",
        "globalThis",
        "JSON",
        "Math",
        "ArrayBuffer",
        "Uint8Array",
        "Int8Array",
        "Uint16Array",
        "Int16Array",
        "Uint32Array",
        "Int32Array",
        "Float32Array",
        "Float64Array",
        "Uint8ClampedArray",
        "BigUint64Array",
        "BigInt64Array",
        "BigInt",
        "Set",
        "WeakMap",
        "WeakSet",
        "Proxy",
        "Reflect",
        "decodeURI",
        "decodeURIComponent",
        "encodeURI",
        "encodeURIComponent",
        "escape",
        "unescape",
        "eval",
        "isFinite",
        "isNaN",
        "DataView", 
        "Map",
        "console",
    ]
    return js.indexOf(f) != -1
}

function v_filter2(f){
    var js = [
        "alert",
        "atob",
        "btoa",
        "blur",
        "cancelAnimationFrame",
        "cancelIdleCallback",
        "captureEvents",
        "clearInterval",
        "clearTimeout",
        "close",
        "confirm",
        "createImageBitmap",
        "fetch",
        "find",
        "focus",
        "getComputedStyle",
        "getSelection",
        "matchMedia",
        "moveBy",
        "moveTo",
        "open",
        "postMessage",
        "print",
        "prompt",
        "queueMicrotask",
        "releaseEvents",
        "requestAnimationFrame",
        "requestIdleCallback",
        "resizeBy",
        "resizeTo",
        "scroll",
        "scrollBy",
        "scrollTo",
        "setInterval",
        "setTimeout",
        "stop",
        "webkitCancelAnimationFrame",
        "webkitRequestAnimationFrame",
        "showDirectoryPicker",
        "showOpenFilePicker",
        "showSaveFilePicker",
        "openDatabase",
        "webkitRequestFileSystem",
        "webkitResolveLocalFileSystemURL",
    ]
    return js.indexOf(f) != -1
}

function v_get_model_from_native(objfunc) {
    var c;
    try{
        new objfunc
        c = 1
    }catch(e){
      if (e.stack.indexOf('Illegal constructor') != -1){
        c = 0
      }else{
        c = 1
      }
    }
    var n = /function ([^ (]+)/.exec(objfunc+'')[1]
    if (v_filter(n)){
        return ''
    }
    var v = Object.getOwnPropertyDescriptors(objfunc.prototype)
    var e = (/\[object ([^\]]+)\]/.exec(objfunc.prototype.__proto__+'') || [])[1]
    if (e == 'Object'){
        e = undefined
    }
    var ret = [
        `class ${n}${e?" extends "+e:""}{`,
        `  constructor(){ ${e?'var _tmp=v_t;v_t=false;super();v_t=_tmp;':'_odt(this, _y, {[_e]:!1,[_c]:!1,[_w]:!1,[_v]:{}});'}if (${n}._init){${n}._init(this)};${c?' ':' if(v_t){ throw _ntpe() }'} }`
    ]
    var b = []
    for (var i in v){
        var r = []
        if ('get' in v[i] || 'set' in v[i]){
            // console.log(v[i])
            if ('get' in v[i]){
                var Illegal_invocation = ''
                try{
                    console.log('v[i].get()', v, i, v[i].get())
                }catch(e){
                    if (e.stack.indexOf('Illegal invocation')!=-1){
                      Illegal_invocation = `if(!(this instanceof ${n})){throw _tpe('Illegal invocation')}`
                    }
                }
                r.push(`get ${i}(){${Illegal_invocation}return _gs("[${n}].get ${i}", this[_y].${i})}`)
            }
            if ('set' in v[i]){
                if (v[i].set){
                    r.push(`set ${i}(v){return _gs("[${n}].set ${i}", this[_y].${i}=v)}`)
                }
            }
            r = r.join('; ')
            ret.push(`  `+r)
        } else if (i !== 'constructor') {
            if (typeof v[i].value == 'number' || typeof v[i].value == 'boolean'){
                b.push(['number', i, v[i]])
                continue
            }
            else if (typeof v[i].value == 'function'){
                var funcname = (/function ([^ (]+)/.exec(v[i].value + '') || [])[1]
                // r = `${funcname}(){if(this[_y].${i}){return this[_y].${i}(...arguments)}return _fu("[${n}].${i}(*)", arguments)}`
                r = `${funcname}(){return _fu("[${n}].${i}(*)", arguments, this[_y].${i}?this[_y].${i}(...arguments):void 0)}`
                // r = `${funcname}(){return _fu("[${n}].${i}(*)", this[_y].${i}?this[_y].${i}(...arguments):arguments)}`
            }
            else{
                continue
                throw Error(i)
            }
            ret.push(`  `+r)
        }
        if (i !== 'constructor'){
            b.push(['function', i, v[i]])
        }
        ret.join('\n')
    }
    ret.push('}')
    ret.push(`${n}._new = function(){var _tmp=v_t;v_t=false;var r=new ${n};v_t=true;v_t=_tmp;return hook_obj(r, '  (o) ${n}')}`)
    // ret.push(`${n}._new = function(){var _tmp=v_t;v_t=false;var r=new ${n};if (${n}._init){${n}._init(r)};v_t=true;v_t=_tmp;return hook_obj(r, '  (o) ${n}')}`)
    ret.push(`saf_class(${n})`)
    ret.push(`_ods(${n}.prototype, {`)
    for (var [tp, i, val] of b){
        if (tp == 'number' || tp == 'boolean'){
            var jsondata = JSON.stringify(val)
            jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"value":', '[_v]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
            ret.push(`  ${JSON.stringify(i)}: ${jsondata},`)
        }else{
            var jsondata = JSON.stringify(val)
            jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"value":', '[_v]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
            ret.push(`  ${JSON.stringify(i)}: ${jsondata},`)
        }
    }
    var s = Object.getOwnPropertySymbols(v)
    for (var i in s){
        var symbolname = /\((.+)\)/.exec(s[i].toString())[1]
        if (typeof v[s[i]].value == 'function' && !((v[s[i]].value+'').startsWith("function ["))){
            var funcname = (/function ([^ (]+)/.exec(v[s[i]].value+'') || ["", ""])[1]
            // var meta_funcname = n+'_'+funcname
            // v[s[i]].value = meta_funcname
            // ret.unshift(`${meta_funcname} = saf(function ${funcname}(){})`)
            // var jsondata = JSON.stringify(v[s[i]]).replace(`"${meta_funcname}"`, `${meta_funcname}`)
            v[s[i]].value = 'vilameplaceholder'
            var jsondata = JSON.stringify(v[s[i]]).replace(`"vilameplaceholder"`, `saf(function ${funcname}(){})`)
        }else{
            var jsondata = JSON.stringify(v[s[i]])
        }
        jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"value":', '[_v]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
        ret.push(`  [${symbolname}]: ${jsondata},`)
    }
    ret.push(`});`)
    ret.push(`_ods(${n}, {`)
    var k = Object.getOwnPropertyDescriptors(objfunc)
    var b = Object.keys(k)
    for (var i = 0; i < b.length; i++) {
        if (b[i] !== 'prototype'){
            var jsondata = JSON.stringify(k[b[i]])
            jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"value":', '[_v]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
            ret.push(`  ${JSON.stringify(b[i])}: ${jsondata},`)
        }
    }
    ret.push(`});`)

    // tail
    for (var i = 0; i < ret.length; i++) {
        ret[i] = `  ` + ret[i]
    }
    ret.unshift(`function make_${n}(){`)
    ret.push(`  return ${n}`)
    ret.push(`}`)
    ret.push(`var ${n} = make_${n}()`)
    ret = ret.join('\n') + '\n'
    if (v_global_func.indexOf(n) == -1){
        v_global_func.push(n)
    }
    var rr = {'key': [n, e], 'string': ret}
    return rr
}


var v_str_saf = `
// saf
var saf,saf_class;
;(function(){
  var $toString = Function.toString
    , cacheI = []
    , cacheS = []
    , idxI = [].indexOf.bind(cacheI)
    , pushI = [].push.bind(cacheI)
    , pushS = [].push.bind(cacheS)
  Object.defineProperty(Function.prototype, 'toString', {
    "enumerable": !1, "configurable": !0, "writable": !0,
    "value": function toString() {
      return typeof this == 'function' && cacheS[idxI(this)] || $toString.call(this);
    }
  })
  function safe_func(func, name){
    if (-1 == idxI(func)){
      pushI(func)
      pushS(\`function \${name || func.name || ''}() { [native code] }\`)
    }
    return func
  };
  safe_func(Function.prototype.toString, 'toString')
  saf = safe_func
  var ogpds = Object.getOwnPropertyDescriptors
  var ok = Object.keys
  saf_class=function(t) {
    saf(t);for (var e=ogpds(t.prototype),o=ok(e),n=0;n<o.length; n++){
    var r=e[o[n]].value;r&&"function"==typeof r&&"constructor"!==o[n]&&saf(t.prototype[o[n]]);
    r=e[o[n]].get;r&&"function"==typeof r&&"constructor"!==o[n]&&saf(r);
    r=e[o[n]].set;r&&"function"==typeof r&&"constructor"!==o[n]&&saf(r);}}
})();
`

eval(v_str_saf)





function v_mk_head_WindowProperties(){
    return `

var util = (typeof require!=='undefined')?require('util'):{inspect:function(e){return e+''}}
var _h = true // 是否挂钩对象
var _lin = false // 是否显示输出地址
var _ods = Object.defineProperties
var _odt = Object.defineProperty
var _ojk = Object.keys
var _sfy = JSON.stringify
var _iar = Array.isArray
var _ter = TypeError
var _tpe = function(x){var r=_ter(x);r.stack=\`Uncaught TypeError: \${x}\\n    at \${location[_y].origin+'/fake.js'}:4:9\\n    at \${location[_y].origin+'/fake.js'}:599:2\`;return r}
var _ntpe = function(x){var r=_ter(x);r.stack=\`Uncaught TypeError: \${x}\\n    at \${location[_y].origin+'/fake.js'}:4:9\\n    at \${location[_y].origin+'/fake.js'}:599:2\`;return r}
var _w = 'writable'
var _e = 'enumerable'
var _c = 'configurable'
var _v = 'value'
var _g = 'get'
var _s = 'set'
var _ti = +new Date
var _objp = Object.prototype
var _isvm = typeof global == 'undefined' // 用作区别于 node 与使用 vm2 库时的标记
var _slice = Date.call.bind(Date.call, [].slice)
var _join = Date.call.bind(Date.call, [].join)
var _le = 60
var _rd = (function() { var seed = 11111; return function random() { return seed = (seed * 9301 + 49297) % 233280, (seed / 233280)} })();
var _m = function(){try{
  arguments[2] = arguments[2].toString()
  var title = _join(_slice(arguments,0,3), ' ')
  title += title.length>_le?'':' '.repeat(_le-title.length)
  if(_lin){
    var linfo = Error()
    var line = linfo.stack.split('\\n')[4]
    var lines = /([^\\(\\) ]+):\\d+:\\d+/.exec(line)
    var line = lines?line.replace(lines[0], lines[0].replace(lines[1], v_encodeURI('file:///' + lines[1].replace(/\\\\/g, '/')))):''
  }else{
    var line = ''
  }
  _bl(title + arguments[3], util.inspect(arguments[4]).split('\\n')[0], _join(_slice(arguments,5), ' '), line)
}catch(e){_bl('[ LOG ERROR ]', e.stack)}}
var _gs = function(a, b){
  // _bl('  >>>', a, util.inspect(b).split('\\n').slice(0, 1).join('\\n')) // 暂时无大用，输出多了影响观察
  return b;
}
var _ogs = function(a, b){
  // if(v_t){_bl('  o=>', a, util.inspect(b).split('\\n').slice(0, 1).join('\\n'))}
  return b;
}
var _fu = function(a, b, c){
  if(v_t){_bl('  (*)', a, util.inspect(b).split('\\n').slice(0, 10).join('\\n')+'...', '===>', c)}
  return c
}


function hook_obj_prototype(obj, hook_ca){
  var name = /function\\s+([^(\\s]+)/.exec(obj+'')[1]
  function _obj(){return obj.apply(this, arguments)}
  saf(_obj, name)
  var _desc = Object.getOwnPropertyDescriptors(obj)
  var _proto = _desc['prototype']
  var e = 'enumerable'
  var w = 'writable'
  var c = 'configurable'
  var _e = _proto[e]
  var _w = _proto[w]
  var _c = _proto[c]
  delete _desc['prototype']
  if (hook_ca){
    _obj = new Proxy(_obj, {
      construct:function(a,b,c){
        if (v_t){_m(name,'[construct]',b,'<==>',typeof c=='function'?(c+'').slice(0,100):c?_sfy(c).slice(0,100)+'...':c)};
        return Reflect.construct(a,b,c)
      },
      apply: function(a,b,c){
        try{
          var r = Reflect.apply(a,b,c)
          if (v_t){_m(name,'[apply]',c,'<==>',r)};
          return r
        }catch(e){
          if (v_t){_m(name,'[apply]',c,'<==>','[ ERROR ]')};
          return 
        }
      }
    })
  }
  _desc['prototype'] = {value:new Proxy(_proto.value, {
    get:function(a,b){
      var r = Reflect.get(a,b)
      var l = r
      if (typeof r == "number" || typeof r == "boolean" || _iar(r)){ l = _sfy(r) }
      else if(typeof r == 'function'){ l = (r + '').slice(0,100)+'...' }
      else{ l = r }
      if (v_t){_m(name,'[prototype.get]',b,'<==>',l)};
      return r;
    },
    set:function(a,b,c){
      if (v_t){_m(name,'[prototype.set]',b,'<==>',typeof c=='function'?(c+'').slice(0,100):c?_sfy(c).slice(0,100)+'...':c)};
      return Reflect.set(a,b,c)
    },
  }),[e]:_e,[w]:_w,[c]:_c}
  return _ods(_obj, _desc)
}

function hook_obj(r,n){
  if (!_h){return r}
  return new Proxy(r, {
    get:function(a,b){
      try{
        var r = Reflect.get(a,b)
      }catch(e){
        _m(n?n:a,'[get]',b,'<==>','[ ERROR ]')
        throw e
      }
      var l = r
      if (typeof r == "number" || typeof r == "boolean" || _iar(r)){ l = r; }
      else if(typeof r == 'function'){ l = (r + '').slice(0,100)+'...' }
      else{ l = r }
      if (v_t&&typeof b!='symbol'&&b!='toJSON'){_m(n?n:a,'[get]',b,'<==>',l)};
      if (b == 'hasOwnProperty'){
        var tmp = a[b]
        return function(){
          return _fu('hasOwnProperty', arguments, tmp.apply(this, arguments))
        }
      }
      return r;
    },
    set:function(a,b,c){
      if (v_t&&typeof b!='symbol'){_m(n?n:a,'[set]',b,'<==>',typeof c=='function'?(c+'').slice(0,100)+'...':c?_sfy(c).slice(0,100)+'...':c)};
      return Reflect.set(a,b,c)
    },
  })
}

console.log('start') // 勿删
Function = hook_obj_prototype(Function, true) // Function 的 construct 和 apply 非常重要，需要特别关注
// Object = hook_obj_prototype(Object)
// Array = hook_obj_prototype(Array)
Number = hook_obj_prototype(Number)
Boolean = hook_obj_prototype(Boolean)
String = hook_obj_prototype(String)
Symbol = hook_obj_prototype(Symbol)
RegExp = hook_obj_prototype(RegExp)
Error = hook_obj_prototype(Error)
ReferenceError = hook_obj_prototype(ReferenceError)
// Date = hook_obj_prototype(Date)

function hook_especially(e){
  if (e == Object){ var check = [ 'defineProperties','defineProperty','keys','assign' ], name = 'Object' }
  if (e == Date.prototype){ var check = [ 'getTime','valueOf' ], name = 'Date.prototype' }
  if (e == Date){ var check = [ 'now' ], name = 'Date' }
  if (e == Math){ var check = [ 'random' ], name = 'Math' }
  return new Proxy(e, {get: function(a,b){
    if (check.indexOf(b) != -1){
      if (v_t){_bl(\`  >>> get \${name}.\${b}\`)}
    }
    return Reflect.get(a,b)
  }})
}

// 高频函数调用
Object = hook_especially(Object)
Date = hook_especially(Date)
Date.prototype = hook_especially(Date.prototype)
// Math = hook_especially(Math)

var v_parse = JSON.parse
var v_stringify = JSON.stringify
var v_decodeURI = decodeURI
var v_decodeURIComponent = decodeURIComponent
var v_encodeURI = encodeURI
var v_encodeURIComponent = encodeURIComponent
var v_escape = escape
var v_unescape = unescape
JSON.parse = saf(function parse(){return _fu('JSON.parse', arguments, v_parse.apply(this, arguments))})
JSON.stringify = saf(function stringify(){return _fu('JSON.stringify', arguments, v_stringify.apply(this, arguments))})
decodeURI = saf(function decodeURI(){return _fu('decodeURI', arguments, v_decodeURI.apply(this, arguments))})
decodeURIComponent = saf(function decodeURIComponent(){return _fu('decodeURIComponent', arguments, v_decodeURIComponent.apply(this, arguments))})
encodeURI = saf(function encodeURI(){return _fu('encodeURI', arguments, v_encodeURI.apply(this, arguments))})
encodeURIComponent = saf(function encodeURIComponent(){return _fu('encodeURIComponent', arguments, v_encodeURIComponent.apply(this, arguments))})
escape = saf(function escape(){return _fu('escape', arguments, v_escape.apply(this, arguments))})
unescape = saf(function unescape(){return _fu('unescape', arguments, v_unescape.apply(this, arguments))})

if (_isvm){
  delete v_this.Buffer
  delete v_this.VMError
}else{
  delete global.Buffer
}










function make_EventTarget(){
  class EventTarget{
    constructor(){ _odt(this, _y, {[_e]:!1,[_c]:!1,[_w]:!1,[_v]:{}});if (EventTarget._init){EventTarget._init(this)};  }
    addEventListener(){return _fu("[EventTarget].addEventListener(*)", arguments, (this||window)[_y].addEventListener?(this||window)[_y].addEventListener(...arguments):void 0)}
    dispatchEvent(){return _fu("[EventTarget].dispatchEvent(*)", arguments, (this||window)[_y].dispatchEvent?(this||window)[_y].dispatchEvent(...arguments):void 0)}
    removeEventListener(){return _fu("[EventTarget].removeEventListener(*)", arguments, (this||window)[_y].removeEventListener?(this||window)[_y].removeEventListener(...arguments):void 0)}
  }
  EventTarget._new = function(){var _tmp=v_t;v_t=false;var r=new EventTarget;v_t=true;v_t=_tmp;return hook_obj(r, '  (o) EventTarget')}
  saf_class(EventTarget)
  _ods(EventTarget.prototype, {
    "addEventListener": {[_w]:!0,[_e]:!0,[_c]:!0},
    "dispatchEvent": {[_w]:!0,[_e]:!0,[_c]:!0},
    "removeEventListener": {[_w]:!0,[_e]:!0,[_c]:!0},
    [Symbol.toStringTag]: {[_v]:"EventTarget",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  _ods(EventTarget, {
    "length": {[_v]:0,[_w]:!1,[_e]:!1,[_c]:!0},
    "name": {[_v]:"EventTarget",[_w]:!1,[_e]:!1,[_c]:!0},
    "arguments": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
    "caller": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
  });
  return EventTarget
}
var EventTarget = make_EventTarget()

function make_WindowProperties(){
  class WindowProperties extends EventTarget{ 
    constructor(){ super(); if(v_t){ throw _ntpe() } }
  }
  saf(WindowProperties, 'EventTarget');
  _ods(WindowProperties.prototype, { 
    [Symbol.toStringTag]: { value: "WindowProperties", configurable: !0 } 
  });
  return WindowProperties
}
var WindowProperties = make_WindowProperties()
delete WindowProperties.prototype.constructor // WindowProperties 这个是特殊的，另外 WindowProperties 在 window 环境里面不存在，注意

function make_Window(){
  class Window extends WindowProperties{
    constructor(){ super(); if(v_t){ throw _ntpe() } }
  }
  saf_class(Window)
  _ods(Window.prototype, {
    "TEMPORARY": {"value":0,[_w]:!1,[_e]:!0,[_c]:!1},
    "PERSISTENT": {"value":1,[_w]:!1,[_e]:!0,[_c]:!1},
    [Symbol.toStringTag]: {"value":"Window",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  _ods(Window, {
    "length": {"value":0,[_w]:!1,[_e]:!1,[_c]:!0},
    "name": {"value":"Window",[_w]:!1,[_e]:!1,[_c]:!0},
    "arguments": {"value":null,[_w]:!1,[_e]:!1,[_c]:!1},
    "caller": {"value":null,[_w]:!1,[_e]:!1,[_c]:!1},
    "TEMPORARY": {"value":0,[_w]:!1,[_e]:!0,[_c]:!1},
    "PERSISTENT": {"value":1,[_w]:!1,[_e]:!0,[_c]:!1},
  });
  return Window
}
var Window = make_Window()

function make_MemoryInfo(){
  class MemoryInfo{
    constructor(){ _odt(this, _y, {[_e]:!1,[_c]:!1,[_w]:!1,[_v]:{}});if (MemoryInfo._init){MemoryInfo._init(this)}; if(v_t){ throw _ntpe() } }
    get jsHeapSizeLimit(){if(!(this instanceof MemoryInfo)){throw _tpe('Illegal invocation')}return _gs("[console.memory].get jsHeapSizeLimit", this[_y].jsHeapSizeLimit)}
    get totalJSHeapSize(){if(!(this instanceof MemoryInfo)){throw _tpe('Illegal invocation')}return _gs("[console.memory].get totalJSHeapSize", this[_y].totalJSHeapSize)}
    get usedJSHeapSize(){if(!(this instanceof MemoryInfo)){throw _tpe('Illegal invocation')}return _gs("[console.memory].get usedJSHeapSize", this[_y].usedJSHeapSize)}
  }
  MemoryInfo._new = function(){var _tmp=v_t;v_t=false;var r=new MemoryInfo;v_t=true;v_t=_tmp;return hook_obj(r, '  (o) MemoryInfo')}
  saf_class(MemoryInfo)
  _ods(MemoryInfo.prototype, {
    "jsHeapSizeLimit": {[_e]:!0,[_c]:!0},
    "totalJSHeapSize": {[_e]:!0,[_c]:!0},
    "usedJSHeapSize": {[_e]:!0,[_c]:!0},
    [Symbol.toStringTag]: {"value":"MemoryInfo",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  return MemoryInfo
}
var MemoryInfo = make_MemoryInfo()
MemoryInfo._init = function(_this){
  _this[_y].jsHeapSizeLimit = 4294705152
  _this[_y].totalJSHeapSize = 27739528
  _this[_y].usedJSHeapSize = 21954156
}


`
}

function v_make_model_from_obj(obj, prefix){
    var customized = ['MimeTypeArray', 'PluginArray']
    var ret = []
    var v = obj.constructor
    var newname = /function ([^(]+)/.exec(v+'')[1]
    // if (v_filter(newname)){
    //     return ''
    // }
    ret.push(`function init_${newname}(n,r){`)
    if (newname == 'Promise'){
      ret.push(`  r = new ${newname}(function(resolve, reject){})`)
    }else{
      ret.push(`  r = new ${newname}`)
    }
    ret.push(`  if(r._init){r._init(r)}`)
    if (customized.indexOf(newname) == -1){
      var v = Object.getOwnPropertyDescriptors(obj.constructor.prototype)
      var k = Object.keys(v)
      for (var i in k){
          var name = k[i]
          if ('get' in v[name]){
              // if (typeof obj[name] !== 'object' || obj[name] == null){
              var tpname = /\[object (.*)\]/.exec(Object.prototype.toString.call(obj[name]))[1]
              console.log(name, tpname)
              if (['Null','Undefined','String','Boolean','Array','Object','Number'].indexOf(tpname) != -1){
                  var key = name
                  var val = obj[name]
                  ret.push(`  r[_y].${key} = ${JSON.stringify(val)}`)
              }else{
                  var inglobal;
                  try{
                      eval(tpname)
                      inglobal = true
                  }catch(e){
                      inglobal = false
                  }
                  // console.log(name, tpname, inglobal, obj[name])
                  if (inglobal){
                      var rv = v_get_model_from_native(eval(tpname))
                      var qq = v_make_model_from_obj(obj[name], prefix)
                      rv['string'] += qq
                      rv['have_init'] = true
                      // console.log(rv['string'])
                      prefix.unshift(rv)
                      ret.push(`  r[_y].${name} = init_${tpname}();`)
                  }else{
                      // 这里暂时处理不了那种 global 中没有的模型类，比如 DeprecatedStorageQuota 这个
                      console.log('unhandle obj.', name)
                      // console.log(v_get_model_from_native(obj[name].__proto__) + v_make_model_from_obj(obj[name]))
                  }
              }
          }
      }
      var v = Object.getOwnPropertyDescriptors(obj)
      var k = Object.keys(v)
      ret.push(`  _ods(r, {`)
      var indx = ret.length
      for (var i in k){
          var name = k[i]
          if ('get' in v[name]){
              // 按道理是不应该走到这里的
              v[name]['get'] = 'vilameplaceholder_get'
              if ('set' in v[name]){
                  v[name]['set'] = 'vilameplaceholder_set'
              }
              var jsondata = JSON.stringify(v[name])
              jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"get":', '[_g]:').replace('"set":', '[_s]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
              jsondata = jsondata.replace('"vilameplaceholder_get"', `saf(function ${name}(){return _ogs("[${newname}.${name}] get", this[_y].${name})})`)
              jsondata = jsondata.replace('"vilameplaceholder_set"', `saf(function ${name}(v){return _ogs("[${newname}.${name}] set", this[_y].${name}=v)})`)
              console.log(name, v[name], 'unknown', jsondata)
              ret.push(`    ${JSON.stringify(name)}: ${jsondata},`)
          }
          if ('value' in v[name]){
              var inglobal;
              var init_obj;
              try{
                  if ((eval(name) + '').indexOf('{ [native code] }') != -1 && (eval(name) + '').indexOf('$') == -1){
                      inglobal = true
                  }else{
                      inglobal = false
                  }
              }catch(e){
                  inglobal = false
              }
              if (inglobal){
                  try{
                      // console.log('==============', name, v[name].value, v)
                      var rv = v_get_model_from_native(eval(name))
                      prefix.unshift(rv)
                      init_obj = rv.trim()?true:false
                  }catch(e){
                      init_obj = false
                  }
              }
              // "[object Null]"
              // "[object Undefined]"
              // "[object String]"
              // "[object Boolean]"
              // "[object Array]"
              // var tpname = /\[object (.*)\]/.exec(Object.prototype.toString.call(v[name].value))[1]
              // console.log(name, v[name])
              try{
                  if (init_obj || (newname == 'Window' && v_global_func.indexOf(name) != -1) || v_filter(name) || v_filter2(name)){
                      if (v_filter2(name)){
                          v[name].value = 'vilameplaceholder'
                          // var jsondata = JSON.stringify(v[name]).replace(`"vilameplaceholder"`, `saf(function ${name}(){if(window[_y].${name}){return window[_y].${name}(...arguments)}})`)
                          // var jsondata = JSON.stringify(v[name]).replace(`"vilameplaceholder"`, `saf(function ${name}(){var _tmp;if(window[_y].${name}){_tmp=1;}return _fu("[window].${name}(*)", _tmp?window[_y].${name}(...arguments):arguments, _tmp)})`)
                          var jsondata = JSON.stringify(v[name]).replace(`"vilameplaceholder"`, `saf(function ${name}(){return _fu("[window].${name}(*)", arguments, window[_y].${name}?window[_y].${name}(...arguments):void 0)})`)
                      }else{
                          v[name].value = 'vilameplaceholder'
                          var jsondata = JSON.stringify(v[name]).replace(`"vilameplaceholder"`, `${name}`)
                      }
                  }else{
                      if (newname == 'Window'){
                        console.log(v[name], name, '11111111111111')
                        console.log(v[name].value+'', )
                      }
                      var jsondata = JSON.stringify(v[name])
                  }
                  if (!(newname=='Window' && (name.startsWith('v_')||name.startsWith('$')||name=='saf_class'||name=='saf'||   ((v[name].value+'').indexOf('[Command Line API]')!=-1)   ))){
                      jsondata = jsondata.replace('"writable":', '[_w]:').replace('"enumerable":', '[_e]:').replace('"configurable":', '[_c]:').replace('"value":', '[_v]:').replace(/:true/g, ':!0').replace(/:false/g, ':!1')
                      ret.push(`    ${JSON.stringify(name)}: ${jsondata},`)
                  }
              }catch(e){
                  console.log(e.stack,v,name)
                  if (e.stack.indexOf('circular') != -1){
                      ret.push(`    ${JSON.stringify(name)}: r,`)
                  }
              }
          }
      }
      if (indx == ret.length){
        ret.pop()
      }else{
        ret.push(`  });`)
      }
    }
    // ret.push(`  return r`)
    ret.push(`  return hook_obj(r,n)`)
    ret.push(`}`)
    return ret.join('\n')
}

// v = v_mk_head_WindowProperties()
// v += v_get_model_from_native(NetworkInformation) + v_make_model_from_obj(navigator.connection)
// console.log(v)
// eval(v)
// console.log(r)


var v_global_s = []
var v_global_func = []
function v_global_init(s){
    var top = ['EventTarget']
    for (var i = 0; i < s.length; i++) {
        var t = s[i]['key']
        if (t&&!t[1]){
            if (top.indexOf(t[0]) == -1){
                top.push(t[0])
            }
        }
    }
    for (var x = 0; x < 10; x++) {
        for (var i = 0; i < s.length; i++) {
            var t = s[i]['key']
            if (t&&t[0]&&top.indexOf(t[1])!=-1){
                if (top.indexOf(t[0]) == -1){
                    top.push(t[0])
                }
            }
        }
    }
    // console.log(top)
    var ret = []
    for (var j = 0; j < top.length; j++) {
        if (top[j] == 'EventTarget'){
          continue
        }
        var temp = []
        for (var i = 0; i < s.length; i++) {
            if (s[i]['key']&&s[i]['key'][0]===top[j]){
                // ret.push(s[i]['string'])
                temp.push(s[i])
            }
        }
        var ctnue = false
        for (var i = 0; i<temp.length; i++){
            if (temp[i]['have_init']){
                ret.push(temp[i]['string'])
                ctnue = true
            }
        }
        if (!ctnue && temp.length){
            ret.push(temp[temp.length-1]['string'])
        }
    }
    // console.log(ret)
    ret = ret.join('\n')
    console.log(ret)
    return ret
}

v_make_its = []
function v_make_it(o){
    var t = eval((/\[object (.*)\]/.exec(Object.prototype.toString.call(o)) || ["",""])[1])
    v_global_s.unshift(v_get_model_from_native(t))
    v = v_make_model_from_obj(o, v_global_s)
    if (v_make_its.indexOf(v) == -1){
      v_make_its.push(v)
      return v
    }else{
      return ''
    }
}

v_ret = ''
v_ret += v_make_it(window) + '\n'
v_ret += v_make_it(caches) + '\n'
v_ret += v_make_it(clientInformation) + '\n'
v_ret += v_make_it(cookieStore) + '\n'
v_ret += v_make_it(crypto) + '\n'
v_ret += v_make_it(customElements) + '\n'
v_ret += v_make_it(document) + '\n'
v_ret += v_make_it(external) + '\n'
v_ret += v_make_it(history) + '\n'
v_ret += v_make_it(indexedDB) + '\n'
v_ret += v_make_it(localStorage) + '\n'
v_ret += v_make_it(locationbar) + '\n'
v_ret += v_make_it(menubar) + '\n'
v_ret += v_make_it(navigator) + '\n'
v_ret += v_make_it(performance) + '\n'
v_ret += v_make_it(personalbar) + '\n'
v_ret += v_make_it(screen) + '\n'
v_ret += v_make_it(scrollbars) + '\n'
v_ret += v_make_it(sessionStorage) + '\n'
v_ret += v_make_it(statusbar) + '\n'
v_ret += v_make_it(toolbar) + '\n'
v_ret += v_make_it(trustedTypes) + '\n'
v_ret += v_make_it(visualViewport) + '\n'
// v_ret += v_make_it(location) + '\n'
// v_ret += v_make_it(styleMedia) + '\n'
// v_ret += v_make_it(speechSynthesis) + '\n'
v_ret += `
function init_Location(n,r){
  r = new Location
  if(r._init){r._init(r)}
  _ods(r, {
    "valueOf": {[_v]:saf(function valueOf(){return _fu("[location].valueOf(*)", arguments, location[_y].valueOf?location[_y].valueOf(...arguments):void 0)}),[_w]:!1,[_e]:!1,[_c]:!1},
    "ancestorOrigins": {[_g]:saf(function ancestorOrigins(){return _ogs("[Location.ancestorOrigins] get", this[_y].ancestorOrigins)}),[_s]:saf(function ancestorOrigins(v){return _ogs("[Location.ancestorOrigins] set", this[_y].ancestorOrigins=v)}),[_e]:!0,[_c]:!1},
    "href": {[_g]:saf(function href(){return _ogs("[Location.href] get", this[_y].href)}),[_s]:saf(function href(v){return _ogs("[Location.href] set", this[_y].href=v)}),[_e]:!0,[_c]:!1},
    "origin": {[_g]:saf(function origin(){return _ogs("[Location.origin] get", this[_y].origin)}),[_s]:saf(function origin(v){return _ogs("[Location.origin] set", this[_y].origin=v)}),[_e]:!0,[_c]:!1},
    "protocol": {[_g]:saf(function protocol(){return _ogs("[Location.protocol] get", this[_y].protocol)}),[_s]:saf(function protocol(v){return _ogs("[Location.protocol] set", this[_y].protocol=v)}),[_e]:!0,[_c]:!1},
    "host": {[_g]:saf(function host(){return _ogs("[Location.host] get", this[_y].host)}),[_s]:saf(function host(v){return _ogs("[Location.host] set", this[_y].host=v)}),[_e]:!0,[_c]:!1},
    "hostname": {[_g]:saf(function hostname(){return _ogs("[Location.hostname] get", this[_y].hostname)}),[_s]:saf(function hostname(v){return _ogs("[Location.hostname] set", this[_y].hostname=v)}),[_e]:!0,[_c]:!1},
    "port": {[_g]:saf(function port(){return _ogs("[Location.port] get", this[_y].port)}),[_s]:saf(function port(v){return _ogs("[Location.port] set", this[_y].port=v)}),[_e]:!0,[_c]:!1},
    "pathname": {[_g]:saf(function pathname(){return _ogs("[Location.pathname] get", this[_y].pathname)}),[_s]:saf(function pathname(v){return _ogs("[Location.pathname] set", this[_y].pathname=v)}),[_e]:!0,[_c]:!1},
    "search": {[_g]:saf(function search(){return _ogs("[Location.search] get", this[_y].search)}),[_s]:saf(function search(v){return _ogs("[Location.search] set", this[_y].search=v)}),[_e]:!0,[_c]:!1},
    "hash": {[_g]:saf(function hash(){return _ogs("[Location.hash] get", this[_y].hash)}),[_s]:saf(function hash(v){return _ogs("[Location.hash] set", this[_y].hash=v)}),[_e]:!0,[_c]:!1},
    "assign": {[_v]:saf(function assign(){return _fu("[location].assign(*)", arguments, location[_y].assign?location[_y].assign(...arguments):void 0)}),[_w]:!1,[_e]:!0,[_c]:!1},
    "reload": {[_v]:saf(function reload(){return _fu("[location].reload(*)", arguments, location[_y].reload?location[_y].reload(...arguments):void 0)}),[_w]:!1,[_e]:!0,[_c]:!1},
    "replace": {[_v]:saf(function replace(){return _fu("[location].replace(*)", arguments, location[_y].replace?location[_y].replace(...arguments):void 0)}),[_w]:!1,[_e]:!0,[_c]:!1},
    "toString": {[_v]:saf(function toString(){return _fu("[location].toString(*)", arguments, location[_y].toString?location[_y].toString(...arguments):void 0)}),[_w]:!1,[_e]:!0,[_c]:!1},
  });
  return hook_obj(r,n)
}

Location._init = function(_this){
  _this[_y].toString = function(){ return _this[_y].href }
  _this[_y].ancestorOrigins = DOMStringList._new()
  _this[_y].ancestorOrigins[_y].length = 0
  _this[_y].valueOf = function(){ 
    var tmp = v_t
    v_t = false
    var ret = {
      "valueOf": _this.valueOf,
      "ancestorOrigins": _this.ancestorOrigins,
      "href": _this.href,
      "origin": _this.origin,
      "protocol": _this.protocol,
      "host": _this.host,
      "hostname": _this.hostname,
      "port": _this.port,
      "pathname": _this.pathname,
      "search": _this.search,
      "hash": _this.hash,
      "assign": _this.assign,
      "reload": _this.reload,
      "replace": _this.replace,
      "toString": _this.toString,
    }
    v_t = tmp
    return ret
  }
}








// plugins/mimeTypes, only init once
var _tmp_plugins = {key:[], vals:{}}
MimeTypeArray._init = function(_this){
  function _mk_MimeType(a,b,c){
    var r = MimeType._new()
    r[_y].description = a
    r[_y].suffixes = b
    r[_y].type = c
    return r
  }
  function _mk_Plugin(a,b,c,d,e){
    var p = Plugin._new()
    for (var i = 0; i < a.length; i++) {
      p[i] = a[i][0]
      p[a[i][1]] = a[i][0]
      p[_y].description = b
      p[_y].filename = c
      p[_y].length = d
      p[_y].name = e
      p[_y][_y] = !p[_y][_y]?{}:p[_y][_y]
      p[_y][_y][i] = a[i][0]
      p[_y][_y][a[i][1]] = a[i][0]
      p[_y].namedItem = p[_y].item = function(n){
        return p[_y][_y][n] || null
      }
      a[i][0][_y].enabledPlugin = p
      if (_tmp_plugins.key.indexOf(a[i][1]) == -1){
        _tmp_plugins.key.push(a[i][1])
        _tmp_plugins.vals[a[i][1]] = p
      }
    }
  }
  _this[_y][0] = _mk_MimeType("", "pdf", "application/pdf")
  _mk_Plugin([[_this[_y][0], "application/pdf"]], "", "mhjfbmdgcfjbbpaeojofohoefgiehjai", 1, "Chrome PDF Viewer")
  _this[_y][1] = _mk_MimeType("Portable Document Format", "pdf", "application/x-google-chrome-pdf")
  _mk_Plugin([[_this[_y][1], "application/x-google-chrome-pdf"]], "Portable Document Format", "internal-pdf-viewer", 1, "Chrome PDF Plugin")
  _this[_y][2] = _mk_MimeType("Native Client Executable", "", "application/x-nacl")
  _this[_y][3] = _mk_MimeType("Portable Native Client Executable", "", "application/x-pnacl")
  _mk_Plugin([[_this[_y][2], "application/x-nacl"], [_this[_y][3], "application/x-pnacl"]], "", "internal-nacl-plugin", 2, "Native Client")
  _this[_y]["application/pdf"] = _this[_y][0]
  _this[_y]["application/x-google-chrome-pdf"] = _this[_y][1]
  _this[_y]["application/x-nacl"] = _this[_y][2]
  _this[_y]["application/x-pnacl"] = _this[_y][3]
  Object.defineProperties(_this, {
    '0': {[_v]:_this[_y][0],[_e]:!0,[_c]:!0,[_w]:!1},
    '1': {[_v]:_this[_y][1],[_e]:!0,[_c]:!0,[_w]:!1},
    '2': {[_v]:_this[_y][2],[_e]:!0,[_c]:!0,[_w]:!1},
    '3': {[_v]:_this[_y][3],[_e]:!0,[_c]:!0,[_w]:!1},
    'application/pdf': {[_v]:_this[_y][0],[_e]:!1,[_c]:!0,[_w]:!1},
    'application/x-google-chrome-pdf': {[_v]:_this[_y][1],[_e]:!1,[_c]:!0,[_w]:!1},
    'application/x-nacl': {[_v]:_this[_y][2],[_e]:!1,[_c]:!0,[_w]:!1},
    'application/x-pnacl': {[_v]:_this[_y][3],[_e]:!1,[_c]:!0,[_w]:!1},
  })
  _this[_y].length = 4
  _this[_y].namedItem = _this[_y].item = function(n){
    return _this[_y][n] || null
  }
}
PluginArray._init = function(_this){
  _this[_y].length = 3
  _this[_y].namedItem = _this[_y].item = function(n){
    return _this[_y][n] || null
  }
  for (var i = 0; i < _tmp_plugins.key.length; i++) {
    _this[_y][i] = _tmp_plugins.vals[_tmp_plugins.key[i]]
  }
  Object.defineProperties(_this, {
    '0': {[_v]:_this[_y][0],[_e]:!0,[_c]:!0,[_w]:!1},
    '1': {[_v]:_this[_y][1],[_e]:!0,[_c]:!0,[_w]:!1},
    '2': {[_v]:_this[_y][2],[_e]:!0,[_c]:!0,[_w]:!1},
    'Chrome PDF Plugin': {[_v]:_this[_y][0],[_e]:!1,[_c]:!0,[_w]:!1},
    'Chrome PDF Viewer': {[_v]:_this[_y][1],[_e]:!1,[_c]:!0,[_w]:!1},
    'Native Client': {[_v]:_this[_y][2],[_e]:!1,[_c]:!0,[_w]:!1},
  })
}

// 确保 _tmp_plugins 内正常，这里初始化一次
new MimeTypeArray
new PluginArray

URL.createObjectURL = saf(function createObjectURL(){return _fu("URL.createObjectURL(*)", arguments, this[_y].addEventListener?this[_y].addEventListener(...arguments):void 0)})
URL.revokeObjectURL = saf(function revokeObjectURL(){return _fu("URL.revokeObjectURL(*)", arguments, this[_y].addEventListener?this[_y].addEventListener(...arguments):void 0)})

StorageManager._init = function(_this){
  _this[_y].estimate = function(){
    return new class Promise{
      catch(callback){    window.addEventListener('load', function (){ return callback() }); return this}
      finally(callback){  window.addEventListener('load', function (){ return callback() }); return this}
      then(callback){     window.addEventListener('load', function (){ return callback() }); return this}
      get [Symbol.toStringTag](){ return 'Promise' }
    }
  }
}

Navigator._init = function(_this){
  _this[_y].getBattery = function(){
    this['battery'] = this['battery']?this['battery']:BatteryManager._new()
    var battery = this['battery']
    class Promise{ // 伪造一个仅用于电池处理的 Promise ，当程序加载至 load 阶段时将会启动这些函数执行。
      catch(callback){    window.addEventListener('load', function (){ return callback(battery) }); return this}
      finally(callback){  window.addEventListener('load', function (){ return callback(battery) }); return this}
      then(callback){     window.addEventListener('load', function (){ return callback(battery) }); return this}
      get [Symbol.toStringTag](){ return 'Promise' }
    }
    saf_class(Promise, 'Promise')
    return new Promise
  }
}

HTMLDocument._init = function(_this){
  _this[_y].referrer = ''
}

function v_hook_storage(e){
  e[_y].clear      = function(){          var self = e; Object.keys(self).forEach(function (key) { delete self[key]; }); }
  e[_y].getItem    = function(key){       var r = (e.hasOwnProperty(key)?String(e[key]):null); return r}
  e[_y].setItem    = function(key, val){  e[key] = (val === undefined)?null:String(val) }
  e[_y].key        = function(key){       return Object.keys(e)[key||0];} 
  e[_y].removeItem = function(key){       delete e[key];}
  _odt(e[_y], 'length', {get: function(){
    if(e===Storage.prototype){ throw _tpe('Illegal invocation') }return Object.keys(e).length
  }})
  return new Proxy(e,{ set:function(a,b,c){ return a[b]=String(c)}, get:function(a,b){ return a[b]},})
}

window = init_Window('window')
window = new Proxy(window, {
  get:function(a,b){return a[b]||global[b]},
  set:function(a,b,c){return (_isvm?v_this:global)[b]=a[b]=c}
})
window[_y].window            = window
window[_y].frames            = window
window[_y].parent            = window
window[_y].self              = window
window[_y].top               = window
window[_y].caches            = init_CacheStorage('caches')
window[_y].clientInformation = init_Navigator('navigator')
window[_y].cookieStore       = init_CookieStore('cookieStore')
window[_y].crypto            = init_Crypto('crypto')
window[_y].customElements    = init_CustomElementRegistry('customElements')
window[_y].document          = init_HTMLDocument('document')
window[_y].external          = init_External('external')
window[_y].history           = init_History('history')
window[_y].indexedDB         = init_IDBFactory('indexedDB')
window[_y].localStorage      = v_hook_storage(init_Storage('localStorage'), 'localStorage')
window[_y].locationbar       = init_BarProp('locationbar')
window[_y].menubar           = init_BarProp('menubar')
window[_y].navigator         = window[_y].clientInformation
window[_y].performance       = init_Performance('performance')
window[_y].personalbar       = init_BarProp('personalbar')
window[_y].screen            = init_Screen('screen')
window[_y].scrollbars        = init_BarProp('scrollbars')
window[_y].sessionStorage    = v_hook_storage(init_Storage('sessionStorage'), 'sessionStorage')
window[_y].statusbar         = init_BarProp('statusbar')
window[_y].toolbar           = init_BarProp('toolbar')
window[_y].trustedTypes      = init_TrustedTypePolicyFactory('trustedTypes')
window[_y].visualViewport    = init_VisualViewport('visualViewport')
window[_y].location          = window.document[_y].location = init_Location('location')

window[_y].onsearch = null
window[_y].onappinstalled = null
window[_y].onbeforeinstallprompt = null
window[_y].onbeforexrselect = null
window[_y].onabort = null
window[_y].onblur = null
window[_y].oncancel = null
window[_y].oncanplay = null
window[_y].oncanplaythrough = null
window[_y].onchange = null
window[_y].onclick = null
window[_y].onclose = null
window[_y].oncontextmenu = null
window[_y].oncuechange = null
window[_y].ondblclick = null
window[_y].ondrag = null
window[_y].ondragend = null
window[_y].ondragenter = null
window[_y].ondragleave = null
window[_y].ondragover = null
window[_y].ondragstart = null
window[_y].ondrop = null
window[_y].ondurationchange = null
window[_y].onemptied = null
window[_y].onended = null
window[_y].onerror = null
window[_y].onfocus = null
window[_y].onformdata = null
window[_y].oninput = null
window[_y].oninvalid = null
window[_y].onkeydown = null
window[_y].onkeypress = null
window[_y].onkeyup = null
window[_y].onload = null
window[_y].onloadeddata = null
window[_y].onloadedmetadata = null
window[_y].onloadstart = null
window[_y].onmousedown = null
window[_y].onmouseenter = null
window[_y].onmouseleave = null
window[_y].onmousemove = null
window[_y].onmouseout = null
window[_y].onmouseover = null
window[_y].onmouseup = null
window[_y].onmousewheel = null
window[_y].onpause = null
window[_y].onplay = null
window[_y].onplaying = null
window[_y].onprogress = null
window[_y].onratechange = null
window[_y].onreset = null
window[_y].onresize = null
window[_y].onscroll = null
window[_y].onseeked = null
window[_y].onseeking = null
window[_y].onselect = null
window[_y].onstalled = null
window[_y].onsubmit = null
window[_y].onsuspend = null
window[_y].ontimeupdate = null
window[_y].ontoggle = null
window[_y].onvolumechange = null
window[_y].onwaiting = null
window[_y].onwebkitanimationend = null
window[_y].onwebkitanimationiteration = null
window[_y].onwebkitanimationstart = null
window[_y].onwebkittransitionend = null
window[_y].onwheel = null
window[_y].onauxclick = null
window[_y].ongotpointercapture = null
window[_y].onlostpointercapture = null
window[_y].onpointerdown = null
window[_y].onpointermove = null
window[_y].onpointerup = null
window[_y].onpointercancel = null
window[_y].onpointerover = null
window[_y].onpointerout = null
window[_y].onpointerenter = null
window[_y].onpointerleave = null
window[_y].onselectstart = null
window[_y].onselectionchange = null
window[_y].onanimationend = null
window[_y].onanimationiteration = null
window[_y].onanimationstart = null
window[_y].ontransitionrun = null
window[_y].ontransitionstart = null
window[_y].ontransitionend = null
window[_y].ontransitioncancel = null
window[_y].onafterprint = null
window[_y].onbeforeprint = null
window[_y].onbeforeunload = null
window[_y].onhashchange = null
window[_y].onlanguagechange = null
window[_y].onmessage = null
window[_y].onmessageerror = null
window[_y].onoffline = null
window[_y].ononline = null
window[_y].onpagehide = null
window[_y].onpageshow = null
window[_y].onpopstate = null
window[_y].onrejectionhandled = null
window[_y].onstorage = null
window[_y].onunhandledrejection = null
window[_y].onunload = null
window[_y].ondevicemotion = null
window[_y].ondeviceorientation = null
window[_y].ondeviceorientationabsolute = null
window[_y].onpointerrawupdate = null

// 未被注入全局
function make_StyleMedia(){
  class StyleMedia extends Event{
    constructor(){ var _tmp=v_t;v_t=false;super();v_t=_tmp;if (StyleMedia._init){StyleMedia._init(this)};  }
    get type(){if(!(this instanceof StyleMedia)){throw _tpe('Illegal invocation')}return _gs("[StyleMedia].get type", this[_y].type)}
    matchMedium(){return _fu("[HIDDevice].matchMedium(*)", arguments, this[_y].matchMedium?this[_y].matchMedium(...arguments):void 0)}
  }
  StyleMedia._new = function(){var _tmp=v_t;v_t=false;var r=new StyleMedia;v_t=true;v_t=_tmp;return hook_obj(r, '  (o) StyleMedia')}
  saf_class(StyleMedia)
  _ods(StyleMedia.prototype, {
    "type": {[_e]:!0,[_c]:!0},
    [Symbol.toStringTag]: {[_v]:"StyleMedia",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  _ods(StyleMedia, {
    "name": {[_v]:"StyleMedia",[_w]:!1,[_e]:!1,[_c]:!0},
    "arguments": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
    "caller": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
  });
  return StyleMedia
}
var StyleMedia = make_StyleMedia()

// 未被注入全局
function make_DeprecatedStorageInfo(){
  class DeprecatedStorageInfo extends Event{
    constructor(){ var _tmp=v_t;v_t=false;super();v_t=_tmp;if (DeprecatedStorageInfo._init){DeprecatedStorageInfo._init(this)};  }
    queryUsageAndQuota(){return _fu("[DeprecatedStorageInfo].queryUsageAndQuota(*)", arguments, this[_y].queryUsageAndQuota?this[_y].queryUsageAndQuota(...arguments):void 0)}
    requestQuota(){return _fu("[DeprecatedStorageInfo].requestQuota(*)", arguments, this[_y].requestQuota?this[_y].requestQuota(...arguments):void 0)}
  }
  DeprecatedStorageInfo._new = function(){var _tmp=v_t;v_t=false;var r=new DeprecatedStorageInfo;v_t=true;v_t=_tmp;return hook_obj(r, '  (o) DeprecatedStorageInfo')}
  saf_class(DeprecatedStorageInfo)
  _ods(DeprecatedStorageInfo.prototype, {
    "TEMPORARY": {"value":0,[_w]:!1,[_e]:!0,[_c]:!1},
    "PERSISTENT": {"value":1,[_w]:!1,[_e]:!0,[_c]:!1},
    "type": {[_e]:!0,[_c]:!0},
    [Symbol.toStringTag]: {[_v]:"DeprecatedStorageInfo",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  _ods(DeprecatedStorageInfo, {
    "TEMPORARY": {"value":0,[_w]:!1,[_e]:!0,[_c]:!1},
    "PERSISTENT": {"value":1,[_w]:!1,[_e]:!0,[_c]:!1},
    "name": {[_v]:"DeprecatedStorageInfo",[_w]:!1,[_e]:!1,[_c]:!0},
    "arguments": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
    "caller": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
  });
  return DeprecatedStorageInfo
}
var DeprecatedStorageInfo = make_DeprecatedStorageInfo()

// 未被注入全局
function make_SpeechSynthesis(){
  class SpeechSynthesis extends Event{
    constructor(){ var _tmp=v_t;v_t=false;super();v_t=_tmp;if (SpeechSynthesis._init){SpeechSynthesis._init(this)};  }
    get onvoiceschanged(){if(!(this instanceof SpeechSynthesis)){throw _tpe('Illegal invocation')}return _gs("[SpeechSynthesis].get onvoiceschanged", this[_y].onvoiceschanged)}; set onvoiceschanged(v){return _gs("[SpeechSynthesis].set onvoiceschanged", this[_y].onvoiceschanged=v)}
    get paused(){if(!(this instanceof SpeechSynthesis)){throw _tpe('Illegal invocation')}return _gs("[SpeechSynthesis].get paused", this[_y].paused)};
    get pending(){if(!(this instanceof SpeechSynthesis)){throw _tpe('Illegal invocation')}return _gs("[SpeechSynthesis].get pending", this[_y].pending)};
    get speaking(){if(!(this instanceof SpeechSynthesis)){throw _tpe('Illegal invocation')}return _gs("[SpeechSynthesis].get speaking", this[_y].speaking)};
    cancel(){return _fu("[SpeechSynthesis].cancel(*)", arguments, this[_y].cancel?this[_y].cancel(...arguments):void 0)}
    getVoices(){return _fu("[SpeechSynthesis].getVoices(*)", arguments, this[_y].getVoices?this[_y].getVoices(...arguments):void 0)}
    pause(){return _fu("[SpeechSynthesis].pause(*)", arguments, this[_y].pause?this[_y].pause(...arguments):void 0)}
    resume(){return _fu("[SpeechSynthesis].resume(*)", arguments, this[_y].resume?this[_y].resume(...arguments):void 0)}
    speak(){return _fu("[SpeechSynthesis].speak(*)", arguments, this[_y].speak?this[_y].speak(...arguments):void 0)}
  }
  SpeechSynthesis._new = function(){var _tmp=v_t;v_t=false;var r=new SpeechSynthesis;v_t=true;v_t=_tmp;return hook_obj(r, '  (o) SpeechSynthesis')}
  saf_class(SpeechSynthesis)
  _ods(SpeechSynthesis.prototype, {
    [Symbol.toStringTag]: {[_v]:"SpeechSynthesis",[_w]:!1,[_e]:!1,[_c]:!0},
  });
  _ods(SpeechSynthesis, {
    "name": {[_v]:"SpeechSynthesis",[_w]:!1,[_e]:!1,[_c]:!0},
    "arguments": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
    "caller": {[_v]:null,[_w]:!1,[_e]:!1,[_c]:!1},
  });
  return SpeechSynthesis
}
var SpeechSynthesis = make_SpeechSynthesis()

SpeechSynthesis._init = function(_this){
  _this[_y].onvoiceschanged = null
  _this[_y].paused = false
  _this[_y].pending = false
  _this[_y].speaking = false
}

window[_y].devicePixelRatio = 1
window[_y].defaultStatus = ""
window[_y].styleMedia = StyleMedia._new()
window[_y].isSecureContext = true
window[_y].webkitStorageInfo = DeprecatedStorageInfo._new()
window[_y].speechSynthesis = SpeechSynthesis._new()
window[_y].originAgentCluster = false
window[_y].crossOriginIsolated = false

// window 的一些参数补充，方便处理
window[_y].innerWidth = 1920
window[_y].innerHeight = 937
window[_y].scrollX = 0
window[_y].scrollY = 0
window[_y].pageXOffset = 0
window[_y].pageYOffset = 0
window[_y].screenX = 0
window[_y].screenY = 0
window[_y].outerWidth = 1920
window[_y].outerHeight = 1040
window[_y].screenLeft = 0
window[_y].screenTop = 0
window[_y].name = ""
window[_y].status = ""
window[_y].closed = false
window[_y].length = 0
window[_y].opener = null
window[_y].frameElement = null
Object.defineProperty(window[_y], 'origin', {get:function(){return window[_y].location[_y].origin}})

window[_y].matchMedia = function(k){
  var r = MediaQueryList._new()
  r[_y].matches = true
  r[_y].media = k
  r[_y].onchange = null
  return r
}
function mk_atob_btoa(r){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);return{atob:function(r){var a,e,o,h,c,i,n;for(i=r.length,c=0,n="";c<i;){do{a=t[255&r.charCodeAt(c++)]}while(c<i&&-1==a);if(-1==a)break;do{e=t[255&r.charCodeAt(c++)]}while(c<i&&-1==e);if(-1==e)break;n+=String.fromCharCode(a<<2|(48&e)>>4);do{if(61==(o=255&r.charCodeAt(c++)))return n;o=t[o]}while(c<i&&-1==o);if(-1==o)break;n+=String.fromCharCode((15&e)<<4|(60&o)>>2);do{if(61==(h=255&r.charCodeAt(c++)))return n;h=t[h]}while(c<i&&-1==h);if(-1==h)break;n+=String.fromCharCode((3&o)<<6|h)}return n},btoa:function(r){var t,e,o,h,c,i;for(o=r.length,e=0,t="";e<o;){if(h=255&r.charCodeAt(e++),e==o){t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4),t+="==";break}if(c=r.charCodeAt(e++),e==o){t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4|(240&c)>>4),t+=a.charAt((15&c)<<2),t+="=";break}i=r.charCodeAt(e++),t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4|(240&c)>>4),t+=a.charAt((15&c)<<2|(192&i)>>6),t+=a.charAt(63&i)}return t}}}
var atob_btoa = mk_atob_btoa()
window[_y].btoa = atob_btoa.btoa
window[_y].atob = atob_btoa.atob

// styleMedia = init_StyleMedia('styleMedia')
// speechSynthesis = init_SpeechSynthesis('speechSynthesis')

// 将构造的各种参数直接传给 global 和环境下的 this 使用
Object.defineProperties(v_this, {[Symbol.toStringTag]:{value:'Window'}})
Object.defineProperties(v_this, Object.getOwnPropertyDescriptors(window))
if (_isvm){
  v_this.__proto__ = window.__proto__
}else{
  Object.defineProperties(global, Object.getOwnPropertyDescriptors(window))
}

delete console.Console
console.memory = MemoryInfo._new()

// performance 的时间校准模拟
_odt(performance[_y], 'timeOrigin', {get(){return _ti + 0.333}})
_odt(performance[_y].timing[_y], 'navigationStart', {get(){return _ti}})
_odt(performance[_y].timing[_y], 'unloadEventStart', {get(){return _ti + 11}})
_odt(performance[_y].timing[_y], 'unloadEventEnd', {get(){return _ti + 11}})
_odt(performance[_y].timing[_y], 'redirectStart', {get(){return 0}})
_odt(performance[_y].timing[_y], 'redirectEnd', {get(){return 0}})
_odt(performance[_y].timing[_y], 'fetchStart', {get(){return _ti + 1}})
_odt(performance[_y].timing[_y], 'domainLookupStart', {get(){return _ti + 1}})
_odt(performance[_y].timing[_y], 'domainLookupEnd', {get(){return _ti + 1}})
_odt(performance[_y].timing[_y], 'connectStart', {get(){return _ti + 1}})
_odt(performance[_y].timing[_y], 'connectEnd', {get(){return _ti + 1}})
_odt(performance[_y].timing[_y], 'secureConnectionStart', {get(){return 0}})
_odt(performance[_y].timing[_y], 'requestStart', {get(){return _ti + 5}})
_odt(performance[_y].timing[_y], 'responseStart', {get(){return _ti + 7}})
_odt(performance[_y].timing[_y], 'responseEnd', {get(){return _ti + 8}})
_odt(performance[_y].timing[_y], 'domLoading', {get(){return _ti + 15}})
_odt(performance[_y].timing[_y], 'domInteractive', {get(){return _ti + 50}})
_odt(performance[_y].timing[_y], 'domContentLoadedEventStart', {get(){return _ti + 50}})
_odt(performance[_y].timing[_y], 'domContentLoadedEventEnd', {get(){return _ti + 50}})
_odt(performance[_y].timing[_y], 'domComplete', {get(){return _ti + 50}})
_odt(performance[_y].timing[_y], 'loadEventStart', {get(){return _ti + 51}})
_odt(performance[_y].timing[_y], 'loadEventEnd', {get(){return _ti + 51}})
performance[_y].getEntriesByType = function(key){
  if (key === undefined){
    throw _tpe(\`Failed to execute 'getEntriesByType' on 'Performance': 1 argument required, but only 0 present.\`)
  }
  return []
}

PerformanceNavigationTiming._init = function(_this){
  _this[_y].connectEnd = 1.699999988079071
  _this[_y].connectStart = 1.699999988079071
  _this[_y].decodedBodySize = 440595
  _this[_y].domComplete = 873.5
  _this[_y].domContentLoadedEventEnd = 781.0999999642372
  _this[_y].domContentLoadedEventStart = 776.5
  _this[_y].domInteractive = 754.3000000119209
  _this[_y].domainLookupEnd = 1.699999988079071
  _this[_y].domainLookupStart = 1.699999988079071
  _this[_y].duration = 873.8000000119209
  _this[_y].encodedBodySize = 104181
  _this[_y].entryType = "navigation"
  _this[_y].fetchStart = 1.699999988079071
  _this[_y].initiatorType = "navigation"
  _this[_y].loadEventEnd = 873.8000000119209
  _this[_y].loadEventStart = 873.5
  _this[_y].name = window[_y].location[_y].href
  _this[_y].nextHopProtocol = "http/1.1"
  _this[_y].redirectCount = 0
  _this[_y].redirectEnd = 0
  _this[_y].redirectStart = 0
  _this[_y].requestStart = 9
  _this[_y].responseEnd = 320.0999999642372
  _this[_y].responseStart = 72.19999998807907
  _this[_y].secureConnectionStart = 1.699999988079071
  _this[_y].serverTiming = []
  _this[_y].startTime = 0
  _this[_y].transferSize = 104937
  _this[_y].type = "navigate"
  _this[_y].unloadEventEnd = 80
  _this[_y].unloadEventStart = 80
  _this[_y].workerStart = 0
}
window[_y].performance[_y]['cache'] = [PerformanceNavigationTiming._new()]
window[_y].performance[_y].mark = function(name){
  var _this = window[_y].performance
  if (name === undefined){
    throw _tpe(\`Failed to execute 'mark' on 'Performance': 1 argument required, but only 0 present.\`)
  }
  var r = PerformanceMark._new()
  r[_y].detail = null
  r[_y].duration = 0
  r[_y].entryType = "mark"
  r[_y].name = name
  if (!_this[_y].timeStamp){_odt(_this[_y], 'startTime', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y]['cache'].push(r)
}
window[_y].performance[_y].getEntries = function(){
  return window[_y].performance[_y]['cache']
}
window[_y].performance[_y].now = function(){
  return (++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)
}




















BatteryManager._init = function(_this){
  _this[_y].charging = true
  _this[_y].chargingTime = 0
  _this[_y].dischargingTime = Infinity
  _this[_y].level = 1
  _this[_y].onchargingchange = null
  _this[_y].onchargingtimechange = null
  _this[_y].ondischargingtimechange = null
  _this[_y].onlevelchange = null
}

HTMLCollection._init = function(_this){
  _odt(_this[_y], 'length', {get:function(){
    return _ojk(_this).length
  }})
  _this[_y].item = function(e){
    if (!arguments.length){
      throw _tpe("Failed to execute 'item' on 'HTMLCollection': 1 argument required, but only 0 present.")
    }
    return _this[e] || null
  }
}

NodeList._init = function(_this){
  _odt(_this[_y], 'length', {get:function(){
    return _ojk(_this).length
  }})
}

// 应对部分字体加密搞的一定随机性的处理
HTMLSpanElement._init = function(_this){
  _ods(_this[_y], {
    offsetWidth: { get: function(){ return 12+((_rd()>0.8)?1:0) } },
    offsetHeight: { get: function(){ return 12+((_rd()>0.8)?1:0) } }
  })
}

window[_y].getComputedStyle = function(element, pseudoElt){
  return element.style
}

HTMLScriptElement._init = function(_this){
  _this[_y].src = ''
  _this[_y].type = ''
  _this[_y].noModule = false
  _this[_y].charset = 
  _this[_y].async = true
  _this[_y].defer = false
  _this[_y].crossOrigin = null
  _this[_y].text = ''
  _this[_y].referrerPolicy = null
  _this[_y].event = ''
  _this[_y].htmlFor = ''
  _this[_y].integrity = ''
}

window[_y].listeners = {} // 全部监听事件，方便管理
function v_hook_getElement(e){
  e[_y].getElementById = function(){return window[_y].v_getele(...arguments)}
  e[_y].getElementsByClassName = function(){return window[_y].v_geteles(...arguments)}
  e[_y].getElementsByName = function(){return window[_y].v_geteles(...arguments)}
  e[_y].getElementsByTagName = function(){return window[_y].v_geteles(...arguments)}
  e[_y].getElementsByTagNameNS = function(){return window[_y].v_geteles(...arguments)}
  e[_y].querySelectorAll = function(){return window[_y].v_geteles(...arguments)}
  e[_y].querySelector = function(){return window[_y].v_getele(...arguments)}
  e[_y].style = CSSStyleDeclaration._new()
  e[_y].children = HTMLCollection._new()
  e[_y].childNodes = NodeList._new()
  e[_y]._listeners = {};
  e[_y].addEventListener = function(type, callback){
    if(!(type in this._listeners)) { this._listeners[type] = []; }
    this._listeners[type].push(callback);
    if(!(type in window[_y].listeners)) { window[_y].listeners[type] = []; }
    window[_y].listeners[type].push(callback);
  }
  e[_y].removeEventListener = function(type, callback){
    if(!(type in this._listeners)) { return; }
    var stack = this._listeners[type];
    for(var i = 0, l = stack.length; i < l; i++) { if(stack[i] === callback){ stack.splice(i, 1); return this.removeEventListener(type, callback); } }
  }
  e[_y].dispatchEvent = function(event){
    if(!(event.type in this._listeners)) { return true; }
    var stack = this._listeners[event.type];
    event[_y].target = this;
    for(var i = 0, l = stack.length; i < l; i++) { stack[i].call(this, event); }
    return true
  }
  e[_y].getBoundingClientRect = function(){
    var r = DOMRect._new()
    r.x = 123
    r.y = 333
    r.width = 100
    r.height = 200
    return r
  }
  _odt(e[_y], 'innerHTML', {set: function(ihtml){
    var x = /^ *< *([^> ]+) *[^>]+>(.*)< *\\/ *([^> ]+) *> *$/.exec(ihtml)
    if (x && (x[1] == x[3]) && x[1]){
      var r = document[_y].createElement(x[1])
      _odt(r, 'innerHTML', {get: function(){return x[2]}})
      e[_y].children[0] = r
      e[_y].childNodes[0] = r
      e[_y].firstChild = r
    }
    return ihtml
  }})
}
v_hook_getElement(window)
v_hook_getElement(document)
document[_y].createElement = function(name){
  var htmlmap = {
    HTMLElement: ["abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "dd", "dfn", "dt", "em", 
                  "figcaption", "figure", "footer", "header", "hgroup", "i", "kbd", "main", "mark", "nav", "noscript", 
                  "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"],
    HTMLAnchorElement: ["a"],          HTMLImageElement: ["img"],         HTMLFontElement: ["font"],                                HTMLOutputElement: ["output"], 
    HTMLAreaElement: ["area"],         HTMLInputElement: ["input"],       HTMLFormElement: ["form"],                                HTMLParagraphElement: ["p"], 
    HTMLAudioElement: ["audio"],       HTMLLabelElement: ["label"],       HTMLFrameElement: ["frame"],                              HTMLParamElement: ["param"], 
    HTMLBaseElement: ["base"],         HTMLLegendElement: ["legend"],     HTMLFrameSetElement: ["frameset"],                        HTMLPictureElement: ["picture"], 
    HTMLBodyElement: ["body"],         HTMLLIElement: ["li"],             HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"], HTMLPreElement: ["listing", "pre", "xmp"], 
    HTMLBRElement: ["br"],             HTMLLinkElement: ["link"],         HTMLHeadElement: ["head"],                                HTMLProgressElement: ["progress"], 
    HTMLButtonElement: ["button"],     HTMLMapElement: ["map"],           HTMLHRElement: ["hr"],                                    HTMLQuoteElement: ["blockquote", "q"], 
    HTMLCanvasElement: ["canvas"],     HTMLMarqueeElement: ["marquee"],   HTMLHtmlElement: ["html"],                                HTMLScriptElement: ["script"], 
    HTMLDataElement: ["data"],         HTMLMediaElement: [],              HTMLIFrameElement: ["iframe"],                            HTMLTimeElement: ["time"], 
    HTMLDataListElement: ["datalist"], HTMLMenuElement: ["menu"],         HTMLSelectElement: ["select"],                            HTMLTitleElement: ["title"], 
    HTMLDetailsElement: ["details"],   HTMLMetaElement: ["meta"],         HTMLSlotElement: ["slot"],                                HTMLTableRowElement: ["tr"], 
    HTMLDialogElement: ["dialog"],     HTMLMeterElement: ["meter"],       HTMLSourceElement: ["source"],                            HTMLTableSectionElement: ["thead", "tbody", "tfoot"], 
    HTMLDirectoryElement: ["dir"],     HTMLModElement: ["del", "ins"],    HTMLSpanElement: ["span"],                                HTMLTemplateElement: ["template"], 
    HTMLDivElement: ["div"],           HTMLObjectElement: ["object"],     HTMLStyleElement: ["style"],                              HTMLTextAreaElement: ["textarea"], 
    HTMLDListElement: ["dl"],          HTMLOListElement: ["ol"],          HTMLTableCaptionElement: ["caption"],                     HTMLTrackElement: ["track"], 
    HTMLEmbedElement: ["embed"],       HTMLOptGroupElement: ["optgroup"], HTMLTableCellElement: ["th", "td"],                       HTMLUListElement: ["ul"], 
    HTMLFieldSetElement: ["fieldset"], HTMLOptionElement: ["option"],     HTMLTableColElement: ["col", "colgroup"],                 HTMLUnknownElement: [], 
    HTMLTableElement: ["table"],       HTMLVideoElement: ["video"]
  }
  var _tmp;
  var ret;
  var htmlmapkeys = _ojk(htmlmap)
  name = name.toLocaleLowerCase()
  for (var i = 0; i < htmlmapkeys.length; i++) {
    if (htmlmap[htmlmapkeys[i]].indexOf(name) != -1){
      _tmp = v_t
      v_t = false
      ret = window[htmlmapkeys[i]]
      v_t = _tmp
      ret = ret._new()
      break
    }
  }
  if (!ret){
    ret = HTMLUnknownElement._new()
  }
  ret[_y].style = CSSStyleDeclaration._new()
  ret[_y].tagName = name.toUpperCase()
  ret[_y].appendChild = function(e){
    e[_y].contentWindow = window
    e[_y].contentDocument = HTMLDocument._new()
    v_hook_getElement(e[_y].contentDocument)
    e[_y].contentDocument.head = document[_y].createElement('head')
    e[_y].contentDocument.body = document[_y].createElement('body')
    e[_y].contentDocument.documentElement = document[_y].createElement('html')
    e[_y].parentNode = ret
    e[_y].parentElement = ret
  }
  ret[_y].children = HTMLCollection._new()
  v_hook_getElement(ret)
  return ret
}
document[_y].head = document[_y].createElement('head')
document[_y].body = document[_y].createElement('body')
document[_y].documentElement = document[_y].createElement('html')
document[_y].defaultView = window
document[_y].scripts = HTMLCollection._new()
document[_y].scripts[0] = document.createElement('script')
document[_y].scripts[1] = document.createElement('script')
document[_y].forms = HTMLCollection._new()
document[_y].forms[0] = document.createElement('form')
document[_y].forms[1] = document.createElement('form')

_odt(document[_y], 'URL', {get(){return location[_y].href}})

Image._init = function(_this){
  _this[_y].style = CSSStyleDeclaration._new()
  _this[_y].tagName = "IMG"
  _this[_y].children = HTMLCollection._new()
  _this[_y].appendChild = function(e){
    e[_y].contentWindow = window
  }
  v_hook_getElement(_this)
}

window[_y]._timing_idx = 0 // 每次创建一个对象自增约两百，让对象数据更真实一点
Event._init = function(_this){
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].path = []
  _this[_y].returnValue = true
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
}
MouseEvent._init = function(_this){
  _this[_y].altKey = false
  _this[_y].bubbles = false
  _this[_y].button = 0
  _this[_y].buttons = 0
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].clientX = 0
  _this[_y].clientY = 0
  _this[_y].composed = false
  _this[_y].ctrlKey = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].detail = 0
  _this[_y].eventPhase = 0
  _this[_y].fromElement = null
  _this[_y].isTrusted = false
  _this[_y].layerX = 0
  _this[_y].layerY = 0
  _this[_y].metaKey = false
  _this[_y].movementX = 0
  _this[_y].movementY = 0
  _this[_y].offsetX = 0
  _this[_y].offsetY = 0
  _this[_y].pageX = 0
  _this[_y].pageY = 0
  _this[_y].path = []
  _this[_y].relatedTarget = null
  _this[_y].returnValue = true
  _this[_y].screenX = 0
  _this[_y].screenY = 0
  _this[_y].shiftKey = false
  _this[_y].sourceCapabilities = null
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].toElement = null
  _this[_y].type = ""
  _this[_y].view = null
  _this[_y].which = 1
  _this[_y].x = 0
  _this[_y].y = 0
  _this[_y].initMouseEvent = function(
    type,
    canBubble,
    cancelable,
    view,
    detail,
    screenX,
    screenY,
    clientX,
    clientY,
    ctrlKey,
    altKey,
    shiftKey,
    metaKey,
    button,
    relatedTarget){
    if (type !== undefined){ _this[_y].type = type }
    if (canBubble !== undefined){ _this[_y].canBubble = canBubble }
    if (cancelable !== undefined){ _this[_y].cancelable = cancelable }
    if (view !== undefined){ _this[_y].view = view }
    if (detail !== undefined){ _this[_y].detail = detail }
    if (screenX !== undefined){ _this[_y].screenX = screenX; _this[_y].movementX = screenX }
    if (screenY !== undefined){ _this[_y].screenY = screenY; _this[_y].movementY = screenY }
    if (clientX !== undefined){ _this[_y].clientX = clientX; _this[_y].layerX = clientX; _this[_y].offsetX = clientX; _this[_y].pageX = clientX; _this[_y].x = clientX; }
    if (clientY !== undefined){ _this[_y].clientY = clientY; _this[_y].layerY = clientY; _this[_y].offsetY = clientY; _this[_y].pageY = clientY; _this[_y].y = clientY; }
    if (ctrlKey !== undefined){ _this[_y].ctrlKey = ctrlKey }
    if (altKey !== undefined){ _this[_y].altKey = altKey }
    if (shiftKey !== undefined){ _this[_y].shiftKey = shiftKey }
    if (metaKey !== undefined){ _this[_y].metaKey = metaKey }
    if (button !== undefined){ _this[_y].button = button }
    if (relatedTarget !== undefined){ _this[_y].relatedTarget = relatedTarget }
  }
}
UIEvent._init = function(_this){
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].detail = 0
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].path = []
  _this[_y].returnValue = true
  _this[_y].sourceCapabilities = null
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
  _this[_y].view = null
  _this[_y].which = 0
}
MutationEvent._init = function(_this){
  _this[_y].attrChange = 0
  _this[_y].attrName = ""
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].newValue = ""
  _this[_y].path = []
  _this[_y].prevValue = ""
  _this[_y].relatedNode = null
  _this[_y].returnValue = true
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
}
KeyboardEvent._init = function(_this){
  _this[_y].altKey = false
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].charCode = 0
  _this[_y].code = ""
  _this[_y].composed = false
  _this[_y].ctrlKey = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].detail = 0
  _this[_y].eventPhase = 0
  _this[_y].isComposing = false
  _this[_y].isTrusted = false
  _this[_y].key = ""
  _this[_y].keyCode = 0
  _this[_y].location = 0
  _this[_y].metaKey = false
  _this[_y].path = []
  _this[_y].repeat = false
  _this[_y].returnValue = true
  _this[_y].shiftKey = false
  _this[_y].sourceCapabilities = null
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
  _this[_y].view = null
  _this[_y].which = 0
}
TextEvent._init = function(_this){
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].data = ""
  _this[_y].defaultPrevented = false
  _this[_y].detail = 0
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].path = []
  _this[_y].returnValue = true
  _this[_y].sourceCapabilities = null
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
  _this[_y].view = null
  _this[_y].which = 0
}
CustomEvent._init = function(_this){
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].defaultPrevented = false
  _this[_y].detail = null
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].path = []
  _this[_y].returnValue = true
  _this[_y].srcElement = null
  _this[_y].target = null
  _this[_y].initCustomEvent = function(){
    _this[_y].type = arguments[0];
    _this[_y].detail = arguments[3];
  }
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
}
MessageEvent._init = function(_this){
  _this[_y].bubbles = false
  _this[_y].cancelBubble = false
  _this[_y].cancelable = false
  _this[_y].composed = false
  _this[_y].currentTarget = null
  _this[_y].data = null
  _this[_y].defaultPrevented = false
  _this[_y].eventPhase = 0
  _this[_y].isTrusted = false
  _this[_y].lastEventId = ""
  _this[_y].origin = ""
  _this[_y].path = []
  _this[_y].ports = []
  _this[_y].returnValue = true
  _this[_y].source = null
  _this[_y].srcElement = null
  _this[_y].target = null
  if (!_this[_y].timeStamp){_odt(_this[_y], 'timeStamp', {value:(++window[_y]._timing_idx)*200 + ((_rd() * 30)^0)})}
  _this[_y].type = ""
  _this[_y].userActivation = null
}
document[_y].createEvent = function(t){
  var r;
  if (t.toLowerCase() == "htmlevents"){ var r = Event._new() }
  if (t.toLowerCase() == "uievent"){ var r = UIEvent._new() }
  if (t.toLowerCase() == "uievents"){ var r = UIEvent._new() }
  if (t.toLowerCase() == "mouseevent"){ var r = MouseEvent._new() }
  if (t.toLowerCase() == "mouseevents"){ var r = MouseEvent._new() }
  if (t.toLowerCase() == "mutationevent"){ var r = MutationEvent._new() }
  if (t.toLowerCase() == "mutationevents"){ var r = MutationEvent._new() }
  if (t.toLowerCase() == "textevent"){ var r = TextEvent._new() }
  if (t.toLowerCase() == "keyboardevent"){ var r = KeyboardEvent._new() }
  if (t.toLowerCase() == "customevent"){ var r = CustomEvent._new() }
  if (t.toLowerCase() == "event"){ var r = Event._new() }
  if (t.toLowerCase() == "events"){ var r = Event._new() }
  if (t.toLowerCase() == "svgevents"){ var r = Event._new() }
  return r;
}






CanvasRenderingContext2D._init = function(_this){
  _this[_y].toDataURL = function(){
    // canvas2d 图像指纹
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"
  }
}

WebGLRenderingContext._init = function(_this){
  _this[_y]._toggle = {}
  _this[_y].createBuffer = function(){ return WebGLBuffer._new() }
  _this[_y].createProgram = function(){ return WebGLProgram._new() }
  _this[_y].createShader = function(){ return WebGLShader._new() }
  _this[_y].getSupportedExtensions = function(){
    return [
      "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_color_buffer_half_float", "EXT_disjoint_timer_query", "EXT_float_blend", "EXT_frag_depth",
      "EXT_shader_texture_lod", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "EXT_sRGB",
      "KHR_parallel_shader_compile", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_float_linear",
      "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_compressed_texture_s3tc", 
      "WEBKIT_WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders",
      "WEBGL_depth_texture","WEBKIT_WEBGL_depth_texture","WEBGL_draw_buffers","WEBGL_lose_context","WEBKIT_WEBGL_lose_context","WEBGL_multi_draw",
    ]
  }
  _this[_y].getExtension = function(key){
    class WebGLDebugRendererInfo{
      get UNMASKED_VENDOR_WEBGL(){_bl('  >>> get UNMASKED_VENDOR_WEBGL 37445');_this[_y]._toggle[37445]=1;return 37445}
      get UNMASKED_RENDERER_WEBGL(){_bl('  >>> get UNMASKED_RENDERER_WEBGL 37446');_this[_y]._toggle[37446]=1;return 37446}
    }
    saf_class(WebGLDebugRendererInfo)
    class EXTTextureFilterAnisotropic{}
    class WebGLLoseContext{
    	loseContext(){_bl('  (*) loseContext ===> return undefined')}
    	restoreContext(){_bl('  (*) restoreContext ===> return undefined')}
    }
    saf_class(WebGLLoseContext)
    // 这里补着有点累，就随便了
    if (key == 'WEBGL_debug_renderer_info'){
      var r = new WebGLDebugRendererInfo
    }
    else if (key == 'EXT_texture_filter_anisotropic'){
      var r = new EXTTextureFilterAnisotropic
    }
    else if (key == 'WEBGL_lose_context'){
    	var r = new WebGLLoseContext
    }else{
    	var r = new WebGLDebugRendererInfo
    }
    return hook_obj(r)
  }
  _this[_y].getParameter = function(key){
    if (_this[_y]._toggle[key]){
      if (key == 37445){
        return "Google Inc. (NVIDIA)"
      }
      if (key == 37446){
        return "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0, D3D11-27.21.14.5671)"
      }
    }else{
      if (key == 33902){ return new Float32Array([1,1]) }
      if (key == 33901){ return new Float32Array([1,1024]) }
      if (key == 35661){ return 32 }
      if (key == 34047){ return 16 }
      if (key == 34076){ return 16384 }
      if (key == 36349){ return 1024 }
      if (key == 34024){ return 16384 }
      if (key == 34930){ return 16 }
      if (key == 3379){ return 16384 }
      if (key == 36348){ return 30 }
      if (key == 34921){ return 16 }
      if (key == 35660){ return 16 }
      if (key == 36347){ return 4095 }
      if (key == 3386){ return new Int32Array([32767, 32767]) }
      if (key == 3410){ return 8 }
      if (key == 7937){ return "WebKit WebGL" }
      if (key == 35724){ return "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)" }
      if (key == 3415){ return 0 }
      if (key == 7936){ return "WebKit" }
      if (key == 7938){ return "WebGL 1.0 (OpenGL ES 2.0 Chromium)" }
      if (key == 3411){ return 8 }
      if (key == 3412){ return 8 }
      if (key == 3413){ return 8 }
      if (key == 3414){ return 24 }
      return null
    }
  }
  _this[_y].getContextAttributes = function(){
    return {
      alpha: true,
      antialias: true,
      depth: true,
      desynchronized: false,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "default",
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
      xrCompatible: false,
    }
  }
  _this[_y].getShaderPrecisionFormat = function(a,b){
    var r1 = WebGLShaderPrecisionFormat._new()
    r1[_y].rangeMin = 127
    r1[_y].rangeMax = 127
    r1[_y].precision = 23
    var r2 = WebGLShaderPrecisionFormat._new()
    r2[_y].rangeMin = 31
    r2[_y].rangeMax = 30
    r2[_y].precision = 0
    if (a == 35633 && b == 36338){ return r1 } if (a == 35633 && b == 36337){ return r1 } if (a == 35633 && b == 36336){ return r1 } 
    if (a == 35633 && b == 36341){ return r2 } if (a == 35633 && b == 36340){ return r2 } if (a == 35633 && b == 36339){ return r2 }
    if (a == 35632 && b == 36338){ return r1 } if (a == 35632 && b == 36337){ return r1 } if (a == 35632 && b == 36336){ return r1 }
    if (a == 35632 && b == 36341){ return r2 } if (a == 35632 && b == 36340){ return r2 } if (a == 35632 && b == 36339){ return r2 }
    throw Error('getShaderPrecisionFormat')
  }
}

HTMLCanvasElement._init = function(_this){
  _this[_y].getContext = function(name){
    if (name == '2d'){ 
      return CanvasRenderingContext2D._new()
    }
    if (name == 'webgl'){ 
      var r = WebGLRenderingContext._new() 
      r[_y].canvas = _this
      r[_y].canvas[_y].toDataURL = function(){
        // webgl图像指纹
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"
      }
      return r
    }
  }
  _this[_y].toDataURL = function(){ // 默认的空画板的图片
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"
  }
}

var _mk_AudioParam = function(a,b,c,d,e){
  var r = AudioParam._new()
  r[_y].value = a
  r[_y].defaultValue = b
  r[_y].minValue = c
  r[_y].maxValue = d
  r[_y].automationRate = e
  return r
}
GainNode._init = function(_this){
  _this[_y].gain = _mk_AudioParam(1, 1, -3.4028234663852886e+38, 3.4028234663852886e+38, "a-rate")
}
BaseAudioContext._init = function(_this){
  _this[_y].createAnalyser = function(){
    return AnalyserNode._new()
  }
  _this[_y].createGain = function(){
    return GainNode._new()
  }
  _this[_y].createScriptProcessor = function(){
    return ScriptProcessorNode._new()
  }
  _this[_y].createOscillator = function(){
    var r = OscillatorNode._new()
    r[_y].type = 'sine'
    r[_y].frequency = _mk_AudioParam(0, 0, -153600, 153600, "a-rate")
    r[_y].detune = _mk_AudioParam(440, 440, -22050, 22050, "a-rate")
    return r  
  }
  _this[_y].createDynamicsCompressor = function(){
    var r = DynamicsCompressorNode._new()
    r[_y].threshold = _mk_AudioParam(-24, -24, -100, 0, "k-rate")
    r[_y].knee = _mk_AudioParam(30, 30, 0, 40, "k-rate")
    r[_y].ratio = _mk_AudioParam(12, 12, 1, 20, "k-rate")
    r[_y].attack = _mk_AudioParam(0.003000000026077032, 0.003000000026077032, 0, 1, "k-rate")
    r[_y].release = _mk_AudioParam(0.25, 0.25, 0, 1, "k-rate")
    return r
  }
}

// destination = AudioDestinationNode._new() 
// 声音指纹这里初始化时候 destination 是一个对象，后面需要考虑怎么兼容进去

// 虽然在脚手架前面设置了 location.href 无法被修改，但是内部 get 中的真实值 location[_y].href 这里可以随意设置，并且能达到相同的效果
function v_hook_href(obj){
  return _odt(obj, 'href', {
    get: function(){
      return this.protocol + "//" + this.host + (this.port ? ":" + this.port : "") + this.pathname + this.search + this.hash;
    },
    set: function(href){
      href = href.trim()
      if (href.startsWith("http://") || href.startsWith("https://")){/*ok*/}
      else if(href.startsWith("//")){ href = (this.protocol?this.protocol:'http:') + href}
      else{ href = this.protocol+"//"+this.host + (this.port?":"+this.port:"") + '/' + ((href[0]=='/')?href.slice(1):href) }
      var a = href.match(/([^:]+:)\\/\\/([^/:?#]+):?(\\d+)?([^?#]*)?(\\?[^#]*)?(#.*)?/);
      this.protocol = a[1] ? a[1] : "";
      this.host     = a[2] ? a[2] : "";
      this.port     = a[3] ? a[3] : "";
      this.pathname = a[4] ? a[4] : "";
      this.search   = a[5] ? a[5] : "";
      this.hash     = a[6] ? a[6] : "";
      this.hostname = this.host;
      this.origin   = this.protocol + "//" + this.host + (this.port ? ":" + this.port : "");
    }
  });
}
v_hook_href(window[_y].location[_y])

HTMLAnchorElement._init = function(_this){
  v_hook_href(_this[_y])
  _this[_y].href = location[_y].href
  _this[_y].namespaceURI = "http://www.w3.org/1999/xhtml"
  _this[_y].toString = function(){
    return _this[_y].href
  }
}

;(function(){
  'use strict';
  var cache = document[_y].cookie = "";
  _odt(document[_y], 'cookie', {
    get: function() {
      return cache.slice(0,cache.length-2);
    },
    set: function(c) {
      var ncookie = c.split(";")[0].split("=");
      if (!ncookie[1]){
        return c
      }
      var key = ncookie[0].trim()
      var val = ncookie[1].trim()
      var newc = key+'='+val
      var flag = false;
      var temp = cache.split("; ").map(function(a) {
        if (a.split("=")[0] === key) {
          flag = true;
          return newc;
        }
        return a;
      })
      cache = temp.join("; ");
      if (!flag) {
        cache += newc + "; ";
      }
      return cache;
    }
  });
  window[_y].init_cookie = function(e){
    e.split(';').map(function(e){
      document[_y].cookie = e
    })
  }
})();

// 个人使用的变量，用于请求收集对象，通常请求会伴随着响应，需要对实例的 onreadystatechange 函数进行处理
// 你要拿到对象才能获取对应请求的处理函数
window[_y].XMLHttpRequestList = []
window[_y].XMLHttpRequestListSend = []
XMLHttpRequest._init = function(_this){
  _this[_y].upload = XMLHttpRequestUpload._new()
  _this[_y].open = function(){
    console.log('------------ XMLHttpRequest open ------------')
    window[_y].XMLHttpRequestListSend.push([].slice.call(arguments, 0))
  }
  _this[_y].setRequestHeader = function(){
    console.log('------------ XMLHttpRequest open ------------')
    window[_y].XMLHttpRequestListSend.push([].slice.call(arguments, 0))
  }
  _this[_y].send = function(){
    console.log('------------ XMLHttpRequest send ------------')
    window[_y].XMLHttpRequestListSend.push([].slice.call(arguments, 0))
  }
  window[_y].XMLHttpRequestList.push(_this)
}

window[_y].fetchList = []
window[_y].fetch = function(){
  window[_y].fetchList.push([].slice.call(arguments, 0))
}

window[_y].v_getele = function(){}
window[_y].v_geteles = function(){}
window[_y].v_mouse = function(x, y, type){
  type = type?type:'click'
  // 简便的的构造鼠标事件方法
  // click,mousedown,mouseup,mouseover,mousemove,mouseout
  // 函数参数
  // type,
  // canBubble,
  // cancelable,
  // view,
  // detail,
  // screenX,
  // screenY,
  // clientX,
  // clientY,
  // ctrlKey,
  // altKey,
  // shiftKey,
  // metaKey,
  // button, // 0左键，1中键，2右键
  // relatedTarget
  var r = document[_y].createEvent('MouseEvent')
  r[_y].initMouseEvent(type, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
  return r
}

// 挂钩这三个函数，屏蔽掉 Symbol.for('cilame') 这个参数
var _getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors = saf(function getOwnPropertyDescriptors(){
  try{
    var r = _getOwnPropertyDescriptors.apply(this, arguments)
    delete r[_y]
    if (v_t){_m('Object','[getOwnPropertyDescriptors]',util.inspect(arguments[0]).split('\\n')[0],'<==>',r)};
    return r
  }catch(e){
    if (v_t){_m('Object','[getOwnPropertyDescriptors]',util.inspect(arguments[0]).split('\\n')[0],'<==>','[ ERROR ]')};
    throw Error()
  }
})
var _getOwnPropertySymbols = Object.getOwnPropertySymbols
Object.getOwnPropertySymbols = saf(function getOwnPropertySymbols(){
  try{
    var r = _getOwnPropertySymbols.apply(this, arguments)
    r = r.filter(function(e){
      return e !== _y
    })
    if (v_t){_m('Object','[getOwnPropertySymbols]',util.inspect(arguments[0]).split('\\n')[0],'<==>',r)};
    return r
  }catch(e){
    if (v_t){_m('Object','[getOwnPropertySymbols]',util.inspect(arguments[0]).split('\\n')[0],'<==>','[ ERROR ]')};
    throw Error()
  }
})
var _ownKeys = Reflect.ownKeys
Reflect.ownKeys = saf(function ownKeys(){
  try{
    var r = _ownKeys.apply(this, arguments)
    r = r.filter(function(e){
      return e !== _y
    })
    if (v_t){_m('Reflect','[ownKeys]',util.inspect(arguments[0]),'<==>',r)};
    return r
  }catch(e){
    if (v_t){_m('Reflect','[ownKeys]',util.inspect(arguments[0]),'<==>','[ ERROR ]')};
    throw Error()
  }
})

document[_y].visibilityState = 'visible'
document[_y].body[_y].clientTop = 0
document[_y].body[_y].clientLeft = 0
document[_y].body[_y].clientHeight = 2416
document[_y].body[_y].clientWidth = 1707
document[_y].body[_y].scrollTop = 0
document[_y].body[_y].scrollLeft = 0
document[_y].documentElement[_y].clientHeight = 1273
document[_y].documentElement[_y].clientWidth = 2543

// 通过一个函数挂钩所有以下的内置函数，通过修改 window[_y].v_getele 函数做对应代码的定制处理
// getElementById
// querySelector
window[_y].v_getlist = []
window[_y].v_getele = function(a,b,c,d,e){
  a = a.toLowerCase()
  // 定制处理
  for (var i = 0; i < window[_y].v_getlist.length; i++) {
    var t = window[_y].v_getlist[i]
    if (t[0] == a){
      return t[1](a)
    }
  }
  // 常用
  _bl('  (x) unhandle id:', a)
}

// 这里是对下面几个函数进行的挂钩处理
// getElementsByClassName
// getElementsByName
// getElementsByTagName
// getElementsByTagNameNS
// querySelectorAll
window[_y].v_getlists = []
window[_y].v_geteles = function(a,b,c,d,e){
  a = a.toLowerCase()
  for (var i = 0; i < window[_y].v_getlists.length; i++) {
    var t = window[_y].v_getlists[i]
    if (t[0] == a){
      return t[1](a)
    }
  }
  // 通用
  if (a == 'script'){
    return document[_y].scripts
  }
  if (a == 'head'){
    var r = document[_y].head
    return [r]
  }
  if (a == 'body'){
    var r = document[_y].body
    return [r]
  }
  _bl('  (x) unhandle[s] id:', a)
  return []
}

location.href = 'http://pls_init_href_first/test1/test2'

window[_y].v_load = function(){
  if (window[_y].listeners.DOMContentLoaded){
    _bl('---------- DOMContentLoaded ----------')
    for (var i = 0; i < window[_y].listeners.DOMContentLoaded.length; i++) {
      window[_y].listeners.DOMContentLoaded[i]()
    }
  }
  if (window[_y].listeners.load){
    _bl('---------- load ----------')
    for (var i = 0; i < window[_y].listeners.load.length; i++) {
      window[_y].listeners.load[i]()
    }
  }
}

window[_y].v_blocktime = function(t){
  if (typeof t == 'undefined'){
    throw Error('pls input a timestamp in first args.')
  }
  var ftime = t
  window.Date = function(_Date) {
    var bind = Function.bind;
    var unbind = bind.bind(bind);
    function instantiate(constructor, args) {
      return new (unbind(constructor, null).apply(null, args));
    }
    var names = Object.getOwnPropertyNames(_Date);
    for (var i = 0; i < names.length; i++) {
      if (names[i]in Date)
        continue;
      var desc = Object.getOwnPropertyDescriptor(_Date, names[i]);
      _odt(Date, names[i], desc);
    }
    return saf(Date);
    function Date() {
      var date = instantiate(_Date, [ftime]); // 固定返回某一个时间点
      return date;
    }
  }(Date);
  Date.now = saf(function now(){ return ftime })
  _ti = ftime
}
window[_y].v_blockrandom = function(r){
  if (typeof r == 'undefined'){
    throw Error('pls input a number (0~1) in first args.')
  }
  Math.random = saf(function random(){
    return r
  })
}

return window
`


var v_tail = `


var _y = Symbol.for('cilame')
global.v_t = false
var _bl = console.log
window = cilame(this)

// 注入全局，方便后面搞成库直接用 require 就能拿到内容。
window.v_getlist = window[_y].v_getlist
window.v_getlists = window[_y].v_getlists
window.v_requests = {
  'xmllist': window[_y].XMLHttpRequestList,
  'xmlsend': window[_y].XMLHttpRequestListSend,
  'fetcher': window[_y].fetchList,
}
window.v_listeners = window[_y].listeners
window.v_load = window[_y].v_load
window.v_mouse = window[_y].v_mouse
window.v_blocktime = window[_y].v_blocktime
window.v_blockrandom = window[_y].v_blockrandom

location.href = 'http://pls_init_href_first/test1/test2'
// document[_y].referrer = 'http://newhref'
// window[_y].init_cookie('key=value; key2=value2')
v_t = true // 打开日志开关
debugger
`

v_ret = v_str_saf + v_mk_head_WindowProperties() + '\n' + v_global_init(v_global_s) + '\n' + v_ret

v_ret = `
function cilame(v_this){
${v_ret.trim().split('\n').map(function(e){return '  '+e}).join('\n')}
}
`
v_ret = v_ret + v_tail

// console.log(v_ret)
copy(v_ret)
}
