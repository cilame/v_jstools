function make_v(envs, keys){
    _envs = envs
    envs = _envs[0]
    eles = _envs[1]
    var configs = {
        EventTarget: {
            addEventListener: { ban: true },
        },
        Document: {
            createElement: {
                value: 'return _createElement(arguments[0])'
            },
            documentElement: {
                value: 'return document'
            },
            cookie: { ban: true },
            getElementById: { ban: true },
            getElementsByClassName: { ban: true },
            getElementsByName: { ban: true },
            getElementsByTagName: { ban: true },
            getElementsByTagNameNS: { ban: true },
            querySelector: { ban: true },
            querySelectorAll: { ban: true },
            body: { ban: true },
            head: { ban: true },
        },
        Navigator:{
            javaEnabled:{ value: 'return true' },
            plugins: {value: `return this._plugins || []`},
            mimeTypes:  {value: `return this._mimeTypes || []`},
            __init__: {value: `this._plugins = typeof PluginArray=='undefined'?[]:v_new(PluginArray); this._mimeTypes = typeof MimeTypeArray=='undefined'?[]:v_new(MimeTypeArray)`}
        },
        Node: {
            appendChild: {value: ''},
            removeChild: {value: ''},
        },
        XMLHttpRequest: {
            onreadystatechange: { ban: true },
            readyState: { ban: true },
            timeout: { ban: true },
            withCredentials: { ban: true },
            upload: { ban: true },
            responseURL: { ban: true },
            status: { ban: true },
            statusText: { ban: true },
            responseType: { ban: true },
            response: { ban: true },
            responseText: { ban: true },
            responseXML: { ban: true },
            UNSENT: { ban: true },
            OPENED: { ban: true },
            HEADERS_RECEIVED: { ban: true },
            LOADING: { ban: true },
            DONE: { ban: true },
            abort: { ban: true },
            getAllResponseHeaders: { ban: true },
            getResponseHeader: { ban: true },
            open: { ban: true },
            overrideMimeType: { ban: true },
            send: { ban: true },
            setRequestHeader: { ban: true },
        },
        MouseEvent: {
            type: { ban: true },
            canBubble: { ban: true },
            cancelable: { ban: true },
            view: { ban: true },
            detail: { ban: true },
            screenX: { ban: true },
            movementX: { ban: true },
            screenY: { ban: true },
            movementY: { ban: true },
            clientX: { ban: true },
            layerX: { ban: true },
            offsetX: { ban: true },
            pageX: { ban: true },
            x: { ban: true },
            clientY: { ban: true },
            layerY: { ban: true },
            offsetY: { ban: true },
            pageY: { ban: true },
            y: { ban: true },
            ctrlKey: { ban: true },
            altKey: { ban: true },
            shiftKey: { ban: true },
            metaKey: { ban: true },
            button: { ban: true },
            relatedTarget: { ban: true },
        },
        HTMLElement: {
            style: {value: 'return this.v_style'},
        },
        Element: {
            tagName: {value: 'return this.v_tagName'},
        },
        Storage:{
            clear:{ ban: true },
            getItem:{ ban: true },
            setItem:{ ban: true },
            key:{ ban: true },
            removeItem:{ ban: true },
            length:{ ban: true },
        },
        PluginArray: {
            __init__: {
                value: function(){
                    var _plugins = navigator.plugins
                    var _ret = []
                    for (var i = 0; i < _plugins.length; i++) {
                        _ret.push([
                            `  this[${i}]=v_new(Plugin);`,
                            `this[${i}].description=${JSON.stringify(_plugins[i].description)};`,
                            `this[${i}].filename=${JSON.stringify(_plugins[i].filename)};`,
                            `this[${i}].length=${JSON.stringify(_plugins[i].length)};`,
                            `this[${i}].name=${JSON.stringify(_plugins[i].name)};`,
                        ].join(''))
                    }
                    return '\n' + _ret.join('\n')
                }
            }
        },
        Plugin:{
            description: { ban: true },
            filename: { ban: true },
            length: { ban: true },
            name: { ban: true },
        },
        Crypto: {
            getRandomValues: { ban: true },
            randomUUID: { ban: true },
            __init__: {
                value: `
  this.getRandomValues = function(){
    v_console_log('  [*] Crypto -> getRandomValues[func]')
    var e=arguments[0]; return e.map(function(x, i){return e[i]=v_random()*1073741824});}
  this.randomUUID = function(){
    v_console_log('  [*] Crypto -> randomUUID[func]')
    function get2(){return (v_random()*255^0).toString(16).padStart(2,'0')}
    function rpt(func,num){var r=[];for(var i=0;i<num;i++){r.push(func())};return r.join('')}
    return [rpt(get2,4),rpt(get2,2),rpt(get2,2),rpt(get2,2),rpt(get2,6)].join('-')}`
            },
        },
        MimeTypeArray: {
            __init__: {
                value: function(){
                    var _mimeTypes = navigator.mimeTypes
                    var _ret = []
                    for (var i = 0; i < _mimeTypes.length; i++) {
                        _ret.push([
                            `  this[${i}]=v_new(Plugin);`,
                            `this[${i}].description=${JSON.stringify(_mimeTypes[i].description)};`,
                            `this[${i}].enabledPlugin=${JSON.stringify(_mimeTypes[i].enabledPlugin)};`,
                            `this[${i}].suffixes=${JSON.stringify(_mimeTypes[i].suffixes)};`,
                            `this[${i}].type=${JSON.stringify(_mimeTypes[i].type)};`,
                        ].join(''))
                    }
                    return '\n' + _ret.join('\n')
                }
            }
        },
        MimeType:{
            description: { ban: true },
            enabledPlugin: { ban: true },
            suffixes: { ban: true },
            type: { ban: true },
        },
        SVGElement: {
            style: {value: ''},
        },
        Image:{
            __init__: {value: 'return v_new(HTMLImageElement)'}
        },
        HTMLCanvasElement:{
            getContext: {value: `if (arguments[0]=='2d'){var r = v_new(CanvasRenderingContext2D); return r}; if (arguments[0]=='webgl' || arguments[0]=='experimental-webgl'){var r = v_new(WebGLRenderingContext); r._canvas = this; return r}; return null`},
            toDataURL: { ban: true },
        },
        WebGLRenderingContext: {
            canvas: {value: `return this._canvas`},
            createBuffer: { ban: true },
            createProgram: { ban: true },
            createShader: { ban: true },
            getSupportedExtensions: { ban: true },
            getExtension: { ban: true },
            getParameter: { ban: true },
            getContextAttributes: { ban: true },
            getShaderPrecisionFormat: { ban: true },
            __init__:{
    value:`
  function WebGLBuffer(){}
  function WebGLProgram(){}
  function WebGLShader(){}
  this._toggle = {}
  this.createBuffer = function(){ v_console_log('  [*] WebGLRenderingContext -> createBuffer[func]'); return v_new(WebGLBuffer) }
  this.createProgram = function(){ v_console_log('  [*] WebGLRenderingContext -> createProgram[func]'); return v_new(WebGLProgram) }
  this.createShader = function(){ v_console_log('  [*] WebGLRenderingContext -> createShader[func]'); return v_new(WebGLShader) }
  this.getSupportedExtensions = function(){
    v_console_log('  [*] WebGLRenderingContext -> getSupportedExtensions[func]')
    return [
      "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_color_buffer_half_float", "EXT_disjoint_timer_query", "EXT_float_blend", "EXT_frag_depth",
      "EXT_shader_texture_lod", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "EXT_sRGB",
      "KHR_parallel_shader_compile", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_float_linear",
      "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_compressed_texture_s3tc", 
      "WEBKIT_WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders",
      "WEBGL_depth_texture","WEBKIT_WEBGL_depth_texture","WEBGL_draw_buffers","WEBGL_lose_context","WEBKIT_WEBGL_lose_context","WEBGL_multi_draw",
    ]
  }
  var self = this
  this.getExtension = function(key){
    v_console_log('  [*] WebGLRenderingContext -> getExtension[func]:', key)
    class WebGLDebugRendererInfo{
      get UNMASKED_VENDOR_WEBGL(){self._toggle[37445]=1;return 37445}
      get UNMASKED_RENDERER_WEBGL(){self._toggle[37446]=1;return 37446}
    }
    class EXTTextureFilterAnisotropic{}
    class WebGLLoseContext{
      loseContext(){}
      restoreContext(){}
    }
    if (key == 'WEBGL_debug_renderer_info'){ var r = new WebGLDebugRendererInfo }
    if (key == 'EXT_texture_filter_anisotropic'){ var r = new EXTTextureFilterAnisotropic }
    if (key == 'WEBGL_lose_context'){ var r = new WebGLLoseContext }
    else{ var r = new WebGLDebugRendererInfo }
    return r
  }
  this.getParameter = function(key){
    v_console_log('  [*] WebGLRenderingContext -> getParameter[func]:', key)
    if (this._toggle[key]){
      if (key == 37445){ return "Google Inc. (NVIDIA)" }
      if (key == 37446){ return "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti Direct3D11 vs_5_0 ps_5_0, D3D11-27.21.14.5671)" }
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
  this.getContextAttributes = function(){
    v_console_log('  [*] WebGLRenderingContext -> getContextAttributes[func]')
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
  this.getShaderPrecisionFormat = function(a,b){
    v_console_log('  [*] WebGLRenderingContext -> getShaderPrecisionFormat[func]')
    function WebGLShaderPrecisionFormat(){}
    var r1 = v_new(WebGLShaderPrecisionFormat)
    r1.rangeMin = 127
    r1.rangeMax = 127
    r1.precision = 23
    var r2 = v_new(WebGLShaderPrecisionFormat)
    r2.rangeMin = 31
    r2.rangeMax = 30
    r2.precision = 0
    if (a == 35633 && b == 36338){ return r1 } if (a == 35633 && b == 36337){ return r1 } if (a == 35633 && b == 36336){ return r1 } 
    if (a == 35633 && b == 36341){ return r2 } if (a == 35633 && b == 36340){ return r2 } if (a == 35633 && b == 36339){ return r2 }
    if (a == 35632 && b == 36338){ return r1 } if (a == 35632 && b == 36337){ return r1 } if (a == 35632 && b == 36336){ return r1 }
    if (a == 35632 && b == 36341){ return r2 } if (a == 35632 && b == 36340){ return r2 } if (a == 35632 && b == 36339){ return r2 }
    throw Error('getShaderPrecisionFormat')
  }
  v_saf(this.createBuffer, 'createBuffer')
  v_saf(this.createProgram, 'createProgram')
  v_saf(this.createShader, 'createShader')
  v_saf(this.getSupportedExtensions, 'getSupportedExtensions')
  v_saf(this.getExtension, 'getExtension')
  v_saf(this.getParameter, 'getParameter')
  v_saf(this.getContextAttributes, 'getContextAttributes')
  v_saf(this.getShaderPrecisionFormat, 'getShaderPrecisionFormat')`},
        },
        HTMLDocument: {__init__:{
            value: `Object.defineProperty(this, 'location', {get(){return location}})`
        }},
        Performance:{
            timing:{
                value: `return v_new(PerformanceTiming)`
            },
            getEntriesByType:{
                value: `if (arguments[0]=='resource'){return v_new(PerformanceResourceTiming)}`
            }
        },
        HTMLAnchorElement:{
            __init__:{
                value: `v_hook_href(this, 'HTMLAnchorElement', location.href)`
            },
            href: { ban: true },
            protocol: { ban: true },
            host: { ban: true },
            search: { ban: true },
            hash: { ban: true },
            hostname: { ban: true },
            port: { ban: true },
            pathname: { ban: true },
        },
    }
    var avoid_obj = ['URL']
    function make_chain(name){
        if (avoid_obj.indexOf(name) != -1){
            return []
        }
        var _name = name
        var list = []
        if (window[_name]){
            list.push(_name)
        }
        while(window[_name]){
            _name = Object.getPrototypeOf(window[_name]).name
            if (_name){
                list.push(_name)
            }
        }
        return list
    }
    function is_literal(value){
        var allc = ['string', 'number', 'boolean', 'undefined']
        return allc.indexOf(typeof value) != -1 || value === null
    }
    function get_class_name(obj){
        return /\[object ([^\]]+)\]/.exec(Object.prototype.toString.call(obj))[1]
    }
    function check_ban(clazz, name){
        return configs[clazz] && configs[clazz][name] && configs[clazz][name].ban
    }
    function make_return(clazz, name, value, type){
        var ret
        var tog
        if (configs[clazz] && configs[clazz][name]){
            ret = configs[clazz][name].value
            if (typeof ret == 'function'){
                ret = ret()
            }
            tog = true
        }
        else if (typeof value != 'undefined'){
            ret = 'return ' + value
        }
        else{
            ret = ''
        }
        var prefix = ''
        if (type != 'get'){
            var prefix = `v_console_log("  [*] ${clazz} -> ${name}[${type}]", [].slice.call(arguments))`
        }else{
            var val = /return (.*)|(.*)/.exec(ret)
            var val = val[1] || val[2]
            var prefix = `v_console_log("  [*] ${clazz} -> ${name}[${type}]", ${tog?val:value})`
        }
        return prefix + ';' + ret
    }
    function make_init(clazz){
        var ret;
        if (configs[clazz] && configs[clazz]['__init__']){
            ret = configs[clazz]['__init__'].value
            if (typeof ret == 'function'){
                ret = ret()
            }
        }else{
            ret = ''
        }
        return ret
    }
    function make_s(renv, clazz_f, isout){
        var clazz = clazz_f[0]
        var father = clazz_f[1]
        if (!renv[clazz]){
            var lst = []
        }else{
            var lst = Object.keys(renv[clazz])
        }
        var inner = []
        try{
            new window[clazz]
            var cannew = true
        }catch(e){
            var cannew = false
        }
        for (var i = 0; i < lst.length; i++) {
            var name = lst[i]
            var temp = renv[clazz][name]
            if (check_ban(clazz, name)){
                continue
            }
            if (temp.get||temp.set){
                var alls = []
                if (temp.get){
                    var value = JSON.stringify(temp.get.value)
                    var getter = `get(){ ${make_return(clazz, name, value, 'get')} }`
                    alls.push(getter)
                }
                if (temp.set){
                    var setter = `set(){ ${make_return(clazz, name, value, 'set')} }`
                    alls.push(setter)
                }

                inner.push(`  ${name}: {${alls.join(',')}},`)
            }
            if (temp.func){
                inner.push(`  ${name}: {value: v_saf(function ${name}(){${make_return(clazz, name, undefined, 'func')}})},`)
            }
        }
        var plist = Object.keys((v_window_cache[clazz] || window[clazz]).prototype)
        plist.push(Symbol.toStringTag)
        for (var i = 0; i < plist.length; i++) {
            try{
                var value = window[clazz].prototype[plist[i]]
                if (is_literal(value)){
                    var _desc = Object.getOwnPropertyDescriptors(window[clazz].prototype)[plist[i]]
                    if (_desc){
                        inner.push(`  ${plist[i]}: ${JSON.stringify(_desc)},`)
                    }
                }
            }catch(e){}
        }
        inner.push(`  [Symbol.toStringTag]: {value:"${clazz}",writable:false,enumerable:false,configurable:true},`)
        if (inner.length){
            inner.unshift(`Object.defineProperties(${clazz}.prototype, {`)
            inner.push(`})`)
        }
        var init = make_init(clazz, name)
        var ls = [
            `${clazz} = v_saf(function ${clazz}(){${cannew?'':'if (!v_new_toggle){ throw TypeError("Illegal constructor") }'};${init}})` + (father?`; _inherits(${clazz}, ${father})`:''),
        ]
        if (isout){
          return [ls, inner]
        }
        defines.push(...ls)
        definepros.push(...inner)
        // return ls.join('\n')
    }

    var ekeys = Object.keys(envs)
    var renv = {}
    var maxlen = 0
    if (!keys){ keys = ekeys }
    if (typeof keys == 'string'){ keys = [keys] }
    var collect = []
    for (var i = 0; i < keys.length; i++) {
        var e = envs[keys[i]]
        var temp = Object.keys(e)
        for (var j = 0; j < temp.length; j++) {
            renv[temp[j]] = renv[temp[j]] || {}
            var funcs = Object.keys(e[temp[j]])
            for (var k = 0; k < funcs.length; k++) {
                renv[temp[j]][funcs[k]] = renv[temp[j]][funcs[k]] || {}
                var types = Object.keys(e[temp[j]][funcs[k]])
                for (var l = 0; l < types.length; l++) {
                    renv[temp[j]][funcs[k]][types[l]] = renv[temp[j]][funcs[k]][types[l]] || {}
                    renv[temp[j]][funcs[k]][types[l]].value = e[temp[j]][funcs[k]][types[l]].value
                }
            }
            var ls = make_chain(temp[j])
            collect.push(ls)
            maxlen = ls.length > maxlen ? ls.length : maxlen
        }
    }
    if (!maxlen){ return }
    for (var i = 0; i < collect.length; i++) {
        var len = maxlen - collect[i].length
        for (var j = 0; j < len; j++) {
            collect[i].unshift(undefined)
        }
    }
    var sorted = []
    var dicter = {}
    for (var i = maxlen - 1; i >= 0; i--) {
        for (var j = 0; j < collect.length; j++) {
            var temp = collect[j][i]
            var pref = collect[j][i+1]
            if (temp && sorted.indexOf(temp) == -1){
                dicter[temp] = [temp, pref]
                sorted.push(temp)
            }
        }
    }
    var prefix = [
        `function _inherits(t, e) {`,
        `  t.prototype = Object.create(e.prototype, {`,
        `    constructor: { value: t, writable: !0, configurable: !0 }`,
        `  }), e && Object.setPrototypeOf(t, e) }`,
        `Object.defineProperty(Object.prototype, Symbol.toStringTag, {`,
        `  get() { return Object.getPrototypeOf(this).constructor.name }, configurable:true,`,
        `});`,

        'var v_new_toggle = true',
        'Object.freeze(console)//only for javascript-obfuscator anti console debug.',
        'var v_console_logger = console.log',
        'var v_console_log = function(){if (!v_new_toggle){ v_console_logger.apply(this, arguments) }}',
        'var v_random = (function() { var seed = 276951438; return function random() { return seed = (seed * 9301 + 49297) % 233280, (seed / 233280)} })()',
        'var v_new = function(v){var temp=v_new_toggle; v_new_toggle = true; var r = new v; v_new_toggle = temp; return r}',
    ]
    var defines = []
    var definepros = []
    for (var i = 0; i < sorted.length; i++) {
        make_s(renv, dicter[sorted[i]])
    }

    function patcher(name){
      var list = make_chain(name)
      if (list.length >= 3){
        var lsinner = []
        for (var i = 0; i < list.length-1; i++) {
          if (!dicter[list[i]]){
            dicter[list[i]] = 1; 
            lsinner.push(make_s(renv, [list[i], list[i+1]], true))
          }
        }
        for (var i = lsinner.length - 1; i >= 0; i--) {
          var _lsin = lsinner[i]
          defines.push(..._lsin[0])
          definepros.push(..._lsin[1])
        }
      }else{
        if (!dicter[name]){
          dicter[name] = 1; 
          make_s(renv, make_chain(name))
        }
      }
    }
    patcher('Window')
    patcher('Screen')
    patcher('HTMLDocument')
    patcher('HTMLHeadElement')
    patcher('HTMLBodyElement')
    patcher('Navigator')
    patcher('PluginArray')
    patcher('Plugin')
    patcher('MimeTypeArray')
    patcher('MimeType')
    patcher('CSSStyleDeclaration')
    patcher('Location')
    patcher('HTMLCanvasElement')
    patcher('WebGLRenderingContext')
    patcher('CanvasRenderingContext2D')
    patcher('Performance')
    patcher('PerformanceEntry')
    patcher('PerformanceElementTiming')
    patcher('PerformanceEventTiming')
    patcher('PerformanceLongTaskTiming')
    patcher('PerformanceMark')
    patcher('PerformanceMeasure')
    patcher('PerformanceNavigation')
    patcher('PerformanceNavigationTiming')
    patcher('PerformanceObserver')
    patcher('PerformanceObserverEntryList')
    patcher('PerformancePaintTiming')
    patcher('PerformanceResourceTiming')
    patcher('PerformanceServerTiming')
    patcher('PerformanceTiming')
    patcher('PerformanceResourceTiming')
    patcher('Image')
    patcher('HTMLImageElement')
    patcher('HTMLMediaElement')
    patcher('HTMLUnknownElement')
    patcher('XMLHttpRequest')
    patcher('Storage')
    patcher('DOMTokenList')
    patcher('Touch')
    patcher('TouchEvent')
    patcher('Event')
    patcher('MouseEvent')
    patcher('PointerEvent')
    
    var _global = []
    var _gcache = []
    var _mpname = []
    var list = Object.keys(window)
    var _list = []
    var _first = ['self', 'top', 'frames', 'parent']
    for (var i = 0; i < list.length; i++) {
        if (_first.indexOf(list[i]) != -1){
            _list.unshift(list[i])
        }else if (list[i] != 'window'){
            _list.push(list[i])
        }
    }
    _list.unshift('window')

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
    var v_new_htmlmap = {}
    var v_eles = Object.keys(dicter)
    for (var i = 0; i < v_eles.length; i++) {
        if (htmlmap[v_eles[i]]){
            v_new_htmlmap[v_eles[i]] = htmlmap[v_eles[i]]
        }
    }
    v_new_htmlmap['HTMLAnchorElement'] = ["a"]; // 确保a标签存在
    var v_createE = JSON.stringify(v_new_htmlmap, 0, 0)
    var v_cele = []
    if (v_createE.length > 3){
        v_cele.push('function _createElement(name){')
        v_cele.push('  '+ 'var htmlmap = ' + v_createE)
        v_cele.push(...[
            `  var ret, htmlmapkeys = Object.keys(htmlmap)`,
            `  name = name.toLocaleLowerCase()`,
            `  for (var i = 0; i < htmlmapkeys.length; i++) {`,
            `    if (htmlmap[htmlmapkeys[i]].indexOf(name) != -1){`,
            `      ret = v_new(window[htmlmapkeys[i]])`,
            `      break`,
            `    }`,
            `  }`,
            `  if (!ret){ ret = v_new(HTMLUnknownElement) }`,
            `  if (typeof CSSStyleDeclaration != 'undefined') { ret.v_style = v_new(CSSStyleDeclaration) }`,
            `  ret.v_tagName = name.toUpperCase()`,
            `  return ret`,
        ])
        v_cele.push('}')
    }

    list = _list
    for (var i = 0; i < list.length; i++) {
        var obj = window[list[i]]
        var name = get_class_name(obj)
        if (dicter[name]){
            var idx = _gcache.indexOf(obj)
            if (idx == -1){
                _gcache.push(obj)
                _mpname.push(list[i])
                if (list[i] == 'window'){
                    _global.push(`if (typeof __dirname != 'undefined'){ __dirname = undefined }`)
                    _global.push(`if (typeof __filename != 'undefined'){ __filename = undefined }`)
                    _global.push(`if (typeof require != 'undefined'){ require = undefined }`)
                    _global.push(`if (typeof exports != 'undefined'){ exports = undefined }`)
                    _global.push(`if (typeof module != 'undefined'){ module = undefined }`)
                    _global.push(`if (typeof Buffer != 'undefined'){ Buffer = undefined }`)
                    _global.push(`var __globalThis__ = typeof global != 'undefined' ? global : this`)
                    _global.push(`var window = new Proxy(v_new(Window), {`)
                    _global.push(`  get(a,b){ if(b=='global'){return}return a[b] || __globalThis__[b] },`)
                    _global.push(`  set(a,b,c){ `)
                    _global.push(`    if (b == 'onclick' && typeof c == 'function') { window.addEventListener('click', c) }`)
                    _global.push(`    if (b == 'onmousedown' && typeof c == 'function') { window.addEventListener('mousedown', c) }`)
                    _global.push(`    if (b == 'onmouseup' && typeof c == 'function') { window.addEventListener('mouseup', c) }`)
                    _global.push(`    __globalThis__[b] = a[b] = c `)
                    _global.push(`    return true `)
                    _global.push(`  },`)
                    _global.push(`})`)
                    _global.push(`var v_hasOwnProperty = Object.prototype.hasOwnProperty`)
                    _global.push(`Object.prototype.hasOwnProperty = v_saf(function hasOwnProperty(){`)
                    _global.push(`  if (this == window){ return v_hasOwnProperty.apply(__globalThis__, arguments) }`)
                    _global.push(`  return v_hasOwnProperty.apply(this, arguments)`)
                    _global.push(`})`)
                    _global.push(`Object.defineProperties(__globalThis__, {[Symbol.toStringTag]:{value:'Window'}})`)
                    _global.push(`Object.defineProperties(__globalThis__, Object.getOwnPropertyDescriptors(window))`)
                    _global.push(`Object.setPrototypeOf(__globalThis__, Object.getPrototypeOf(window))`)
                }else{
                    if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(list[i]+'')){
                        _global.push(`window.${list[i]} = v_new(${name})`)
                    }else{
                        _global.push(`window[${JSON.stringify(list[i])}] = v_new(${name})`)
                    }
                }
            }else{
                var vname = _mpname[idx]
                if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(list[i]+'')){
                    _global.push(`window.${list[i]} = ${vname}`)
                }else{
                    _global.push(`window[${JSON.stringify(list[i])}] = ${vname}`)
                }
            }
        }
    }
    _global.push(`
var win = {
  window: window,
  frames: window,
  parent: window,
  self: window,
  top: window,
}
function v_repair_this(){
  win = {
    window: __globalThis__,
    frames: __globalThis__,
    parent: __globalThis__,
    self: __globalThis__,
    top: __globalThis__,
  }
}
Object.defineProperties(window, {
  window: {get:function(){return win.window},set:function(e){return win.window = e}},
  frames: {get:function(){return win.frames},set:function(e){return win.frames = e}},
  parent: {get:function(){return win.parent},set:function(e){return win.parent = e}},
  self:   {get:function(){return win.self},  set:function(e){return win.self = e}},
  top:    {get:function(){return win.top},   set:function(e){return win.top = e}},
})
      `)

    var tail = [
`function init_cookie(cookie){
  var cache = (cookie || "").trim();
  if (!cache){
    cache = ''
  }else if (cache.charAt(cache.length-1) != ';'){
    cache += '; '
  }else{
    cache += ' '
  }
  Object.defineProperty(Document.prototype, 'cookie', {
    get: function() {
      var r = cache.slice(0,cache.length-2);
      v_console_log('  [*] document -> cookie[get]', r)
      return r
    },
    set: function(c) {
      v_console_log('  [*] document -> cookie[set]', c)
      var ncookie = c.split(";")[0].split("=");
      if (!ncookie.slice(1).join('')){
        return c
      }
      var key = ncookie[0].trim()
      var val = ncookie.slice(1).join('').trim()
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
}
function v_hook_href(obj, name, initurl){
  var r = Object.defineProperty(obj, 'href', {
    get: function(){
      if (!(this.protocol) && !(this.hostname)){
        r = ''
      }else{
        r = this.protocol + "//" + this.hostname + (this.port ? ":" + this.port : "") + this.pathname + this.search + this.hash;
      }
      v_console_log(\`  [*] \${name||obj.constructor.name} -> href[get]:\`, JSON.stringify(r))
      return r
    },
    set: function(href){
      href = href.trim()
      v_console_log(\`  [*] \${name||obj.constructor.name} -> href[set]:\`, JSON.stringify(href))
      if (href.startsWith("http://") || href.startsWith("https://")){/*ok*/}
      else if(href.startsWith("//")){ href = (this.protocol?this.protocol:'http:') + href}
      else{ href = this.protocol+"//"+this.hostname + (this.port?":"+this.port:"") + '/' + ((href[0]=='/')?href.slice(1):href) }
      var a = href.match(/([^:]+:)\\/\\/([^/:?#]+):?(\\d+)?([^?#]*)?(\\?[^#]*)?(#.*)?/);
      this.protocol = a[1] ? a[1] : "";
      this.hostname = a[2] ? a[2] : "";
      this.port     = a[3] ? a[3] : "";
      this.pathname = a[4] ? a[4] : "";
      this.search   = a[5] ? a[5] : "";
      this.hash     = a[6] ? a[6] : "";
      this.host     = this.hostname + (this.port?":"+this.port:"") ;
      this.origin   = this.protocol + "//" + this.hostname + (this.port ? ":" + this.port : "");
    }
  });
  if (initurl && initurl.trim()){ var temp=v_new_toggle; v_new_toggle = true; r.href = initurl; v_new_toggle = temp; }
  return r
}
function v_hook_storage(){
  Storage.prototype.clear      = v_saf(function(){          v_console_log(\`  [*] Storage -> clear[func]:\`); var self=this;Object.keys(self).forEach(function (key) { delete self[key]; }); }, 'clear')
  Storage.prototype.getItem    = v_saf(function(key){       v_console_log(\`  [*] Storage -> getItem[func]:\`, key); var r = (this.hasOwnProperty(key)?String(this[key]):null); return r}, 'getItem')
  Storage.prototype.setItem    = v_saf(function(key, val){  v_console_log(\`  [*] Storage -> setItem[func]:\`, key, val); this[key] = (val === undefined)?null:String(val) }, 'setItem')
  Storage.prototype.key        = v_saf(function(key){       v_console_log(\`  [*] Storage -> key[func]:\`, key); return Object.keys(this)[key||0];} , 'key')
  Storage.prototype.removeItem = v_saf(function(key){       v_console_log(\`  [*] Storage -> removeItem[func]:\`, key); delete this[key];}, 'removeItem')
  Object.defineProperty(Storage.prototype, 'length', {get: function(){
    if(this===Storage.prototype){ throw TypeError('Illegal invocation') }return Object.keys(this).length
  }})
  window.sessionStorage = new Proxy(sessionStorage,{ set:function(a,b,c){ v_console_log(\`  [*] Storage -> [set]:\`, b, c); return a[b]=String(c)}, get:function(a,b){ v_console_log(\`  [*] Storage -> [get]:\`, b, a[b]); return a[b]},})
  window.localStorage = new Proxy(localStorage,{ set:function(a,b,c){ v_console_log(\`  [*] Storage -> [set]:\`, b, c); return a[b]=String(c)}, get:function(a,b){ v_console_log(\`  [*] Storage -> [get]:\`, b, a[b]); return a[b]},})
}
function v_init_document(){
  Document.prototype.getElementById = v_saf(function getElementById(name){ var r = v_getele(name, 'getElementById'); v_console_log('  [*] Document -> getElementById', name, r); return r })
  Document.prototype.querySelector = v_saf(function querySelector(name){ var r = v_getele(name, 'querySelector'); v_console_log('  [*] Document -> querySelector', name, r); return r })
  Document.prototype.getElementsByClassName = v_saf(function getElementsByClassName(name){ var r = v_geteles(name, 'getElementsByClassName'); v_console_log('  [*] Document -> getElementsByClassName', name, r); return r })
  Document.prototype.getElementsByName = v_saf(function getElementsByName(name){ var r = v_geteles(name, 'getElementsByName'); v_console_log('  [*] Document -> getElementsByName', name, r); return r })
  Document.prototype.getElementsByTagName = v_saf(function getElementsByTagName(name){ var r = v_geteles(name, 'getElementsByTagName'); v_console_log('  [*] Document -> getElementsByTagName', name, r); return r })
  Document.prototype.getElementsByTagNameNS = v_saf(function getElementsByTagNameNS(name){ var r = v_geteles(name, 'getElementsByTagNameNS'); v_console_log('  [*] Document -> getElementsByTagNameNS', name, r); return r })
  Document.prototype.querySelectorAll = v_saf(function querySelectorAll(name){ var r = v_geteles(name, 'querySelectorAll'); v_console_log('  [*] Document -> querySelectorAll', name, r); return r })
  var v_head = v_new(HTMLHeadElement)
  var v_body = v_new(HTMLBodyElement)
  Object.defineProperties(Document.prototype, {
    head: {get(){ v_console_log("  [*] Document -> head[get]", v_head);return v_head }},
    body: {get(){ v_console_log("  [*] Document -> body[get]", v_body);return v_body }},
  })
}
function v_init_canvas(){
  HTMLCanvasElement.prototype.getContext = function(){if (arguments[0]=='2d'){var r = v_new(CanvasRenderingContext2D); return r}; if (arguments[0]=='webgl' || arguments[0]=='experimental-webgl'){var r = v_new(WebGLRenderingContext); r._canvas = this; return r}; return null}
  HTMLCanvasElement.prototype.toDataURL = function(){return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAEYklEQVR4Xu3UAQkAAAwCwdm/9HI83BLIOdw5AgQIRAQWySkmAQIEzmB5AgIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlAABg+UHCBDICBisTFWCEiBgsPwAAQIZAYOVqUpQAgQMlh8gQCAjYLAyVQlKgIDB8gMECGQEDFamKkEJEDBYfoAAgYyAwcpUJSgBAgbLDxAgkBEwWJmqBCVAwGD5AQIEMgIGK1OVoAQIGCw/QIBARsBgZaoSlACBB1YxAJfjJb2jAAAAAElFTkSuQmCC"}
}
var v_start_stamp = +new Date
var v_fake_stamp = +new Date
function v_init_event_target(){
  v_events = {}
  function add_event(_this, x){
    if (!v_events[x[0]]){
      v_events[x[0]] = []
    }
    v_events[x[0]].push([_this, x[1].bind(_this)])
  }
  function _mk_mouse_event(type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, altKey, shiftKey, metaKey, button, relatedTarget){
    if (type == 'click'){
      var m = new v_saf(function PointerEvent(){})
      m.pointerType = "mouse"
    }else{
      var m = new v_saf(function MouseEvent(){})
    }
    m.isTrusted = true
    m.type = type
    m.canBubble = canBubble
    m.cancelable = cancelable
    m.view = view
    m.detail = detail
    m.screenX = screenX; m.movementX = screenX
    m.screenY = screenY; m.movementY = screenY
    m.clientX = clientX; m.layerX = clientX; m.offsetX = clientX; m.pageX = clientX; m.x = clientX;
    m.clientY = clientY; m.layerY = clientY; m.offsetY = clientY; m.pageY = clientY; m.y = clientY;
    m.ctrlKey = ctrlKey
    m.altKey = altKey
    m.shiftKey = shiftKey
    m.metaKey = metaKey
    m.button = button
    m.relatedTarget = relatedTarget
    return m
  }
  function make_mouse(type, x, y){
    return _mk_mouse_event(type, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null)
  }
  function mouse_click(x, y){
    for (var i = 0; i < (v_events['click'] || []).length; i++) { v_events['click'][i][1](make_mouse('click', x, y)) }
    for (var i = 0; i < (v_events['mousedown'] || []).length; i++) { v_events['mousedown'][i][1](make_mouse('mousedown', x, y)) }
    for (var i = 0; i < (v_events['mouseup'] || []).length; i++) { v_events['mouseup'][i][1](make_mouse('mouseup', x, y)) }
  }
  var offr = Math.random()
  function make_touch(_this, type, x, y, timeStamp){
    var offx = Math.random()
    var offy = Math.random()
    var t = v_new(new v_saf(function Touch(){}))
    t = clientX = offx + x
    t = clientY = offy + y
    t = force = 1
    t = identifier = 0
    t = pageX = offx + x
    t = pageY = offy + y
    t = radiusX = 28 + offr
    t = radiusY = 28 + offr
    t = rotationAngle = 0
    t = screenX = 0
    t = screenY = 0
    var e = v_new(new v_saf(function TouchEvent(){}))
    e.isTrusted = true
    e.altKey = false
    e.bubbles = true
    e.cancelBubble = false
    e.cancelable = false
    e.changedTouches = e.targetTouches = e.touches = [t]
    e.composed = true
    e.ctrlKey = false
    e.currentTarget = null
    e.defaultPrevented = false
    e.detail = 0
    e.eventPhase = 0
    e.metaKey = false
    e.path = _this == window ? [window] : [_this, window]
    e.returnValue = true
    e.shiftKey = false
    e.sourceCapabilities = new v_saf(function InputDeviceCapabilities(){this.firesTouchEvents = true})
    e.srcElement = _this
    e.target = _this
    e.type = type
    e.timeStamp = timeStamp == undefined ? (new Date - v_start_stamp) : ((v_fake_stamp += Math.random()*20) - v_start_stamp)
    e.view = window
    e.which = 0
    return e
  }
  function make_trace(x1, y1, x2, y2){
    // 贝塞尔曲线
    function step_len(x1, y1, x2, y2){
      var ln = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
      return (ln / 10) ^ 0
    }
    var slen = step_len(x1, y1, x2, y2)
    if (slen < 3){
      return []
    }
    function factorial(x){
      for(var y = 1; x > 1;  x--) {
        y *= x
      }
      return y;
    }
    var lp = Math.random()
    var rp = Math.random()
    var xx1 = (x1 + (x2 - x1) / 12 * (4-lp*4)) ^ 0
    var yy1 = (y1 + (y2 - y1) / 12 * (8+lp*4)) ^ 0
    var xx2 = (x1 + (x2 - x1) / 12 * (8+rp*4)) ^ 0
    var yy2 = (y1 + (y2 - y1) / 12 * (4-rp*4)) ^ 0
    var points = [[x1, y1], [xx1, yy1], [xx2, yy2], [x2, y2]]
    var N = points.length
    var n = N - 1 
    var traces = []
    var step = slen
    for (var T = 0; T < step+1; T++) {
      var t = T*(1/step)
      var x = 0
      var y = 0
      for (var i = 0; i < N; i++) {
        var B = factorial(n)*t**i*(1-t)**(n-i)/(factorial(i)*factorial(n-i))
        x += points[i][0]*B
        y += points[i][1]*B
      }
      traces.push([x^0, y^0])
    }
    return traces
  }
  function touch(x1, y1, x2, y2){
    if (x2 == undefined && y2 == undefined){
      x2 = x1
      y2 = y1
    }
    var traces = make_trace(x1, y1, x2, y2)
    console.log('traces:', traces)
    for (var i = 0; i < (v_events['touchstart'] || []).length; i++) { v_events['touchstart'][i][1](make_touch(v_events['touchstart'][i][0], 'touchstart', x1, y1)) }
    for (var j = 0; j < traces.length; j++) {
      var x = traces[j][0]
      var y = traces[j][0]
      for (var i = 0; i < (v_events['touchmove'] || []).length; i++) { v_events['touchmove'][i][1](make_touch(v_events['touchmove'][i][0], 'touchmove', x, y)) }
    }
    for (var i = 0; i < (v_events['touchend'] || []).length; i++) { v_events['touchend'][i][1](make_touch(v_events['touchend'][i][0], 'touchend', x2, y2)) }
  }
  function mouse_move(x1, y1, x2, y2){
    if (x2 == undefined && y2 == undefined){
      x2 = x1
      y2 = y1
    }
    var traces = make_trace(x1, y1, x2, y2)
    console.log('traces:', traces)
    for (var j = 0; j < traces.length; j++) {
      var x = traces[j][0]
      var y = traces[j][0]
      for (var i = 0; i < (v_events['mousemove'] || []).length; i++) { v_events['mousemove'][i][1](make_touch(v_events['mousemove'][i][0], 'mousemove', x, y)) }
    }
  }
  window.make_mouse = make_mouse
  window.mouse_click = mouse_click
  window.mouse_move = mouse_move
  window.touch = touch
  EventTarget.prototype.addEventListener = function(){v_console_log('  [*] EventTarget -> addEventListener[func]', this===window?'[Window]':this===document?'[Document]':this, [].slice.call(arguments)); add_event(this, [].slice.call(arguments)); return null}
  EventTarget.prototype.dispatchEvent = function(){v_console_log('  [*] EventTarget -> dispatchEvent[func]', this===window?'[Window]':this===document?'[Document]':this, [].slice.call(arguments)); add_event(this, [].slice.call(arguments)); return null}
  EventTarget.prototype.removeEventListener = function(){v_console_log('  [*] EventTarget -> removeEventListener[func]', this===window?'[Window]':this===document?'[Document]':this, [].slice.call(arguments)); add_event(this, [].slice.call(arguments)); return null}
}
function v_init_Element_prototype(){
  Element.prototype.getAnimations          = Element.prototype.getAnimations          || v_saf(function getAnimations(){v_console_log("  [*] Element -> getAnimations[func]", [].slice.call(arguments));})
  Element.prototype.getAttribute           = Element.prototype.getAttribute           || v_saf(function getAttribute(){v_console_log("  [*] Element -> getAttribute[func]", [].slice.call(arguments));})
  Element.prototype.getAttributeNS         = Element.prototype.getAttributeNS         || v_saf(function getAttributeNS(){v_console_log("  [*] Element -> getAttributeNS[func]", [].slice.call(arguments));})
  Element.prototype.getAttributeNames      = Element.prototype.getAttributeNames      || v_saf(function getAttributeNames(){v_console_log("  [*] Element -> getAttributeNames[func]", [].slice.call(arguments));})
  Element.prototype.getAttributeNode       = Element.prototype.getAttributeNode       || v_saf(function getAttributeNode(){v_console_log("  [*] Element -> getAttributeNode[func]", [].slice.call(arguments));})
  Element.prototype.getAttributeNodeNS     = Element.prototype.getAttributeNodeNS     || v_saf(function getAttributeNodeNS(){v_console_log("  [*] Element -> getAttributeNodeNS[func]", [].slice.call(arguments));})
  Element.prototype.getBoundingClientRect  = Element.prototype.getBoundingClientRect  || v_saf(function getBoundingClientRect(){v_console_log("  [*] Element -> getBoundingClientRect[func]", [].slice.call(arguments));})
  Element.prototype.getClientRects         = Element.prototype.getClientRects         || v_saf(function getClientRects(){v_console_log("  [*] Element -> getClientRects[func]", [].slice.call(arguments));})
  Element.prototype.getElementsByClassName = Element.prototype.getElementsByClassName || v_saf(function getElementsByClassName(){v_console_log("  [*] Element -> getElementsByClassName[func]", [].slice.call(arguments));})
  Element.prototype.getElementsByTagName   = Element.prototype.getElementsByTagName   || v_saf(function getElementsByTagName(){v_console_log("  [*] Element -> getElementsByTagName[func]", [].slice.call(arguments));})
  Element.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS || v_saf(function getElementsByTagNameNS(){v_console_log("  [*] Element -> getElementsByTagNameNS[func]", [].slice.call(arguments));})
  Element.prototype.getInnerHTML           = Element.prototype.getInnerHTML           || v_saf(function getInnerHTML(){v_console_log("  [*] Element -> getInnerHTML[func]", [].slice.call(arguments));})
  Element.prototype.hasAttribute           = Element.prototype.hasAttribute           || v_saf(function hasAttribute(){v_console_log("  [*] Element -> hasAttribute[func]", [].slice.call(arguments));})
  Element.prototype.hasAttributeNS         = Element.prototype.hasAttributeNS         || v_saf(function hasAttributeNS(){v_console_log("  [*] Element -> hasAttributeNS[func]", [].slice.call(arguments));})
  Element.prototype.hasAttributes          = Element.prototype.hasAttributes          || v_saf(function hasAttributes(){v_console_log("  [*] Element -> hasAttributes[func]", [].slice.call(arguments));})
  Element.prototype.hasPointerCapture      = Element.prototype.hasPointerCapture      || v_saf(function hasPointerCapture(){v_console_log("  [*] Element -> hasPointerCapture[func]", [].slice.call(arguments));})
  Element.prototype.webkitMatchesSelector  = Element.prototype.webkitMatchesSelector  || v_saf(function webkitMatchesSelector(){v_console_log("  [*] Element -> webkitMatchesSelector[func]", [].slice.call(arguments));})
}
function v_init_DOMTokenList_prototype(){
  DOMTokenList.prototype.add = DOMTokenList.prototype.add || v_saf(function add(){v_console_log("  [*] DOMTokenList -> add[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.contains = DOMTokenList.prototype.contains || v_saf(function contains(){v_console_log("  [*] DOMTokenList -> contains[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.entries = DOMTokenList.prototype.entries || v_saf(function entries(){v_console_log("  [*] DOMTokenList -> entries[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.forEach = DOMTokenList.prototype.forEach || v_saf(function forEach(){v_console_log("  [*] DOMTokenList -> forEach[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.item = DOMTokenList.prototype.item || v_saf(function item(){v_console_log("  [*] DOMTokenList -> item[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.keys = DOMTokenList.prototype.keys || v_saf(function keys(){v_console_log("  [*] DOMTokenList -> keys[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.length = DOMTokenList.prototype.length || v_saf(function length(){v_console_log("  [*] DOMTokenList -> length[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.remove = DOMTokenList.prototype.remove || v_saf(function remove(){v_console_log("  [*] DOMTokenList -> remove[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.replace = DOMTokenList.prototype.replace || v_saf(function replace(){v_console_log("  [*] DOMTokenList -> replace[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.supports = DOMTokenList.prototype.supports || v_saf(function supports(){v_console_log("  [*] DOMTokenList -> supports[func]", [].slice.call(arguments));})
  DOMTokenList.prototype.toggle = DOMTokenList.prototype.toggle || v_saf(function toggle(){v_console_log("  [*] DOMTokenList -> toggle[func]", [].slice.call(arguments));})
}
function v_init_CSSStyleDeclaration_prototype(){
  CSSStyleDeclaration.prototype["zoom"] = ''
  CSSStyleDeclaration.prototype["resize"] = ''
  CSSStyleDeclaration.prototype["text-rendering"] = ''
  CSSStyleDeclaration.prototype["text-align-last"] = ''
}
function v_init_PointerEvent_prototype(){
  PointerEvent.prototype.getCoalescedEvents = v_saf(function getCoalescedEvents(){v_console_log("  [*] PointerEvent -> getCoalescedEvents[func]", [].slice.call(arguments));})
  PointerEvent.prototype.getPredictedEvents = v_saf(function getPredictedEvents(){v_console_log("  [*] PointerEvent -> getPredictedEvents[func]", [].slice.call(arguments));})
}
function v_init_PerformanceTiming_prototype(){
  try{
    Object.defineProperties(PerformanceTiming.prototype, {
      connectEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function connectEnd(){v_console_log("  [*] PerformanceTiming -> connectEnd[get]", [].slice.call(arguments));})},
      connectStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function connectStart(){v_console_log("  [*] PerformanceTiming -> connectStart[get]", [].slice.call(arguments));})},
      domComplete: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domComplete(){v_console_log("  [*] PerformanceTiming -> domComplete[get]", [].slice.call(arguments));})},
      domContentLoadedEventEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domContentLoadedEventEnd(){v_console_log("  [*] PerformanceTiming -> domContentLoadedEventEnd[get]", [].slice.call(arguments));})},
      domContentLoadedEventStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domContentLoadedEventStart(){v_console_log("  [*] PerformanceTiming -> domContentLoadedEventStart[get]", [].slice.call(arguments));})},
      domInteractive: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domInteractive(){v_console_log("  [*] PerformanceTiming -> domInteractive[get]", [].slice.call(arguments));})},
      domLoading: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domLoading(){v_console_log("  [*] PerformanceTiming -> domLoading[get]", [].slice.call(arguments));})},
      domainLookupEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domainLookupEnd(){v_console_log("  [*] PerformanceTiming -> domainLookupEnd[get]", [].slice.call(arguments));})},
      domainLookupStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function domainLookupStart(){v_console_log("  [*] PerformanceTiming -> domainLookupStart[get]", [].slice.call(arguments));})},
      fetchStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function fetchStart(){v_console_log("  [*] PerformanceTiming -> fetchStart[get]", [].slice.call(arguments));})},
      loadEventEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function loadEventEnd(){v_console_log("  [*] PerformanceTiming -> loadEventEnd[get]", [].slice.call(arguments));})},
      loadEventStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function loadEventStart(){v_console_log("  [*] PerformanceTiming -> loadEventStart[get]", [].slice.call(arguments));})},
      navigationStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function navigationStart(){v_console_log("  [*] PerformanceTiming -> navigationStart[get]", [].slice.call(arguments));})},
      redirectEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function redirectEnd(){v_console_log("  [*] PerformanceTiming -> redirectEnd[get]", [].slice.call(arguments));})},
      redirectStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function redirectStart(){v_console_log("  [*] PerformanceTiming -> redirectStart[get]", [].slice.call(arguments));})},
      requestStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function requestStart(){v_console_log("  [*] PerformanceTiming -> requestStart[get]", [].slice.call(arguments));})},
      responseEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function responseEnd(){v_console_log("  [*] PerformanceTiming -> responseEnd[get]", [].slice.call(arguments));})},
      responseStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function responseStart(){v_console_log("  [*] PerformanceTiming -> responseStart[get]", [].slice.call(arguments));})},
      secureConnectionStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function secureConnectionStart(){v_console_log("  [*] PerformanceTiming -> secureConnectionStart[get]", [].slice.call(arguments));})},
      unloadEventEnd: {set: undefined, enumerable: true, configurable: true, get: v_saf(function unloadEventEnd(){v_console_log("  [*] PerformanceTiming -> unloadEventEnd[get]", [].slice.call(arguments));})},
      unloadEventStart: {set: undefined, enumerable: true, configurable: true, get: v_saf(function unloadEventStart(){v_console_log("  [*] PerformanceTiming -> unloadEventStart[get]", [].slice.call(arguments));})},
    })
  }catch(e){}
}
function mk_atob_btoa(r){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t=new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1);return{atob:function(r){var a,e,o,h,c,i,n;for(i=r.length,c=0,n="";c<i;){do{a=t[255&r.charCodeAt(c++)]}while(c<i&&-1==a);if(-1==a)break;do{e=t[255&r.charCodeAt(c++)]}while(c<i&&-1==e);if(-1==e)break;n+=String.fromCharCode(a<<2|(48&e)>>4);do{if(61==(o=255&r.charCodeAt(c++)))return n;o=t[o]}while(c<i&&-1==o);if(-1==o)break;n+=String.fromCharCode((15&e)<<4|(60&o)>>2);do{if(61==(h=255&r.charCodeAt(c++)))return n;h=t[h]}while(c<i&&-1==h);if(-1==h)break;n+=String.fromCharCode((3&o)<<6|h)}return n},btoa:function(r){var t,e,o,h,c,i;for(o=r.length,e=0,t="";e<o;){if(h=255&r.charCodeAt(e++),e==o){t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4),t+="==";break}if(c=r.charCodeAt(e++),e==o){t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4|(240&c)>>4),t+=a.charAt((15&c)<<2),t+="=";break}i=r.charCodeAt(e++),t+=a.charAt(h>>2),t+=a.charAt((3&h)<<4|(240&c)>>4),t+=a.charAt((15&c)<<2|(192&i)>>6),t+=a.charAt(63&i)}return t}}}
var atob_btoa = mk_atob_btoa()
window.btoa = window.btoa || v_saf(atob_btoa.btoa, 'btoa')
window.atob = window.atob || v_saf(atob_btoa.atob, 'atob')
`,

`init_cookie(${JSON.stringify(document.cookie)})`,
`v_hook_href(window.location, 'location', ${JSON.stringify(location.href)})`,
`Location.prototype.toString = v_saf(function toString(){ return ${JSON.stringify(location.href)} })`,
`window.alert = v_saf(function alert(){})`,
`v_hook_storage()`,
`v_init_document()`,
`v_init_canvas()`,
`v_init_event_target()`,
`v_init_Element_prototype()`,
`v_init_DOMTokenList_prototype()`,
`v_init_CSSStyleDeclaration_prototype()`,
`v_init_PointerEvent_prototype()`,
`v_init_PerformanceTiming_prototype()`,
`window.innerWidth = ${window.innerWidth}`,
`window.innerHeight = ${window.innerHeight}`,
`window.outerHeight = ${window.outerHeight}`,
`window.outerWidth = ${window.outerWidth}`,
`window.isSecureContext = true`,
`window.origin = location.origin`,
]

    var v_getele = eles.v_getele
    var v_geteles = eles.v_geteles
    var v_getele_inner = Object.keys(v_getele).map(function(e){
      var clzname = get_class_name(v_getele[e][1])
      patcher(clzname)
      return `  if(name == ${JSON.stringify(e)} && func == ${JSON.stringify(v_getele[e][0])}){ return v_new(${clzname}) }`
    })
    v_getele_inner.push('  return null')
    tail.push(...[
      `function v_getele(name, func){`,
      ...v_getele_inner,
      `}`,
    ])

    var v_geteles_inner = Object.keys(v_geteles).map(function(e){
      var _clzs = []
      var _eles = v_geteles[e][1]
      for (var i = 0; i < _eles.length; i++) {
        var clzname = get_class_name(_eles[i])
        patcher(clzname)
        _clzs.push(`v_new(${clzname})`)
      }
      return `  if(name == ${JSON.stringify(e)} && func == ${JSON.stringify(v_geteles[e][0])}){ return [${_clzs.join(',')}] }`
    })
    v_geteles_inner.push('  return null')
    tail.push(...[
      `function v_geteles(name, func){`,
      ...v_geteles_inner,
      `}`,
    ])
    tail.push(`var v_Date = Date;`)
    tail.push(`var v_base_time = +new Date;`)
    tail.push(`(function(){`)
    tail.push(`  function ftime(){`)
    tail.push(`    return new v_Date() - v_base_time + v_to_time`)
    tail.push(`  }`)
    tail.push(`  Date = function(_Date) {`)
    tail.push(`    var bind = Function.bind;`)
    tail.push(`    var unbind = bind.bind(bind);`)
    tail.push(`    function instantiate(constructor, args) {`)
    tail.push(`      return new (unbind(constructor, null).apply(null, args));`)
    tail.push(`    }`)
    tail.push(`    var names = Object.getOwnPropertyNames(_Date);`)
    tail.push(`    for (var i = 0; i < names.length; i++) {`)
    tail.push(`      if (names[i]in Date)`)
    tail.push(`        continue;`)
    tail.push(`      var desc = Object.getOwnPropertyDescriptor(_Date, names[i]);`)
    tail.push(`      Object.defineProperty(Date, names[i], desc);`)
    tail.push(`    }`)
    tail.push(`    function Date() {`)
    tail.push(`      var date = instantiate(_Date, [ftime()]);`)
    tail.push(`      return date;`)
    tail.push(`    }`)
    tail.push(`    Date.prototype = _Date.prototype`)
    tail.push(`    return v_saf(Date);`)
    tail.push(`  }(Date);`)
    tail.push(`  Date.now = v_saf(function now(){ return ftime() })`)
    tail.push(`})();`)
    tail.push(`var v_to_time = +new v_Date`)
    tail.push(`// var v_to_time = +new v_Date('Sat Sep 03 2022 11:11:58 GMT+0800') // 自定义起始时间`)
    tail.push(``)
    tail.push(`v_repair_this() // 修复 window 指向global`)
    tail.push('v_new_toggle = undefined')
    tail.push('// v_console_log = function(){} // 关闭日志输出')
    var rets = [
        `var v_saf;!function(){var n=Function.toString,t=[],i=[],o=[].indexOf.bind(t),e=[].push.bind(t),r=[].push.bind(i);function u(n,t){return-1==o(n)&&(e(n),r(\`function \${t||n.name||""}() { [native code] }\`)),n}Object.defineProperty(Function.prototype,"toString",{enumerable:!1,configurable:!0,writable:!0,value:function(){return"function"==typeof this&&i[o(this)]||n.call(this)}}),u(Function.prototype.toString,"toString"),v_saf=u}();`,
        '\n',
        ...prefix,
        '\n',
        ...defines,
        ...definepros,
        '\n\n\n',
        ..._global,
        ...v_cele,
        ...tail,
    ]
    return rets.join('\n') + ';'
}



function injectfunc(e, window) {
  var FuntoString = Function.prototype.toString
  var origslice = [].slice

  var v_Error = Error
  window.globalConfig = e;
  console.log("inject start!", e)
  if ((e["config-hook-regexp-url"] || '').trim()){
    console.log('[*] 配置了只收集对某个js路径才输出的配置（如出现控制台不输出hook，注意配置该项为空）:', e["config-hook-regexp-url"])
  }
  // 备份 console.log
  function _mk_logs(){
    return origslice.call(arguments).map(function(e){
      if (typeof e == 'function'){
        return FuntoString.call(e) // 使用原始 Function 的 toString 防止 log 作用在函数 toString 上的反调试
      }else{
        return e
      }
    })
  }
  !function(){ 
    var log_limit = e["config-hook-log-limit-num"] || 30
    var regexp = /^ *\([\*f]\)/
    var rtest = regexp.test.bind(regexp)
    var cache = {}
    var close_tog = {}
    var v_console_log = console.log
    window.v_log = function(...a){
      if (typeof a[0] == 'string' && rtest(a[0])){
        cache[a[0]] = (cache[a[0]] || 0) + 1
        if (cache[a[0]] > log_limit){
          if (!close_tog[a[0]]){
            close_tog[a[0]] = true
            v_console_log(a[0], '超过接口的输出上限:', log_limit, ', 停止输出该接口的日志.（默认30，可在 “dom对象hook配置” 的红色窗口中配置）')
          }
          return
        }
      }
      v_console_log(...a)
    }
  }()
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

  var expurl = RegExp((e["config-hook-regexp-url"] || '').trim())
  RegExp.prototype.v_test = RegExp.prototype.test
  var c_split = String.prototype.split
  String.prototype.v_split = function(){
    if (typeof this == 'string'){
      return c_split.apply(this, arguments)
    }else{
      return 'error v_split'
    }
  }
  function openwin(txt) {
      var OpenWindow = window.open("about:blank", "1", "height=600, width=800,toolbar=no,scrollbars=" + scroll + ",menubar=no");
      OpenWindow.document.write(`
  <!DOCTYPE html>
  <html>
  <head>
  <title></title>
  </head>
  <body>
  <h3>从下面的窗口直接复制生成的代码使用</h3>
  <textarea style="width: 100%; height: 1500px" id="txt" spellcheck="false"></textarea>
  </body>
  </html>
  `)
      var left = 100
      var top = 100
      OpenWindow.moveTo(left, top);
      OpenWindow.document.close()
      return OpenWindow.txt.value = txt || ''
  }

  var v_window_cache = {}
  var v_winkeys = Object.getOwnPropertyNames(window)
  for (var i = 0; i < v_winkeys.length; i++) {
    if (typeof v_winkeys[i] == 'string'){
      v_window_cache[v_winkeys[i]] = window[v_winkeys[i]]
    }
  }
  var v_env_cache = {}
  window.v_log_env = function (){
    $make_v_func
    function copyToClipboard(str){
      try{
        openwin(str)
      }catch(e){
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
          document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(selected);
          alert('已将代码存放到剪贴板中。')
        }else{
          alert('保存至剪贴板失败。尝试直接将代码用 console.log 直接输出在控制台中。(因为可能会保存失败，可以多点几次 “生成临时环境”)')
          console.log(str)
        }
      }
    };
    var mkstr = make_v([v_env_cache, v_getelement_all])
    copyToClipboard(mkstr)
  }

  // var v_addlistener_cache = {
  //   document: {},
  //   window: {},
  // }
  var v_getelement_all = {
    v_getele: {},
    v_geteles: {},
  }
  function inspect_arguments(_this, arg, ret, clazz, name, type){
    // 这里搞魔改处理，让所有挂钩的函数的 arguments 都经过这个函数，然后方便魔改或收集内容。
    // if (name == 'addEventListener'){
    //   if (_this == document){ var cache = v_addlistener_cache.document }
    //   if (_this == window){ var cache = v_addlistener_cache.window }
    //   var fname = arg[0]
    //   var func = arg[1]
    //   cache[fname] = cache[fname] || []
    //   cache[fname].push(func)
    // }
    if (name == 'getElementById' || name == 'querySelector'){
      if (ret){
        v_getelement_all.v_getele[arg[0]] = [name, ret]
      }
    }
    if (name == 'getElementsByClassName' || name == 'getElementsByName' || name == 'getElementsByTagName' || name == 'getElementsByTagNameNS' || name == 'querySelectorAll'){
      if (ret.length){
        v_getelement_all.v_geteles[arg[0]] = [name, ret]
      }
    }
  }

  function v_cache_node(_addr, clazz, func, type, r){
    // addr 这里的格式有点乱，还会携带一些代码执行行号的信息，要处理成 url 的形式，方便选择。
    var exp = /http([^:]+:)\/\/([^/:?#]+)(:\d+)?([^?#:]*)?(\?[^#:]*)?(#[^:]*)?/
    if (exp.exec(_addr)){
      var addr = exp.exec(_addr)[0]
    }else{
      var addr = _addr
    }
    v_env_cache[addr] = v_env_cache[addr] || {}
    v_env_cache[addr][clazz] = v_env_cache[addr][clazz] || {}
    v_env_cache[addr][clazz][func] = v_env_cache[addr][clazz][func] || {}
    v_env_cache[addr][clazz][func][type] = {}
    if (typeof r == 'string' || typeof r == 'number' || typeof r == 'boolean'){
      v_env_cache[addr][clazz][func][type].value = r
    }else{
      v_env_cache[addr][clazz][func][type].value = {}
    }
  }

  var expstr = ''
  var attoggle = e["config-hook-log-at"]
  function get_log_at(log_at){
    return attoggle?(' '.repeat(30)+log_at):''
  }
  if (e["config-hook-random"] && e["config-hook-random-freeze"]){
    Math.random = saf(function random(){ return 0.5 })
  }
  if (e["config-hook-random"] && e["config-hook-random-fake"]){
    Math.random = saf((function(seed){ return function random() { return (seed = (seed * 9301 + 49297) % 233280) / 233280 } })(123))
  }
  if (e["config-hook-random"] && e["config-hook-time-freeze"]){
    var v_Date = Date
    var ftime = +e["config-hook-time-freeze-number"]
    Date = function(_Date) {
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
        Object.defineProperty(Date, names[i], desc);
      }
      function Date() {
        var date = instantiate(_Date, [ftime]); // 固定返回某一个时间点
        return date;
      }
      Date.prototype = _Date.prototype
      return saf(Date);
    }(Date);
    Date.now = saf(function now(){ return ftime })
  }
  if (e["config-hook-random"] && e["config-hook-time-performance"]){
    var v_perfnow = 1024 // 固定返回一个数字
    Performance.prototype.now = saf(function now(){ return v_perfnow })
  }

  var toggle = true
  function change_toggle(toggle){
    e["config-hook-domobj"] = toggle
    e["config-hook-Function"] = toggle
    e["config-hook-eval"] = toggle
    e["config-hook-cookie"] = toggle
    e["config-hook-settimeout"] = toggle
    e["config-hook-setinterval"] = toggle
    e["config-hook-JSON.parse"] = toggle
    e["config-hook-JSON.stringify"] = toggle
    e["config-hook-decodeURI"] = toggle
    e["config-hook-decodeURIComponent"] = toggle
    e["config-hook-encodeURI"] = toggle
    e["config-hook-encodeURIComponent"] = toggle
    e["config-hook-escape"] = toggle
    e["config-hook-unescape"] = toggle
    e["config-hook-JSON.parse"] = toggle
    e["config-hook-JSON.stringify"] = toggle
    e["config-hook-decodeURI"] = toggle
    e["config-hook-decodeURIComponent"] = toggle
    e["config-hook-encodeURI"] = toggle
    e["config-hook-encodeURIComponent"] = toggle
    e["config-hook-escape"] = toggle
    e["config-hook-unescape"] = toggle
    e["config-hook-atob"] = toggle
    e["config-hook-btoa"] = toggle
  }
  e.logtogglefunc = function(event){
    if (event.key == 'w' && event.altKey){
      toggle = !toggle
      change_toggle(toggle)
      if (toggle){
        window.v_log('开启日志')
      }else{
        window.v_log('关闭日志')
      }
    }
  }
  if (e["config-hook-alt-w"]) {
    document.onkeydown = e.logtogglefunc
  }
  if (e["config-hook-console"]){
    Object.keys(console).map(function(e){console[e] = eval(`saf(function ${e}(){})`)})
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
        }else{ 
          if (e["config-hook-Function"]){
            window.v_log(..._mk_logs('Function code:', arguments[arguments.length-1]) )
          }
        }
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
        }else{ 
          if (e["config-hook-eval"]){
            window.v_log(..._mk_logs('eval code:', arguments[arguments.length-1]) )
          }
        }
        return _oldeval.apply(this, arguments)
      }
      saf(eval)
    }()
  }
  if (e["config-hook-remove-dyn-debugger"]){
    !function(){
      function mk_func(fname){
        var temp = []
        function replace_debugger(e){
          if (/debugger/.test(e[e.length-1])){
            if (temp.indexOf(e[e.length-1]) == -1){
              temp.push(e[e.length-1])
              window.v_log(..._mk_logs(`[replace_debugger:${fname}]: debugger is exist, replace it with empty string.`))
            }
            e[e.length-1]=e[e.length-1].replace(/debugger/g, '    ')
          }else{ 
            if (temp.indexOf(e[e.length-1]) == -1){
              temp.push(e[e.length-1])
              window.v_log(..._mk_logs(`[replace_debugger:${fname}]: ${e[e.length-1]}`) )
            }
          }
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
        }else{ 
          if (e["config-hook-cookie"] && e["config-hook-cookie-get"]){
            var expstr=v_Error().stack.v_split('\n')[2]
            v_cache_node(expstr, "Document", "cookie", "get", r)
            if (expurl.v_test(expstr) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('(*) [cookie get]', r, get_log_at(expstr.trim())))
            }
            if (e["config-hook-cookie-add-debugger"] && r.indexOf(e["config-hook-cookie-match"]) != -1){ debugger }
          }
        }
        return r
      }
      saf(_new_cookie_get)
      var _new_cookie_set = function set(v){
        if (window.v_cookie_set){
          window.v_cookie_set(arguments)
        }else{ 
          if (e["config-hook-cookie"] && e["config-hook-cookie-set"]){
            var expstr=v_Error().stack.v_split('\n')[2]
            v_cache_node(expstr, "Document", "cookie", "set")
            if (expurl.v_test(expstr) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('(*) [cookie set]', v, get_log_at(expstr.trim())) )
            }
          }
          if (e["config-hook-cookie-add-debugger"] && v.indexOf(e["config-hook-cookie-match"]) != -1){ 
            debugger 
          }
        }
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
        }else{ 
          if (e["config-hook-settimeout"]){
            if (expurl.v_test(expstr=v_Error().stack.v_split('\n')[2]) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('[settimeout]', ...arguments, get_log_at(expstr.trim())))
            }
          }
        }
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
        }else{ 
          if (e["config-hook-setinterval"]){
            if (expurl.v_test(expstr=v_Error().stack.v_split('\n')[2]) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('[setinterval]', ...arguments, get_log_at(expstr.trim())) )
            }
          }
        }
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
  var v_atob = atob
  var v_btoa = btoa
  // var util = require('util')
  var util = {
    inspect:function(e){
      var r;
      if (typeof e == 'string'){
        r=e+'';
        if(r.length>100){
          r=r.slice(0,100)+'...'
        };
      }else if( Object.prototype.toString.call(e) == '[object Arguments]' ){
        r = origslice.call(e)
      }
      else{ r = e }
      return r
    }
  }
  var v_logs = function (a, b, c) {
    if (expurl.v_test(expstr=v_Error().stack.v_split('\n')[3]) && typeof expstr == 'string'){
      window.v_log(..._mk_logs('  (*)', a, util.inspect(b), '===>', c, get_log_at(expstr.trim())))
    }
    return c
  }

  if (e["config-hook-encrypt-normal"]){
    if (e["config-hook-JSON.parse"]){ JSON.parse = saf(function parse(){ return e["config-hook-JSON.parse"]?v_logs('[JSON.parse]:', arguments, v_parse.apply(this, arguments)):v_parse.apply(this, arguments) }) }
    if (e["config-hook-JSON.stringify"]){ JSON.stringify = saf(function stringify(){ return e["config-hook-JSON.stringify"]?v_logs('[JSON.stringify]:', arguments, v_stringify.apply(this, arguments)):v_stringify.apply(this, arguments) }) }
    if (e["config-hook-decodeURI"]){ decodeURI = saf(function decodeURI(){ return e["config-hook-decodeURI"]?v_logs('[decodeURI]:', arguments, v_decodeURI.apply(this, arguments)):v_decodeURI.apply(this, arguments) }) }
    if (e["config-hook-decodeURIComponent"]){ decodeURIComponent = saf(function decodeURIComponent(){ return e["config-hook-decodeURIComponent"]?v_logs('[decodeURIComponent]:', arguments, v_decodeURIComponent.apply(this, arguments)):v_decodeURIComponent.apply(this, arguments) }) }
    if (e["config-hook-encodeURI"]){ encodeURI = saf(function encodeURI(){ return e["config-hook-encodeURI"]?v_logs('[encodeURI]:', arguments, v_encodeURI.apply(this, arguments)):v_encodeURI.apply(this, arguments) }) }
    if (e["config-hook-encodeURIComponent"]){ encodeURIComponent = saf(function encodeURIComponent(){ return e["config-hook-encodeURIComponent"]?v_logs('[encodeURIComponent]:', arguments, v_encodeURIComponent.apply(this, arguments)):v_encodeURIComponent.apply(this, arguments) }) }
    if (e["config-hook-escape"]){ escape = saf(function escape(){ return e["config-hook-escape"]?v_logs('[escape]:', arguments, v_escape.apply(this, arguments)):v_escape.apply(this, arguments) }) }
    if (e["config-hook-unescape"]){ unescape = saf(function unescape(){ return e["config-hook-unescape"]?v_logs('[unescape]:', arguments, v_unescape.apply(this, arguments)):v_unescape.apply(this, arguments) }) }
    if (e["config-hook-atob"]){ atob = saf(function atob(){ return e["config-hook-atob"]?v_logs('[atob]:', arguments, v_atob.apply(this, arguments)):v_atob.apply(this, arguments) }) }
    if (e["config-hook-btoa"]){ btoa = saf(function btoa(){ return e["config-hook-btoa"]?v_logs('[btoa]:', arguments, v_btoa.apply(this, arguments)):v_btoa.apply(this, arguments) }) }
  }

  if (e["config-hook-domobj"]){
    $domobj_placeholder
  }
}


var getsets = [['Option', 'disabled'],['Option', 'form'],['Option', 'label'],['Option', 'defaultSelected'],['Option', 'selected'],['Option', 'value'],['Option', 'text'],['Option', 'index'],['Image', 'alt'],['Image', 'src'],['Image', 'srcset'],['Image', 'sizes'],['Image', 'crossOrigin'],['Image', 'useMap'],['Image', 'isMap'],['Image', 'width'],['Image', 'height'],['Image', 'naturalWidth'],['Image', 'naturalHeight'],['Image', 'complete'],['Image', 'currentSrc'],['Image', 'referrerPolicy'],['Image', 'decoding'],['Image', 'name'],['Image', 'lowsrc'],['Image', 'align'],['Image', 'hspace'],['Image', 'vspace'],['Image', 'longDesc'],['Image', 'border'],['Image', 'x'],['Image', 'y'],['Image', 'loading'],['webkitURL', 'origin'],['webkitURL', 'protocol'],['webkitURL', 'username'],['webkitURL', 'password'],['webkitURL', 'host'],['webkitURL', 'hostname'],['webkitURL', 'port'],['webkitURL', 'pathname'],['webkitURL', 'search'],['webkitURL', 'searchParams'],['webkitURL', 'hash'],['webkitURL', 'href'],['webkitRTCPeerConnection', 'localDescription'],['webkitRTCPeerConnection', 'currentLocalDescription'],['webkitRTCPeerConnection', 'pendingLocalDescription'],['webkitRTCPeerConnection', 'remoteDescription'],['webkitRTCPeerConnection', 'currentRemoteDescription'],['webkitRTCPeerConnection', 'pendingRemoteDescription'],['webkitRTCPeerConnection', 'signalingState'],['webkitRTCPeerConnection', 'iceGatheringState'],['webkitRTCPeerConnection', 'iceConnectionState'],['webkitRTCPeerConnection', 'connectionState'],['webkitRTCPeerConnection', 'canTrickleIceCandidates'],['webkitRTCPeerConnection', 'onnegotiationneeded'],['webkitRTCPeerConnection', 'onicecandidate'],['webkitRTCPeerConnection', 'onsignalingstatechange'],['webkitRTCPeerConnection', 'oniceconnectionstatechange'],['webkitRTCPeerConnection', 'onconnectionstatechange'],['webkitRTCPeerConnection', 'onicegatheringstatechange'],['webkitRTCPeerConnection', 'onicecandidateerror'],['webkitRTCPeerConnection', 'ontrack'],['webkitRTCPeerConnection', 'sctp'],['webkitRTCPeerConnection', 'ondatachannel'],['webkitRTCPeerConnection', 'onaddstream'],['webkitRTCPeerConnection', 'onremovestream'],['webkitMediaStream', 'id'],['webkitMediaStream', 'active'],['webkitMediaStream', 'onaddtrack'],['webkitMediaStream', 'onremovetrack'],['webkitMediaStream', 'onactive'],['webkitMediaStream', 'oninactive'],['XPathResult', 'resultType'],['XPathResult', 'numberValue'],['XPathResult', 'stringValue'],['XPathResult', 'booleanValue'],['XPathResult', 'singleNodeValue'],['XPathResult', 'invalidIteratorState'],['XPathResult', 'snapshotLength'],['XMLHttpRequestEventTarget', 'onloadstart'],['XMLHttpRequestEventTarget', 'onprogress'],['XMLHttpRequestEventTarget', 'onabort'],['XMLHttpRequestEventTarget', 'onerror'],['XMLHttpRequestEventTarget', 'onload'],['XMLHttpRequestEventTarget', 'ontimeout'],['XMLHttpRequestEventTarget', 'onloadend'],['XMLHttpRequest', 'onreadystatechange'],['XMLHttpRequest', 'readyState'],['XMLHttpRequest', 'timeout'],['XMLHttpRequest', 'withCredentials'],['XMLHttpRequest', 'upload'],['XMLHttpRequest', 'responseURL'],['XMLHttpRequest', 'status'],['XMLHttpRequest', 'statusText'],['XMLHttpRequest', 'responseType'],['XMLHttpRequest', 'response'],['XMLHttpRequest', 'responseText'],['XMLHttpRequest', 'responseXML'],['WritableStreamDefaultWriter', 'closed'],['WritableStreamDefaultWriter', 'desiredSize'],['WritableStreamDefaultWriter', 'ready'],['WritableStream', 'locked'],['Worker', 'onmessage'],['Worker', 'onerror'],['WheelEvent', 'deltaX'],['WheelEvent', 'deltaY'],['WheelEvent', 'deltaZ'],['WheelEvent', 'deltaMode'],['WheelEvent', 'wheelDeltaX'],['WheelEvent', 'wheelDeltaY'],['WheelEvent', 'wheelDelta'],['WebSocket', 'url'],['WebSocket', 'readyState'],['WebSocket', 'bufferedAmount'],['WebSocket', 'onopen'],['WebSocket', 'onerror'],['WebSocket', 'onclose'],['WebSocket', 'extensions'],['WebSocket', 'protocol'],['WebSocket', 'onmessage'],['WebSocket', 'binaryType'],['WebGLShaderPrecisionFormat', 'rangeMin'],['WebGLShaderPrecisionFormat', 'rangeMax'],['WebGLShaderPrecisionFormat', 'precision'],['WebGLRenderingContext', 'canvas'],['WebGLRenderingContext', 'drawingBufferWidth'],['WebGLRenderingContext', 'drawingBufferHeight'],['WebGLContextEvent', 'statusMessage'],['WebGLActiveInfo', 'size'],['WebGLActiveInfo', 'type'],['WebGLActiveInfo', 'name'],['WebGL2RenderingContext', 'canvas'],['WebGL2RenderingContext', 'drawingBufferWidth'],['WebGL2RenderingContext', 'drawingBufferHeight'],['WaveShaperNode', 'curve'],['WaveShaperNode', 'oversample'],['VisualViewport', 'offsetLeft'],['VisualViewport', 'offsetTop'],['VisualViewport', 'pageLeft'],['VisualViewport', 'pageTop'],['VisualViewport', 'width'],['VisualViewport', 'height'],['VisualViewport', 'scale'],['VisualViewport', 'onresize'],['VisualViewport', 'onscroll'],['ValidityState', 'valueMissing'],['ValidityState', 'typeMismatch'],['ValidityState', 'patternMismatch'],['ValidityState', 'tooLong'],['ValidityState', 'tooShort'],['ValidityState', 'rangeUnderflow'],['ValidityState', 'rangeOverflow'],['ValidityState', 'stepMismatch'],['ValidityState', 'badInput'],['ValidityState', 'customError'],['ValidityState', 'valid'],['VTTCue', 'vertical'],['VTTCue', 'snapToLines'],['VTTCue', 'line'],['VTTCue', 'position'],['VTTCue', 'size'],['VTTCue', 'align'],['VTTCue', 'text'],['UserActivation', 'hasBeenActive'],['UserActivation', 'isActive'],['URL', 'origin'],['URL', 'protocol'],['URL', 'username'],['URL', 'password'],['URL', 'host'],['URL', 'hostname'],['URL', 'port'],['URL', 'pathname'],['URL', 'search'],['URL', 'searchParams'],['URL', 'hash'],['URL', 'href'],['UIEvent', 'view'],['UIEvent', 'detail'],['UIEvent', 'sourceCapabilities'],['UIEvent', 'which'],['TreeWalker', 'root'],['TreeWalker', 'whatToShow'],['TreeWalker', 'filter'],['TreeWalker', 'currentNode'],['TransitionEvent', 'propertyName'],['TransitionEvent', 'elapsedTime'],['TransitionEvent', 'pseudoElement'],['TransformStream', 'readable'],['TransformStream', 'writable'],['TrackEvent', 'track'],['TouchList', 'length'],['TouchEvent', 'touches'],['TouchEvent', 'targetTouches'],['TouchEvent', 'changedTouches'],['TouchEvent', 'altKey'],['TouchEvent', 'metaKey'],['TouchEvent', 'ctrlKey'],['TouchEvent', 'shiftKey'],['Touch', 'identifier'],['Touch', 'target'],['Touch', 'screenX'],['Touch', 'screenY'],['Touch', 'clientX'],['Touch', 'clientY'],['Touch', 'pageX'],['Touch', 'pageY'],['Touch', 'radiusX'],['Touch', 'radiusY'],['Touch', 'rotationAngle'],['Touch', 'force'],['TimeRanges', 'length'],['TextTrackList', 'length'],['TextTrackList', 'onchange'],['TextTrackList', 'onaddtrack'],['TextTrackList', 'onremovetrack'],['TextTrackCueList', 'length'],['TextTrackCue', 'track'],['TextTrackCue', 'id'],['TextTrackCue', 'startTime'],['TextTrackCue', 'endTime'],['TextTrackCue', 'pauseOnExit'],['TextTrackCue', 'onenter'],['TextTrackCue', 'onexit'],['TextTrack', 'kind'],['TextTrack', 'label'],['TextTrack', 'language'],['TextTrack', 'id'],['TextTrack', 'mode'],['TextTrack', 'cues'],['TextTrack', 'activeCues'],['TextTrack', 'oncuechange'],['TextMetrics', 'width'],['TextMetrics', 'actualBoundingBoxLeft'],['TextMetrics', 'actualBoundingBoxRight'],['TextMetrics', 'fontBoundingBoxAscent'],['TextMetrics', 'fontBoundingBoxDescent'],['TextMetrics', 'actualBoundingBoxAscent'],['TextMetrics', 'actualBoundingBoxDescent'],['TextEvent', 'data'],['TextEncoderStream', 'encoding'],['TextEncoderStream', 'readable'],['TextEncoderStream', 'writable'],['TextEncoder', 'encoding'],['TextDecoderStream', 'encoding'],['TextDecoderStream', 'fatal'],['TextDecoderStream', 'ignoreBOM'],['TextDecoderStream', 'readable'],['TextDecoderStream', 'writable'],['TextDecoder', 'encoding'],['TextDecoder', 'fatal'],['TextDecoder', 'ignoreBOM'],['Text', 'wholeText'],['Text', 'assignedSlot'],['TaskAttributionTiming', 'containerType'],['TaskAttributionTiming', 'containerSrc'],['TaskAttributionTiming', 'containerId'],['TaskAttributionTiming', 'containerName'],['SubmitEvent', 'submitter'],['StyleSheetList', 'length'],['StyleSheet', 'type'],['StyleSheet', 'href'],['StyleSheet', 'ownerNode'],['StyleSheet', 'parentStyleSheet'],['StyleSheet', 'title'],['StyleSheet', 'media'],['StyleSheet', 'disabled'],['StylePropertyMapReadOnly', 'size'],['StorageEvent', 'key'],['StorageEvent', 'oldValue'],['StorageEvent', 'newValue'],['StorageEvent', 'url'],['StorageEvent', 'storageArea'],['Storage', 'length'],['StereoPannerNode', 'pan'],['ShadowRoot', 'mode'],['ShadowRoot', 'host'],['ShadowRoot', 'innerHTML'],['ShadowRoot', 'delegatesFocus'],['ShadowRoot', 'slotAssignment'],['ShadowRoot', 'activeElement'],['ShadowRoot', 'styleSheets'],['ShadowRoot', 'pointerLockElement'],['ShadowRoot', 'fullscreenElement'],['ShadowRoot', 'adoptedStyleSheets'],['ShadowRoot', 'pictureInPictureElement'],['Selection', 'anchorNode'],['Selection', 'anchorOffset'],['Selection', 'focusNode'],['Selection', 'focusOffset'],['Selection', 'isCollapsed'],['Selection', 'rangeCount'],['Selection', 'type'],['Selection', 'baseNode'],['Selection', 'baseOffset'],['Selection', 'extentNode'],['Selection', 'extentOffset'],['SecurityPolicyViolationEvent', 'documentURI'],['SecurityPolicyViolationEvent', 'referrer'],['SecurityPolicyViolationEvent', 'blockedURI'],['SecurityPolicyViolationEvent', 'violatedDirective'],['SecurityPolicyViolationEvent', 'effectiveDirective'],['SecurityPolicyViolationEvent', 'originalPolicy'],['SecurityPolicyViolationEvent', 'disposition'],['SecurityPolicyViolationEvent', 'sourceFile'],['SecurityPolicyViolationEvent', 'statusCode'],['SecurityPolicyViolationEvent', 'lineNumber'],['SecurityPolicyViolationEvent', 'columnNumber'],['SecurityPolicyViolationEvent', 'sample'],['ScriptProcessorNode', 'onaudioprocess'],['ScriptProcessorNode', 'bufferSize'],['ScreenOrientation', 'angle'],['ScreenOrientation', 'type'],['ScreenOrientation', 'onchange'],['Screen', 'availWidth'],['Screen', 'availHeight'],['Screen', 'width'],['Screen', 'height'],['Screen', 'colorDepth'],['Screen', 'pixelDepth'],['Screen', 'availLeft'],['Screen', 'availTop'],['Screen', 'orientation'],['SVGViewElement', 'viewBox'],['SVGViewElement', 'preserveAspectRatio'],['SVGViewElement', 'zoomAndPan'],['SVGUseElement', 'x'],['SVGUseElement', 'y'],['SVGUseElement', 'width'],['SVGUseElement', 'height'],['SVGUseElement', 'href'],['SVGTransformList', 'length'],['SVGTransformList', 'numberOfItems'],['SVGTransform', 'type'],['SVGTransform', 'matrix'],['SVGTransform', 'angle'],['SVGTextPositioningElement', 'x'],['SVGTextPositioningElement', 'y'],['SVGTextPositioningElement', 'dx'],['SVGTextPositioningElement', 'dy'],['SVGTextPositioningElement', 'rotate'],['SVGTextPathElement', 'startOffset'],['SVGTextPathElement', 'method'],['SVGTextPathElement', 'spacing'],['SVGTextPathElement', 'href'],['SVGTextContentElement', 'textLength'],['SVGTextContentElement', 'lengthAdjust'],['SVGSymbolElement', 'viewBox'],['SVGSymbolElement', 'preserveAspectRatio'],['SVGStyleElement', 'type'],['SVGStyleElement', 'media'],['SVGStyleElement', 'title'],['SVGStyleElement', 'sheet'],['SVGStyleElement', 'disabled'],['SVGStringList', 'length'],['SVGStringList', 'numberOfItems'],['SVGStopElement', 'offset'],['SVGScriptElement', 'type'],['SVGScriptElement', 'href'],['SVGSVGElement', 'x'],['SVGSVGElement', 'y'],['SVGSVGElement', 'width'],['SVGSVGElement', 'height'],['SVGSVGElement', 'currentScale'],['SVGSVGElement', 'currentTranslate'],['SVGSVGElement', 'viewBox'],['SVGSVGElement', 'preserveAspectRatio'],['SVGSVGElement', 'zoomAndPan'],['SVGRectElement', 'x'],['SVGRectElement', 'y'],['SVGRectElement', 'width'],['SVGRectElement', 'height'],['SVGRectElement', 'rx'],['SVGRectElement', 'ry'],['SVGRect', 'x'],['SVGRect', 'y'],['SVGRect', 'width'],['SVGRect', 'height'],['SVGRadialGradientElement', 'cx'],['SVGRadialGradientElement', 'cy'],['SVGRadialGradientElement', 'r'],['SVGRadialGradientElement', 'fx'],['SVGRadialGradientElement', 'fy'],['SVGRadialGradientElement', 'fr'],['SVGPreserveAspectRatio', 'align'],['SVGPreserveAspectRatio', 'meetOrSlice'],['SVGPolylineElement', 'points'],['SVGPolylineElement', 'animatedPoints'],['SVGPolygonElement', 'points'],['SVGPolygonElement', 'animatedPoints'],['SVGPointList', 'length'],['SVGPointList', 'numberOfItems'],['SVGPoint', 'x'],['SVGPoint', 'y'],['SVGPatternElement', 'patternUnits'],['SVGPatternElement', 'patternContentUnits'],['SVGPatternElement', 'patternTransform'],['SVGPatternElement', 'x'],['SVGPatternElement', 'y'],['SVGPatternElement', 'width'],['SVGPatternElement', 'height'],['SVGPatternElement', 'viewBox'],['SVGPatternElement', 'preserveAspectRatio'],['SVGPatternElement', 'href'],['SVGPatternElement', 'requiredExtensions'],['SVGPatternElement', 'systemLanguage'],['SVGNumberList', 'length'],['SVGNumberList', 'numberOfItems'],['SVGNumber', 'value'],['SVGMatrix', 'a'],['SVGMatrix', 'b'],['SVGMatrix', 'c'],['SVGMatrix', 'd'],['SVGMatrix', 'e'],['SVGMatrix', 'f'],['SVGMaskElement', 'maskUnits'],['SVGMaskElement', 'maskContentUnits'],['SVGMaskElement', 'x'],['SVGMaskElement', 'y'],['SVGMaskElement', 'width'],['SVGMaskElement', 'height'],['SVGMaskElement', 'requiredExtensions'],['SVGMaskElement', 'systemLanguage'],['SVGMarkerElement', 'refX'],['SVGMarkerElement', 'refY'],['SVGMarkerElement', 'markerUnits'],['SVGMarkerElement', 'markerWidth'],['SVGMarkerElement', 'markerHeight'],['SVGMarkerElement', 'orientType'],['SVGMarkerElement', 'orientAngle'],['SVGMarkerElement', 'viewBox'],['SVGMarkerElement', 'preserveAspectRatio'],['SVGMPathElement', 'href'],['SVGLinearGradientElement', 'x1'],['SVGLinearGradientElement', 'y1'],['SVGLinearGradientElement', 'x2'],['SVGLinearGradientElement', 'y2'],['SVGLineElement', 'x1'],['SVGLineElement', 'y1'],['SVGLineElement', 'x2'],['SVGLineElement', 'y2'],['SVGLengthList', 'length'],['SVGLengthList', 'numberOfItems'],['SVGLength', 'unitType'],['SVGLength', 'value'],['SVGLength', 'valueInSpecifiedUnits'],['SVGLength', 'valueAsString'],['SVGImageElement', 'x'],['SVGImageElement', 'y'],['SVGImageElement', 'width'],['SVGImageElement', 'height'],['SVGImageElement', 'preserveAspectRatio'],['SVGImageElement', 'decoding'],['SVGImageElement', 'href'],['SVGGraphicsElement', 'transform'],['SVGGraphicsElement', 'nearestViewportElement'],['SVGGraphicsElement', 'farthestViewportElement'],['SVGGraphicsElement', 'requiredExtensions'],['SVGGraphicsElement', 'systemLanguage'],['SVGGradientElement', 'gradientUnits'],['SVGGradientElement', 'gradientTransform'],['SVGGradientElement', 'spreadMethod'],['SVGGradientElement', 'href'],['SVGGeometryElement', 'pathLength'],['SVGForeignObjectElement', 'x'],['SVGForeignObjectElement', 'y'],['SVGForeignObjectElement', 'width'],['SVGForeignObjectElement', 'height'],['SVGFilterElement', 'filterUnits'],['SVGFilterElement', 'primitiveUnits'],['SVGFilterElement', 'x'],['SVGFilterElement', 'y'],['SVGFilterElement', 'width'],['SVGFilterElement', 'height'],['SVGFilterElement', 'href'],['SVGFETurbulenceElement', 'baseFrequencyX'],['SVGFETurbulenceElement', 'baseFrequencyY'],['SVGFETurbulenceElement', 'numOctaves'],['SVGFETurbulenceElement', 'seed'],['SVGFETurbulenceElement', 'stitchTiles'],['SVGFETurbulenceElement', 'type'],['SVGFETurbulenceElement', 'x'],['SVGFETurbulenceElement', 'y'],['SVGFETurbulenceElement', 'width'],['SVGFETurbulenceElement', 'height'],['SVGFETurbulenceElement', 'result'],['SVGFETileElement', 'in1'],['SVGFETileElement', 'x'],['SVGFETileElement', 'y'],['SVGFETileElement', 'width'],['SVGFETileElement', 'height'],['SVGFETileElement', 'result'],['SVGFESpotLightElement', 'x'],['SVGFESpotLightElement', 'y'],['SVGFESpotLightElement', 'z'],['SVGFESpotLightElement', 'pointsAtX'],['SVGFESpotLightElement', 'pointsAtY'],['SVGFESpotLightElement', 'pointsAtZ'],['SVGFESpotLightElement', 'specularExponent'],['SVGFESpotLightElement', 'limitingConeAngle'],['SVGFESpecularLightingElement', 'in1'],['SVGFESpecularLightingElement', 'surfaceScale'],['SVGFESpecularLightingElement', 'specularConstant'],['SVGFESpecularLightingElement', 'specularExponent'],['SVGFESpecularLightingElement', 'kernelUnitLengthX'],['SVGFESpecularLightingElement', 'kernelUnitLengthY'],['SVGFESpecularLightingElement', 'x'],['SVGFESpecularLightingElement', 'y'],['SVGFESpecularLightingElement', 'width'],['SVGFESpecularLightingElement', 'height'],['SVGFESpecularLightingElement', 'result'],['SVGFEPointLightElement', 'x'],['SVGFEPointLightElement', 'y'],['SVGFEPointLightElement', 'z'],['SVGFEOffsetElement', 'in1'],['SVGFEOffsetElement', 'dx'],['SVGFEOffsetElement', 'dy'],['SVGFEOffsetElement', 'x'],['SVGFEOffsetElement', 'y'],['SVGFEOffsetElement', 'width'],['SVGFEOffsetElement', 'height'],['SVGFEOffsetElement', 'result'],['SVGFEMorphologyElement', 'in1'],['SVGFEMorphologyElement', 'operator'],['SVGFEMorphologyElement', 'radiusX'],['SVGFEMorphologyElement', 'radiusY'],['SVGFEMorphologyElement', 'x'],['SVGFEMorphologyElement', 'y'],['SVGFEMorphologyElement', 'width'],['SVGFEMorphologyElement', 'height'],['SVGFEMorphologyElement', 'result'],['SVGFEMergeNodeElement', 'in1'],['SVGFEMergeElement', 'x'],['SVGFEMergeElement', 'y'],['SVGFEMergeElement', 'width'],['SVGFEMergeElement', 'height'],['SVGFEMergeElement', 'result'],['SVGFEImageElement', 'preserveAspectRatio'],['SVGFEImageElement', 'x'],['SVGFEImageElement', 'y'],['SVGFEImageElement', 'width'],['SVGFEImageElement', 'height'],['SVGFEImageElement', 'result'],['SVGFEImageElement', 'href'],['SVGFEGaussianBlurElement', 'in1'],['SVGFEGaussianBlurElement', 'stdDeviationX'],['SVGFEGaussianBlurElement', 'stdDeviationY'],['SVGFEGaussianBlurElement', 'x'],['SVGFEGaussianBlurElement', 'y'],['SVGFEGaussianBlurElement', 'width'],['SVGFEGaussianBlurElement', 'height'],['SVGFEGaussianBlurElement', 'result'],['SVGFEFloodElement', 'x'],['SVGFEFloodElement', 'y'],['SVGFEFloodElement', 'width'],['SVGFEFloodElement', 'height'],['SVGFEFloodElement', 'result'],['SVGFEDropShadowElement', 'in1'],['SVGFEDropShadowElement', 'dx'],['SVGFEDropShadowElement', 'dy'],['SVGFEDropShadowElement', 'stdDeviationX'],['SVGFEDropShadowElement', 'stdDeviationY'],['SVGFEDropShadowElement', 'x'],['SVGFEDropShadowElement', 'y'],['SVGFEDropShadowElement', 'width'],['SVGFEDropShadowElement', 'height'],['SVGFEDropShadowElement', 'result'],['SVGFEDistantLightElement', 'azimuth'],['SVGFEDistantLightElement', 'elevation'],['SVGFEDisplacementMapElement', 'in1'],['SVGFEDisplacementMapElement', 'in2'],['SVGFEDisplacementMapElement', 'scale'],['SVGFEDisplacementMapElement', 'xChannelSelector'],['SVGFEDisplacementMapElement', 'yChannelSelector'],['SVGFEDisplacementMapElement', 'x'],['SVGFEDisplacementMapElement', 'y'],['SVGFEDisplacementMapElement', 'width'],['SVGFEDisplacementMapElement', 'height'],['SVGFEDisplacementMapElement', 'result'],['SVGFEDiffuseLightingElement', 'in1'],['SVGFEDiffuseLightingElement', 'surfaceScale'],['SVGFEDiffuseLightingElement', 'diffuseConstant'],['SVGFEDiffuseLightingElement', 'kernelUnitLengthX'],['SVGFEDiffuseLightingElement', 'kernelUnitLengthY'],['SVGFEDiffuseLightingElement', 'x'],['SVGFEDiffuseLightingElement', 'y'],['SVGFEDiffuseLightingElement', 'width'],['SVGFEDiffuseLightingElement', 'height'],['SVGFEDiffuseLightingElement', 'result'],['SVGFEConvolveMatrixElement', 'in1'],['SVGFEConvolveMatrixElement', 'orderX'],['SVGFEConvolveMatrixElement', 'orderY'],['SVGFEConvolveMatrixElement', 'kernelMatrix'],['SVGFEConvolveMatrixElement', 'divisor'],['SVGFEConvolveMatrixElement', 'bias'],['SVGFEConvolveMatrixElement', 'targetX'],['SVGFEConvolveMatrixElement', 'targetY'],['SVGFEConvolveMatrixElement', 'edgeMode'],['SVGFEConvolveMatrixElement', 'kernelUnitLengthX'],['SVGFEConvolveMatrixElement', 'kernelUnitLengthY'],['SVGFEConvolveMatrixElement', 'preserveAlpha'],['SVGFEConvolveMatrixElement', 'x'],['SVGFEConvolveMatrixElement', 'y'],['SVGFEConvolveMatrixElement', 'width'],['SVGFEConvolveMatrixElement', 'height'],['SVGFEConvolveMatrixElement', 'result'],['SVGFECompositeElement', 'in2'],['SVGFECompositeElement', 'in1'],['SVGFECompositeElement', 'operator'],['SVGFECompositeElement', 'k1'],['SVGFECompositeElement', 'k2'],['SVGFECompositeElement', 'k3'],['SVGFECompositeElement', 'k4'],['SVGFECompositeElement', 'x'],['SVGFECompositeElement', 'y'],['SVGFECompositeElement', 'width'],['SVGFECompositeElement', 'height'],['SVGFECompositeElement', 'result'],['SVGFEComponentTransferElement', 'in1'],['SVGFEComponentTransferElement', 'x'],['SVGFEComponentTransferElement', 'y'],['SVGFEComponentTransferElement', 'width'],['SVGFEComponentTransferElement', 'height'],['SVGFEComponentTransferElement', 'result'],['SVGFEColorMatrixElement', 'in1'],['SVGFEColorMatrixElement', 'type'],['SVGFEColorMatrixElement', 'values'],['SVGFEColorMatrixElement', 'x'],['SVGFEColorMatrixElement', 'y'],['SVGFEColorMatrixElement', 'width'],['SVGFEColorMatrixElement', 'height'],['SVGFEColorMatrixElement', 'result'],['SVGFEBlendElement', 'in1'],['SVGFEBlendElement', 'in2'],['SVGFEBlendElement', 'mode'],['SVGFEBlendElement', 'x'],['SVGFEBlendElement', 'y'],['SVGFEBlendElement', 'width'],['SVGFEBlendElement', 'height'],['SVGFEBlendElement', 'result'],['SVGEllipseElement', 'cx'],['SVGEllipseElement', 'cy'],['SVGEllipseElement', 'rx'],['SVGEllipseElement', 'ry'],['SVGElement', 'className'],['SVGElement', 'style'],['SVGElement', 'ownerSVGElement'],['SVGElement', 'viewportElement'],['SVGElement', 'onbeforexrselect'],['SVGElement', 'onabort'],['SVGElement', 'onblur'],['SVGElement', 'oncancel'],['SVGElement', 'oncanplay'],['SVGElement', 'oncanplaythrough'],['SVGElement', 'onchange'],['SVGElement', 'onclick'],['SVGElement', 'onclose'],['SVGElement', 'oncontextmenu'],['SVGElement', 'oncuechange'],['SVGElement', 'ondblclick'],['SVGElement', 'ondrag'],['SVGElement', 'ondragend'],['SVGElement', 'ondragenter'],['SVGElement', 'ondragleave'],['SVGElement', 'ondragover'],['SVGElement', 'ondragstart'],['SVGElement', 'ondrop'],['SVGElement', 'ondurationchange'],['SVGElement', 'onemptied'],['SVGElement', 'onended'],['SVGElement', 'onerror'],['SVGElement', 'onfocus'],['SVGElement', 'onformdata'],['SVGElement', 'oninput'],['SVGElement', 'oninvalid'],['SVGElement', 'onkeydown'],['SVGElement', 'onkeypress'],['SVGElement', 'onkeyup'],['SVGElement', 'onload'],['SVGElement', 'onloadeddata'],['SVGElement', 'onloadedmetadata'],['SVGElement', 'onloadstart'],['SVGElement', 'onmousedown'],['SVGElement', 'onmouseenter'],['SVGElement', 'onmouseleave'],['SVGElement', 'onmousemove'],['SVGElement', 'onmouseout'],['SVGElement', 'onmouseover'],['SVGElement', 'onmouseup'],['SVGElement', 'onmousewheel'],['SVGElement', 'onpause'],['SVGElement', 'onplay'],['SVGElement', 'onplaying'],['SVGElement', 'onprogress'],['SVGElement', 'onratechange'],['SVGElement', 'onreset'],['SVGElement', 'onresize'],['SVGElement', 'onscroll'],['SVGElement', 'onseeked'],['SVGElement', 'onseeking'],['SVGElement', 'onselect'],['SVGElement', 'onstalled'],['SVGElement', 'onsubmit'],['SVGElement', 'onsuspend'],['SVGElement', 'ontimeupdate'],['SVGElement', 'ontoggle'],['SVGElement', 'onvolumechange'],['SVGElement', 'onwaiting'],['SVGElement', 'onwebkitanimationend'],['SVGElement', 'onwebkitanimationiteration'],['SVGElement', 'onwebkitanimationstart'],['SVGElement', 'onwebkittransitionend'],['SVGElement', 'onwheel'],['SVGElement', 'onauxclick'],['SVGElement', 'ongotpointercapture'],['SVGElement', 'onlostpointercapture'],['SVGElement', 'onpointerdown'],['SVGElement', 'onpointermove'],['SVGElement', 'onpointerup'],['SVGElement', 'onpointercancel'],['SVGElement', 'onpointerover'],['SVGElement', 'onpointerout'],['SVGElement', 'onpointerenter'],['SVGElement', 'onpointerleave'],['SVGElement', 'onselectstart'],['SVGElement', 'onselectionchange'],['SVGElement', 'onanimationend'],['SVGElement', 'onanimationiteration'],['SVGElement', 'onanimationstart'],['SVGElement', 'ontransitionrun'],['SVGElement', 'ontransitionstart'],['SVGElement', 'ontransitionend'],['SVGElement', 'ontransitioncancel'],['SVGElement', 'oncopy'],['SVGElement', 'oncut'],['SVGElement', 'onpaste'],['SVGElement', 'dataset'],['SVGElement', 'nonce'],['SVGElement', 'autofocus'],['SVGElement', 'tabIndex'],['SVGElement', 'onpointerrawupdate'],['SVGComponentTransferFunctionElement', 'type'],['SVGComponentTransferFunctionElement', 'tableValues'],['SVGComponentTransferFunctionElement', 'slope'],['SVGComponentTransferFunctionElement', 'intercept'],['SVGComponentTransferFunctionElement', 'amplitude'],['SVGComponentTransferFunctionElement', 'exponent'],['SVGComponentTransferFunctionElement', 'offset'],['SVGClipPathElement', 'clipPathUnits'],['SVGCircleElement', 'cx'],['SVGCircleElement', 'cy'],['SVGCircleElement', 'r'],['SVGAnimationElement', 'targetElement'],['SVGAnimationElement', 'onbegin'],['SVGAnimationElement', 'onend'],['SVGAnimationElement', 'onrepeat'],['SVGAnimationElement', 'requiredExtensions'],['SVGAnimationElement', 'systemLanguage'],['SVGAnimatedTransformList', 'baseVal'],['SVGAnimatedTransformList', 'animVal'],['SVGAnimatedString', 'baseVal'],['SVGAnimatedString', 'animVal'],['SVGAnimatedRect', 'baseVal'],['SVGAnimatedRect', 'animVal'],['SVGAnimatedPreserveAspectRatio', 'baseVal'],['SVGAnimatedPreserveAspectRatio', 'animVal'],['SVGAnimatedNumberList', 'baseVal'],['SVGAnimatedNumberList', 'animVal'],['SVGAnimatedNumber', 'baseVal'],['SVGAnimatedNumber', 'animVal'],['SVGAnimatedLengthList', 'baseVal'],['SVGAnimatedLengthList', 'animVal'],['SVGAnimatedLength', 'baseVal'],['SVGAnimatedLength', 'animVal'],['SVGAnimatedInteger', 'baseVal'],['SVGAnimatedInteger', 'animVal'],['SVGAnimatedEnumeration', 'baseVal'],['SVGAnimatedEnumeration', 'animVal'],['SVGAnimatedBoolean', 'baseVal'],['SVGAnimatedBoolean', 'animVal'],['SVGAnimatedAngle', 'baseVal'],['SVGAnimatedAngle', 'animVal'],['SVGAngle', 'unitType'],['SVGAngle', 'value'],['SVGAngle', 'valueInSpecifiedUnits'],['SVGAngle', 'valueAsString'],['SVGAElement', 'target'],['SVGAElement', 'href'],['Response', 'type'],['Response', 'url'],['Response', 'redirected'],['Response', 'status'],['Response', 'ok'],['Response', 'statusText'],['Response', 'headers'],['Response', 'body'],['Response', 'bodyUsed'],['ResizeObserverSize', 'inlineSize'],['ResizeObserverSize', 'blockSize'],['ResizeObserverEntry', 'target'],['ResizeObserverEntry', 'contentRect'],['ResizeObserverEntry', 'contentBoxSize'],['ResizeObserverEntry', 'borderBoxSize'],['ResizeObserverEntry', 'devicePixelContentBoxSize'],['Request', 'method'],['Request', 'url'],['Request', 'headers'],['Request', 'destination'],['Request', 'referrer'],['Request', 'referrerPolicy'],['Request', 'mode'],['Request', 'credentials'],['Request', 'cache'],['Request', 'redirect'],['Request', 'integrity'],['Request', 'keepalive'],['Request', 'signal'],['Request', 'isHistoryNavigation'],['Request', 'bodyUsed'],['ReadableStreamDefaultReader', 'closed'],['ReadableStreamDefaultController', 'desiredSize'],['ReadableStreamBYOBRequest', 'view'],['ReadableStreamBYOBReader', 'closed'],['ReadableStream', 'locked'],['ReadableByteStreamController', 'byobRequest'],['ReadableByteStreamController', 'desiredSize'],['Range', 'commonAncestorContainer'],['RadioNodeList', 'value'],['RTCTrackEvent', 'receiver'],['RTCTrackEvent', 'track'],['RTCTrackEvent', 'streams'],['RTCTrackEvent', 'transceiver'],['RTCStatsReport', 'size'],['RTCSessionDescription', 'type'],['RTCSessionDescription', 'sdp'],['RTCSctpTransport', 'transport'],['RTCSctpTransport', 'state'],['RTCSctpTransport', 'maxMessageSize'],['RTCSctpTransport', 'maxChannels'],['RTCSctpTransport', 'onstatechange'],['RTCRtpTransceiver', 'mid'],['RTCRtpTransceiver', 'sender'],['RTCRtpTransceiver', 'receiver'],['RTCRtpTransceiver', 'stopped'],['RTCRtpTransceiver', 'direction'],['RTCRtpTransceiver', 'currentDirection'],['RTCRtpSender', 'track'],['RTCRtpSender', 'transport'],['RTCRtpSender', 'rtcpTransport'],['RTCRtpSender', 'dtmf'],['RTCRtpReceiver', 'track'],['RTCRtpReceiver', 'transport'],['RTCRtpReceiver', 'rtcpTransport'],['RTCRtpReceiver', 'playoutDelayHint'],['RTCPeerConnectionIceEvent', 'candidate'],['RTCPeerConnectionIceErrorEvent', 'address'],['RTCPeerConnectionIceErrorEvent', 'port'],['RTCPeerConnectionIceErrorEvent', 'hostCandidate'],['RTCPeerConnectionIceErrorEvent', 'url'],['RTCPeerConnectionIceErrorEvent', 'errorCode'],['RTCPeerConnectionIceErrorEvent', 'errorText'],['RTCPeerConnection', 'localDescription'],['RTCPeerConnection', 'currentLocalDescription'],['RTCPeerConnection', 'pendingLocalDescription'],['RTCPeerConnection', 'remoteDescription'],['RTCPeerConnection', 'currentRemoteDescription'],['RTCPeerConnection', 'pendingRemoteDescription'],['RTCPeerConnection', 'signalingState'],['RTCPeerConnection', 'iceGatheringState'],['RTCPeerConnection', 'iceConnectionState'],['RTCPeerConnection', 'connectionState'],['RTCPeerConnection', 'canTrickleIceCandidates'],['RTCPeerConnection', 'onnegotiationneeded'],['RTCPeerConnection', 'onicecandidate'],['RTCPeerConnection', 'onsignalingstatechange'],['RTCPeerConnection', 'oniceconnectionstatechange'],['RTCPeerConnection', 'onconnectionstatechange'],['RTCPeerConnection', 'onicegatheringstatechange'],['RTCPeerConnection', 'onicecandidateerror'],['RTCPeerConnection', 'ontrack'],['RTCPeerConnection', 'sctp'],['RTCPeerConnection', 'ondatachannel'],['RTCPeerConnection', 'onaddstream'],['RTCPeerConnection', 'onremovestream'],['RTCIceCandidate', 'candidate'],['RTCIceCandidate', 'sdpMid'],['RTCIceCandidate', 'sdpMLineIndex'],['RTCIceCandidate', 'foundation'],['RTCIceCandidate', 'component'],['RTCIceCandidate', 'priority'],['RTCIceCandidate', 'address'],['RTCIceCandidate', 'protocol'],['RTCIceCandidate', 'port'],['RTCIceCandidate', 'type'],['RTCIceCandidate', 'tcpType'],['RTCIceCandidate', 'relatedAddress'],['RTCIceCandidate', 'relatedPort'],['RTCIceCandidate', 'usernameFragment'],['RTCErrorEvent', 'error'],['RTCEncodedVideoFrame', 'type'],['RTCEncodedVideoFrame', 'timestamp'],['RTCEncodedVideoFrame', 'data'],['RTCEncodedAudioFrame', 'timestamp'],['RTCEncodedAudioFrame', 'data'],['RTCDtlsTransport', 'iceTransport'],['RTCDtlsTransport', 'state'],['RTCDtlsTransport', 'onstatechange'],['RTCDtlsTransport', 'onerror'],['RTCDataChannelEvent', 'channel'],['RTCDataChannel', 'label'],['RTCDataChannel', 'ordered'],['RTCDataChannel', 'maxPacketLifeTime'],['RTCDataChannel', 'maxRetransmits'],['RTCDataChannel', 'protocol'],['RTCDataChannel', 'negotiated'],['RTCDataChannel', 'id'],['RTCDataChannel', 'readyState'],['RTCDataChannel', 'bufferedAmount'],['RTCDataChannel', 'bufferedAmountLowThreshold'],['RTCDataChannel', 'onopen'],['RTCDataChannel', 'onbufferedamountlow'],['RTCDataChannel', 'onerror'],['RTCDataChannel', 'onclosing'],['RTCDataChannel', 'onclose'],['RTCDataChannel', 'onmessage'],['RTCDataChannel', 'binaryType'],['RTCDataChannel', 'reliable'],['RTCDTMFToneChangeEvent', 'tone'],['RTCDTMFSender', 'ontonechange'],['RTCDTMFSender', 'canInsertDTMF'],['RTCDTMFSender', 'toneBuffer'],['RTCCertificate', 'expires'],['PromiseRejectionEvent', 'promise'],['PromiseRejectionEvent', 'reason'],['ProgressEvent', 'lengthComputable'],['ProgressEvent', 'loaded'],['ProgressEvent', 'total'],['ProcessingInstruction', 'target'],['ProcessingInstruction', 'sheet'],['PopStateEvent', 'state'],['PointerEvent', 'pointerId'],['PointerEvent', 'width'],['PointerEvent', 'height'],['PointerEvent', 'pressure'],['PointerEvent', 'tiltX'],['PointerEvent', 'tiltY'],['PointerEvent', 'azimuthAngle'],['PointerEvent', 'altitudeAngle'],['PointerEvent', 'tangentialPressure'],['PointerEvent', 'twist'],['PointerEvent', 'pointerType'],['PointerEvent', 'isPrimary'],['PluginArray', 'length'],['Plugin', 'name'],['Plugin', 'filename'],['Plugin', 'description'],['Plugin', 'length'],['PerformanceTiming', 'navigationStart'],['PerformanceTiming', 'unloadEventStart'],['PerformanceTiming', 'unloadEventEnd'],['PerformanceTiming', 'redirectStart'],['PerformanceTiming', 'redirectEnd'],['PerformanceTiming', 'fetchStart'],['PerformanceTiming', 'domainLookupStart'],['PerformanceTiming', 'domainLookupEnd'],['PerformanceTiming', 'connectStart'],['PerformanceTiming', 'connectEnd'],['PerformanceTiming', 'secureConnectionStart'],['PerformanceTiming', 'requestStart'],['PerformanceTiming', 'responseStart'],['PerformanceTiming', 'responseEnd'],['PerformanceTiming', 'domLoading'],['PerformanceTiming', 'domInteractive'],['PerformanceTiming', 'domContentLoadedEventStart'],['PerformanceTiming', 'domContentLoadedEventEnd'],['PerformanceTiming', 'domComplete'],['PerformanceTiming', 'loadEventStart'],['PerformanceTiming', 'loadEventEnd'],['PerformanceServerTiming', 'name'],['PerformanceServerTiming', 'duration'],['PerformanceServerTiming', 'description'],['PerformanceResourceTiming', 'initiatorType'],['PerformanceResourceTiming', 'nextHopProtocol'],['PerformanceResourceTiming', 'workerStart'],['PerformanceResourceTiming', 'redirectStart'],['PerformanceResourceTiming', 'redirectEnd'],['PerformanceResourceTiming', 'fetchStart'],['PerformanceResourceTiming', 'domainLookupStart'],['PerformanceResourceTiming', 'domainLookupEnd'],['PerformanceResourceTiming', 'connectStart'],['PerformanceResourceTiming', 'connectEnd'],['PerformanceResourceTiming', 'secureConnectionStart'],['PerformanceResourceTiming', 'requestStart'],['PerformanceResourceTiming', 'responseStart'],['PerformanceResourceTiming', 'responseEnd'],['PerformanceResourceTiming', 'transferSize'],['PerformanceResourceTiming', 'encodedBodySize'],['PerformanceResourceTiming', 'decodedBodySize'],['PerformanceResourceTiming', 'serverTiming'],['PerformanceNavigationTiming', 'unloadEventStart'],['PerformanceNavigationTiming', 'unloadEventEnd'],['PerformanceNavigationTiming', 'domInteractive'],['PerformanceNavigationTiming', 'domContentLoadedEventStart'],['PerformanceNavigationTiming', 'domContentLoadedEventEnd'],['PerformanceNavigationTiming', 'domComplete'],['PerformanceNavigationTiming', 'loadEventStart'],['PerformanceNavigationTiming', 'loadEventEnd'],['PerformanceNavigationTiming', 'type'],['PerformanceNavigationTiming', 'redirectCount'],['PerformanceNavigation', 'type'],['PerformanceNavigation', 'redirectCount'],['PerformanceMeasure', 'detail'],['PerformanceMark', 'detail'],['PerformanceLongTaskTiming', 'attribution'],['PerformanceEventTiming', 'processingStart'],['PerformanceEventTiming', 'processingEnd'],['PerformanceEventTiming', 'cancelable'],['PerformanceEventTiming', 'target'],['PerformanceEntry', 'name'],['PerformanceEntry', 'entryType'],['PerformanceEntry', 'startTime'],['PerformanceEntry', 'duration'],['PerformanceElementTiming', 'renderTime'],['PerformanceElementTiming', 'loadTime'],['PerformanceElementTiming', 'intersectionRect'],['PerformanceElementTiming', 'identifier'],['PerformanceElementTiming', 'naturalWidth'],['PerformanceElementTiming', 'naturalHeight'],['PerformanceElementTiming', 'id'],['PerformanceElementTiming', 'element'],['PerformanceElementTiming', 'url'],['Performance', 'timeOrigin'],['Performance', 'onresourcetimingbufferfull'],['Performance', 'timing'],['Performance', 'navigation'],['Performance', 'memory'],['Performance', 'eventCounts'],['PannerNode', 'panningModel'],['PannerNode', 'positionX'],['PannerNode', 'positionY'],['PannerNode', 'positionZ'],['PannerNode', 'orientationX'],['PannerNode', 'orientationY'],['PannerNode', 'orientationZ'],['PannerNode', 'distanceModel'],['PannerNode', 'refDistance'],['PannerNode', 'maxDistance'],['PannerNode', 'rolloffFactor'],['PannerNode', 'coneInnerAngle'],['PannerNode', 'coneOuterAngle'],['PannerNode', 'coneOuterGain'],['PageTransitionEvent', 'persisted'],['OverconstrainedError', 'name'],['OverconstrainedError', 'message'],['OverconstrainedError', 'constraint'],['OscillatorNode', 'type'],['OscillatorNode', 'frequency'],['OscillatorNode', 'detune'],['OffscreenCanvasRenderingContext2D', 'canvas'],['OffscreenCanvasRenderingContext2D', 'globalAlpha'],['OffscreenCanvasRenderingContext2D', 'globalCompositeOperation'],['OffscreenCanvasRenderingContext2D', 'filter'],['OffscreenCanvasRenderingContext2D', 'imageSmoothingEnabled'],['OffscreenCanvasRenderingContext2D', 'imageSmoothingQuality'],['OffscreenCanvasRenderingContext2D', 'strokeStyle'],['OffscreenCanvasRenderingContext2D', 'fillStyle'],['OffscreenCanvasRenderingContext2D', 'shadowOffsetX'],['OffscreenCanvasRenderingContext2D', 'shadowOffsetY'],['OffscreenCanvasRenderingContext2D', 'shadowBlur'],['OffscreenCanvasRenderingContext2D', 'shadowColor'],['OffscreenCanvasRenderingContext2D', 'lineWidth'],['OffscreenCanvasRenderingContext2D', 'lineCap'],['OffscreenCanvasRenderingContext2D', 'lineJoin'],['OffscreenCanvasRenderingContext2D', 'miterLimit'],['OffscreenCanvasRenderingContext2D', 'lineDashOffset'],['OffscreenCanvasRenderingContext2D', 'font'],['OffscreenCanvasRenderingContext2D', 'textAlign'],['OffscreenCanvasRenderingContext2D', 'textBaseline'],['OffscreenCanvasRenderingContext2D', 'direction'],['OffscreenCanvas', 'width'],['OffscreenCanvas', 'height'],['OfflineAudioContext', 'oncomplete'],['OfflineAudioContext', 'length'],['OfflineAudioCompletionEvent', 'renderedBuffer'],['NodeList', 'length'],['NodeIterator', 'root'],['NodeIterator', 'referenceNode'],['NodeIterator', 'pointerBeforeReferenceNode'],['NodeIterator', 'whatToShow'],['NodeIterator', 'filter'],['Node', 'nodeType'],['Node', 'nodeName'],['Node', 'baseURI'],['Node', 'isConnected'],['Node', 'ownerDocument'],['Node', 'parentNode'],['Node', 'parentElement'],['Node', 'childNodes'],['Node', 'firstChild'],['Node', 'lastChild'],['Node', 'previousSibling'],['Node', 'nextSibling'],['Node', 'nodeValue'],['Node', 'textContent'],['NetworkInformation', 'onchange'],['NetworkInformation', 'effectiveType'],['NetworkInformation', 'rtt'],['NetworkInformation', 'downlink'],['NetworkInformation', 'saveData'],['Navigator', 'vendorSub'],['Navigator', 'productSub'],['Navigator', 'vendor'],['Navigator', 'maxTouchPoints'],['Navigator', 'userActivation'],['Navigator', 'doNotTrack'],['Navigator', 'geolocation'],['Navigator', 'connection'],['Navigator', 'plugins'],['Navigator', 'mimeTypes'],['Navigator', 'webkitTemporaryStorage'],['Navigator', 'webkitPersistentStorage'],['Navigator', 'hardwareConcurrency'],['Navigator', 'cookieEnabled'],['Navigator', 'appCodeName'],['Navigator', 'appName'],['Navigator', 'appVersion'],['Navigator', 'platform'],['Navigator', 'product'],['Navigator', 'userAgent'],['Navigator', 'language'],['Navigator', 'languages'],['Navigator', 'onLine'],['Navigator', 'webdriver'],['Navigator', 'pdfViewerEnabled'],['Navigator', 'scheduling'],['Navigator', 'ink'],['Navigator', 'mediaCapabilities'],['Navigator', 'mediaSession'],['Navigator', 'permissions'],['NamedNodeMap', 'length'],['MutationRecord', 'type'],['MutationRecord', 'target'],['MutationRecord', 'addedNodes'],['MutationRecord', 'removedNodes'],['MutationRecord', 'previousSibling'],['MutationRecord', 'nextSibling'],['MutationRecord', 'attributeName'],['MutationRecord', 'attributeNamespace'],['MutationRecord', 'oldValue'],['MutationEvent', 'relatedNode'],['MutationEvent', 'prevValue'],['MutationEvent', 'newValue'],['MutationEvent', 'attrName'],['MutationEvent', 'attrChange'],['MouseEvent', 'screenX'],['MouseEvent', 'screenY'],['MouseEvent', 'clientX'],['MouseEvent', 'clientY'],['MouseEvent', 'ctrlKey'],['MouseEvent', 'shiftKey'],['MouseEvent', 'altKey'],['MouseEvent', 'metaKey'],['MouseEvent', 'button'],['MouseEvent', 'buttons'],['MouseEvent', 'relatedTarget'],['MouseEvent', 'pageX'],['MouseEvent', 'pageY'],['MouseEvent', 'x'],['MouseEvent', 'y'],['MouseEvent', 'offsetX'],['MouseEvent', 'offsetY'],['MouseEvent', 'movementX'],['MouseEvent', 'movementY'],['MouseEvent', 'fromElement'],['MouseEvent', 'toElement'],['MouseEvent', 'layerX'],['MouseEvent', 'layerY'],['MimeTypeArray', 'length'],['MimeType', 'type'],['MimeType', 'suffixes'],['MimeType', 'description'],['MimeType', 'enabledPlugin'],['MessagePort', 'onmessage'],['MessagePort', 'onmessageerror'],['MessageEvent', 'data'],['MessageEvent', 'origin'],['MessageEvent', 'lastEventId'],['MessageEvent', 'source'],['MessageEvent', 'ports'],['MessageEvent', 'userActivation'],['MessageChannel', 'port1'],['MessageChannel', 'port2'],['MediaStreamTrackEvent', 'track'],['MediaStreamTrack', 'kind'],['MediaStreamTrack', 'id'],['MediaStreamTrack', 'label'],['MediaStreamTrack', 'enabled'],['MediaStreamTrack', 'muted'],['MediaStreamTrack', 'onmute'],['MediaStreamTrack', 'onunmute'],['MediaStreamTrack', 'readyState'],['MediaStreamTrack', 'onended'],['MediaStreamTrack', 'contentHint'],['MediaStreamEvent', 'stream'],['MediaStreamAudioSourceNode', 'mediaStream'],['MediaStreamAudioDestinationNode', 'stream'],['MediaStream', 'id'],['MediaStream', 'active'],['MediaStream', 'onaddtrack'],['MediaStream', 'onremovetrack'],['MediaStream', 'onactive'],['MediaStream', 'oninactive'],['MediaRecorder', 'stream'],['MediaRecorder', 'mimeType'],['MediaRecorder', 'state'],['MediaRecorder', 'onstart'],['MediaRecorder', 'onstop'],['MediaRecorder', 'ondataavailable'],['MediaRecorder', 'onpause'],['MediaRecorder', 'onresume'],['MediaRecorder', 'onerror'],['MediaRecorder', 'videoBitsPerSecond'],['MediaRecorder', 'audioBitsPerSecond'],['MediaRecorder', 'audioBitrateMode'],['MediaQueryListEvent', 'media'],['MediaQueryListEvent', 'matches'],['MediaQueryList', 'media'],['MediaQueryList', 'matches'],['MediaQueryList', 'onchange'],['MediaList', 'length'],['MediaList', 'mediaText'],['MediaError', 'code'],['MediaError', 'message'],['MediaEncryptedEvent', 'initDataType'],['MediaEncryptedEvent', 'initData'],['MediaElementAudioSourceNode', 'mediaElement'],['LayoutShiftAttribution', 'node'],['LayoutShiftAttribution', 'previousRect'],['LayoutShiftAttribution', 'currentRect'],['LayoutShift', 'value'],['LayoutShift', 'hadRecentInput'],['LayoutShift', 'lastInputTime'],['LayoutShift', 'sources'],['LargestContentfulPaint', 'renderTime'],['LargestContentfulPaint', 'loadTime'],['LargestContentfulPaint', 'size'],['LargestContentfulPaint', 'id'],['LargestContentfulPaint', 'url'],['LargestContentfulPaint', 'element'],['KeyframeEffect', 'target'],['KeyframeEffect', 'pseudoElement'],['KeyframeEffect', 'composite'],['KeyboardEvent', 'key'],['KeyboardEvent', 'code'],['KeyboardEvent', 'location'],['KeyboardEvent', 'ctrlKey'],['KeyboardEvent', 'shiftKey'],['KeyboardEvent', 'altKey'],['KeyboardEvent', 'metaKey'],['KeyboardEvent', 'repeat'],['KeyboardEvent', 'isComposing'],['KeyboardEvent', 'charCode'],['KeyboardEvent', 'keyCode'],['IntersectionObserverEntry', 'time'],['IntersectionObserverEntry', 'rootBounds'],['IntersectionObserverEntry', 'boundingClientRect'],['IntersectionObserverEntry', 'intersectionRect'],['IntersectionObserverEntry', 'isIntersecting'],['IntersectionObserverEntry', 'isVisible'],['IntersectionObserverEntry', 'intersectionRatio'],['IntersectionObserverEntry', 'target'],['IntersectionObserver', 'root'],['IntersectionObserver', 'rootMargin'],['IntersectionObserver', 'thresholds'],['IntersectionObserver', 'delay'],['IntersectionObserver', 'trackVisibility'],['InputEvent', 'data'],['InputEvent', 'isComposing'],['InputEvent', 'inputType'],['InputEvent', 'dataTransfer'],['InputDeviceCapabilities', 'firesTouchEvents'],['ImageData', 'width'],['ImageData', 'height'],['ImageData', 'data'],['ImageData', 'colorSpace'],['ImageCapture', 'track'],['ImageBitmapRenderingContext', 'canvas'],['ImageBitmap', 'width'],['ImageBitmap', 'height'],['IdleDeadline', 'didTimeout'],['IDBVersionChangeEvent', 'oldVersion'],['IDBVersionChangeEvent', 'newVersion'],['IDBVersionChangeEvent', 'dataLoss'],['IDBVersionChangeEvent', 'dataLossMessage'],['IDBTransaction', 'objectStoreNames'],['IDBTransaction', 'mode'],['IDBTransaction', 'db'],['IDBTransaction', 'error'],['IDBTransaction', 'onabort'],['IDBTransaction', 'oncomplete'],['IDBTransaction', 'onerror'],['IDBTransaction', 'durability'],['IDBRequest', 'result'],['IDBRequest', 'error'],['IDBRequest', 'source'],['IDBRequest', 'transaction'],['IDBRequest', 'readyState'],['IDBRequest', 'onsuccess'],['IDBRequest', 'onerror'],['IDBOpenDBRequest', 'onblocked'],['IDBOpenDBRequest', 'onupgradeneeded'],['IDBObjectStore', 'name'],['IDBObjectStore', 'keyPath'],['IDBObjectStore', 'indexNames'],['IDBObjectStore', 'transaction'],['IDBObjectStore', 'autoIncrement'],['IDBKeyRange', 'lower'],['IDBKeyRange', 'upper'],['IDBKeyRange', 'lowerOpen'],['IDBKeyRange', 'upperOpen'],['IDBIndex', 'name'],['IDBIndex', 'objectStore'],['IDBIndex', 'keyPath'],['IDBIndex', 'multiEntry'],['IDBIndex', 'unique'],['IDBDatabase', 'name'],['IDBDatabase', 'version'],['IDBDatabase', 'objectStoreNames'],['IDBDatabase', 'onabort'],['IDBDatabase', 'onclose'],['IDBDatabase', 'onerror'],['IDBDatabase', 'onversionchange'],['IDBCursorWithValue', 'value'],['IDBCursor', 'source'],['IDBCursor', 'direction'],['IDBCursor', 'key'],['IDBCursor', 'primaryKey'],['IDBCursor', 'request'],['History', 'length'],['History', 'scrollRestoration'],['History', 'state'],['HashChangeEvent', 'oldURL'],['HashChangeEvent', 'newURL'],['HTMLVideoElement', 'width'],['HTMLVideoElement', 'height'],['HTMLVideoElement', 'videoWidth'],['HTMLVideoElement', 'videoHeight'],['HTMLVideoElement', 'poster'],['HTMLVideoElement', 'webkitDecodedFrameCount'],['HTMLVideoElement', 'webkitDroppedFrameCount'],['HTMLVideoElement', 'playsInline'],['HTMLVideoElement', 'webkitSupportsFullscreen'],['HTMLVideoElement', 'webkitDisplayingFullscreen'],['HTMLVideoElement', 'onenterpictureinpicture'],['HTMLVideoElement', 'onleavepictureinpicture'],['HTMLVideoElement', 'disablePictureInPicture'],['HTMLUListElement', 'compact'],['HTMLUListElement', 'type'],['HTMLTrackElement', 'kind'],['HTMLTrackElement', 'src'],['HTMLTrackElement', 'srclang'],['HTMLTrackElement', 'label'],['HTMLTrackElement', 'default'],['HTMLTrackElement', 'readyState'],['HTMLTrackElement', 'track'],['HTMLTitleElement', 'text'],['HTMLTimeElement', 'dateTime'],['HTMLTextAreaElement', 'autocomplete'],['HTMLTextAreaElement', 'cols'],['HTMLTextAreaElement', 'dirName'],['HTMLTextAreaElement', 'disabled'],['HTMLTextAreaElement', 'form'],['HTMLTextAreaElement', 'maxLength'],['HTMLTextAreaElement', 'minLength'],['HTMLTextAreaElement', 'name'],['HTMLTextAreaElement', 'placeholder'],['HTMLTextAreaElement', 'readOnly'],['HTMLTextAreaElement', 'required'],['HTMLTextAreaElement', 'rows'],['HTMLTextAreaElement', 'wrap'],['HTMLTextAreaElement', 'type'],['HTMLTextAreaElement', 'defaultValue'],['HTMLTextAreaElement', 'value'],['HTMLTextAreaElement', 'textLength'],['HTMLTextAreaElement', 'willValidate'],['HTMLTextAreaElement', 'validity'],['HTMLTextAreaElement', 'validationMessage'],['HTMLTextAreaElement', 'labels'],['HTMLTextAreaElement', 'selectionStart'],['HTMLTextAreaElement', 'selectionEnd'],['HTMLTextAreaElement', 'selectionDirection'],['HTMLTemplateElement', 'content'],['HTMLTemplateElement', 'shadowRoot'],['HTMLTableSectionElement', 'rows'],['HTMLTableSectionElement', 'align'],['HTMLTableSectionElement', 'ch'],['HTMLTableSectionElement', 'chOff'],['HTMLTableSectionElement', 'vAlign'],['HTMLTableRowElement', 'rowIndex'],['HTMLTableRowElement', 'sectionRowIndex'],['HTMLTableRowElement', 'cells'],['HTMLTableRowElement', 'align'],['HTMLTableRowElement', 'ch'],['HTMLTableRowElement', 'chOff'],['HTMLTableRowElement', 'vAlign'],['HTMLTableRowElement', 'bgColor'],['HTMLTableElement', 'caption'],['HTMLTableElement', 'tHead'],['HTMLTableElement', 'tFoot'],['HTMLTableElement', 'tBodies'],['HTMLTableElement', 'rows'],['HTMLTableElement', 'align'],['HTMLTableElement', 'border'],['HTMLTableElement', 'frame'],['HTMLTableElement', 'rules'],['HTMLTableElement', 'summary'],['HTMLTableElement', 'width'],['HTMLTableElement', 'bgColor'],['HTMLTableElement', 'cellPadding'],['HTMLTableElement', 'cellSpacing'],['HTMLTableColElement', 'span'],['HTMLTableColElement', 'align'],['HTMLTableColElement', 'ch'],['HTMLTableColElement', 'chOff'],['HTMLTableColElement', 'vAlign'],['HTMLTableColElement', 'width'],['HTMLTableCellElement', 'colSpan'],['HTMLTableCellElement', 'rowSpan'],['HTMLTableCellElement', 'headers'],['HTMLTableCellElement', 'cellIndex'],['HTMLTableCellElement', 'align'],['HTMLTableCellElement', 'axis'],['HTMLTableCellElement', 'height'],['HTMLTableCellElement', 'width'],['HTMLTableCellElement', 'ch'],['HTMLTableCellElement', 'chOff'],['HTMLTableCellElement', 'noWrap'],['HTMLTableCellElement', 'vAlign'],['HTMLTableCellElement', 'bgColor'],['HTMLTableCellElement', 'abbr'],['HTMLTableCellElement', 'scope'],['HTMLTableCaptionElement', 'align'],['HTMLStyleElement', 'disabled'],['HTMLStyleElement', 'media'],['HTMLStyleElement', 'type'],['HTMLStyleElement', 'sheet'],['HTMLSourceElement', 'src'],['HTMLSourceElement', 'type'],['HTMLSourceElement', 'srcset'],['HTMLSourceElement', 'sizes'],['HTMLSourceElement', 'media'],['HTMLSourceElement', 'width'],['HTMLSourceElement', 'height'],['HTMLSlotElement', 'name'],['HTMLSelectElement', 'autocomplete'],['HTMLSelectElement', 'disabled'],['HTMLSelectElement', 'form'],['HTMLSelectElement', 'multiple'],['HTMLSelectElement', 'name'],['HTMLSelectElement', 'required'],['HTMLSelectElement', 'size'],['HTMLSelectElement', 'type'],['HTMLSelectElement', 'options'],['HTMLSelectElement', 'length'],['HTMLSelectElement', 'selectedOptions'],['HTMLSelectElement', 'selectedIndex'],['HTMLSelectElement', 'value'],['HTMLSelectElement', 'willValidate'],['HTMLSelectElement', 'validity'],['HTMLSelectElement', 'validationMessage'],['HTMLSelectElement', 'labels'],['HTMLScriptElement', 'src'],['HTMLScriptElement', 'type'],['HTMLScriptElement', 'noModule'],['HTMLScriptElement', 'charset'],['HTMLScriptElement', 'async'],['HTMLScriptElement', 'defer'],['HTMLScriptElement', 'crossOrigin'],['HTMLScriptElement', 'text'],['HTMLScriptElement', 'referrerPolicy'],['HTMLScriptElement', 'event'],['HTMLScriptElement', 'htmlFor'],['HTMLScriptElement', 'integrity'],['HTMLQuoteElement', 'cite'],['HTMLProgressElement', 'value'],['HTMLProgressElement', 'max'],['HTMLProgressElement', 'position'],['HTMLProgressElement', 'labels'],['HTMLPreElement', 'width'],['HTMLParamElement', 'name'],['HTMLParamElement', 'value'],['HTMLParamElement', 'type'],['HTMLParamElement', 'valueType'],['HTMLParagraphElement', 'align'],['HTMLOutputElement', 'htmlFor'],['HTMLOutputElement', 'form'],['HTMLOutputElement', 'name'],['HTMLOutputElement', 'type'],['HTMLOutputElement', 'defaultValue'],['HTMLOutputElement', 'value'],['HTMLOutputElement', 'willValidate'],['HTMLOutputElement', 'validity'],['HTMLOutputElement', 'validationMessage'],['HTMLOutputElement', 'labels'],['HTMLOptionsCollection', 'length'],['HTMLOptionsCollection', 'selectedIndex'],['HTMLOptionElement', 'disabled'],['HTMLOptionElement', 'form'],['HTMLOptionElement', 'label'],['HTMLOptionElement', 'defaultSelected'],['HTMLOptionElement', 'selected'],['HTMLOptionElement', 'value'],['HTMLOptionElement', 'text'],['HTMLOptionElement', 'index'],['HTMLOptGroupElement', 'disabled'],['HTMLOptGroupElement', 'label'],['HTMLObjectElement', 'data'],['HTMLObjectElement', 'type'],['HTMLObjectElement', 'name'],['HTMLObjectElement', 'useMap'],['HTMLObjectElement', 'form'],['HTMLObjectElement', 'width'],['HTMLObjectElement', 'height'],['HTMLObjectElement', 'contentDocument'],['HTMLObjectElement', 'contentWindow'],['HTMLObjectElement', 'willValidate'],['HTMLObjectElement', 'validity'],['HTMLObjectElement', 'validationMessage'],['HTMLObjectElement', 'align'],['HTMLObjectElement', 'archive'],['HTMLObjectElement', 'code'],['HTMLObjectElement', 'declare'],['HTMLObjectElement', 'hspace'],['HTMLObjectElement', 'standby'],['HTMLObjectElement', 'vspace'],['HTMLObjectElement', 'codeBase'],['HTMLObjectElement', 'codeType'],['HTMLObjectElement', 'border'],['HTMLOListElement', 'reversed'],['HTMLOListElement', 'start'],['HTMLOListElement', 'type'],['HTMLOListElement', 'compact'],['HTMLModElement', 'cite'],['HTMLModElement', 'dateTime'],['HTMLMeterElement', 'value'],['HTMLMeterElement', 'min'],['HTMLMeterElement', 'max'],['HTMLMeterElement', 'low'],['HTMLMeterElement', 'high'],['HTMLMeterElement', 'optimum'],['HTMLMeterElement', 'labels'],['HTMLMetaElement', 'name'],['HTMLMetaElement', 'httpEquiv'],['HTMLMetaElement', 'content'],['HTMLMetaElement', 'scheme'],['HTMLMetaElement', 'media'],['HTMLMenuElement', 'compact'],['HTMLMediaElement', 'error'],['HTMLMediaElement', 'src'],['HTMLMediaElement', 'currentSrc'],['HTMLMediaElement', 'crossOrigin'],['HTMLMediaElement', 'networkState'],['HTMLMediaElement', 'preload'],['HTMLMediaElement', 'buffered'],['HTMLMediaElement', 'readyState'],['HTMLMediaElement', 'seeking'],['HTMLMediaElement', 'currentTime'],['HTMLMediaElement', 'duration'],['HTMLMediaElement', 'paused'],['HTMLMediaElement', 'defaultPlaybackRate'],['HTMLMediaElement', 'playbackRate'],['HTMLMediaElement', 'played'],['HTMLMediaElement', 'seekable'],['HTMLMediaElement', 'ended'],['HTMLMediaElement', 'autoplay'],['HTMLMediaElement', 'loop'],['HTMLMediaElement', 'controls'],['HTMLMediaElement', 'controlsList'],['HTMLMediaElement', 'volume'],['HTMLMediaElement', 'muted'],['HTMLMediaElement', 'defaultMuted'],['HTMLMediaElement', 'textTracks'],['HTMLMediaElement', 'webkitAudioDecodedByteCount'],['HTMLMediaElement', 'webkitVideoDecodedByteCount'],['HTMLMediaElement', 'onencrypted'],['HTMLMediaElement', 'onwaitingforkey'],['HTMLMediaElement', 'srcObject'],['HTMLMediaElement', 'preservesPitch'],['HTMLMediaElement', 'sinkId'],['HTMLMediaElement', 'remote'],['HTMLMediaElement', 'disableRemotePlayback'],['HTMLMarqueeElement', 'behavior'],['HTMLMarqueeElement', 'bgColor'],['HTMLMarqueeElement', 'direction'],['HTMLMarqueeElement', 'height'],['HTMLMarqueeElement', 'hspace'],['HTMLMarqueeElement', 'loop'],['HTMLMarqueeElement', 'scrollAmount'],['HTMLMarqueeElement', 'scrollDelay'],['HTMLMarqueeElement', 'trueSpeed'],['HTMLMarqueeElement', 'vspace'],['HTMLMarqueeElement', 'width'],['HTMLMapElement', 'name'],['HTMLMapElement', 'areas'],['HTMLLinkElement', 'disabled'],['HTMLLinkElement', 'href'],['HTMLLinkElement', 'crossOrigin'],['HTMLLinkElement', 'rel'],['HTMLLinkElement', 'relList'],['HTMLLinkElement', 'media'],['HTMLLinkElement', 'hreflang'],['HTMLLinkElement', 'type'],['HTMLLinkElement', 'as'],['HTMLLinkElement', 'referrerPolicy'],['HTMLLinkElement', 'sizes'],['HTMLLinkElement', 'imageSrcset'],['HTMLLinkElement', 'imageSizes'],['HTMLLinkElement', 'charset'],['HTMLLinkElement', 'rev'],['HTMLLinkElement', 'target'],['HTMLLinkElement', 'sheet'],['HTMLLinkElement', 'integrity'],['HTMLLegendElement', 'form'],['HTMLLegendElement', 'align'],['HTMLLabelElement', 'form'],['HTMLLabelElement', 'htmlFor'],['HTMLLabelElement', 'control'],['HTMLLIElement', 'value'],['HTMLLIElement', 'type'],['HTMLInputElement', 'accept'],['HTMLInputElement', 'alt'],['HTMLInputElement', 'autocomplete'],['HTMLInputElement', 'defaultChecked'],['HTMLInputElement', 'checked'],['HTMLInputElement', 'dirName'],['HTMLInputElement', 'disabled'],['HTMLInputElement', 'form'],['HTMLInputElement', 'files'],['HTMLInputElement', 'formAction'],['HTMLInputElement', 'formEnctype'],['HTMLInputElement', 'formMethod'],['HTMLInputElement', 'formNoValidate'],['HTMLInputElement', 'formTarget'],['HTMLInputElement', 'height'],['HTMLInputElement', 'indeterminate'],['HTMLInputElement', 'list'],['HTMLInputElement', 'max'],['HTMLInputElement', 'maxLength'],['HTMLInputElement', 'min'],['HTMLInputElement', 'minLength'],['HTMLInputElement', 'multiple'],['HTMLInputElement', 'name'],['HTMLInputElement', 'pattern'],['HTMLInputElement', 'placeholder'],['HTMLInputElement', 'readOnly'],['HTMLInputElement', 'required'],['HTMLInputElement', 'size'],['HTMLInputElement', 'src'],['HTMLInputElement', 'step'],['HTMLInputElement', 'type'],['HTMLInputElement', 'defaultValue'],['HTMLInputElement', 'value'],['HTMLInputElement', 'valueAsDate'],['HTMLInputElement', 'valueAsNumber'],['HTMLInputElement', 'width'],['HTMLInputElement', 'willValidate'],['HTMLInputElement', 'validity'],['HTMLInputElement', 'validationMessage'],['HTMLInputElement', 'labels'],['HTMLInputElement', 'selectionStart'],['HTMLInputElement', 'selectionEnd'],['HTMLInputElement', 'selectionDirection'],['HTMLInputElement', 'align'],['HTMLInputElement', 'useMap'],['HTMLInputElement', 'webkitdirectory'],['HTMLInputElement', 'incremental'],['HTMLInputElement', 'webkitEntries'],['HTMLImageElement', 'alt'],['HTMLImageElement', 'src'],['HTMLImageElement', 'srcset'],['HTMLImageElement', 'sizes'],['HTMLImageElement', 'crossOrigin'],['HTMLImageElement', 'useMap'],['HTMLImageElement', 'isMap'],['HTMLImageElement', 'width'],['HTMLImageElement', 'height'],['HTMLImageElement', 'naturalWidth'],['HTMLImageElement', 'naturalHeight'],['HTMLImageElement', 'complete'],['HTMLImageElement', 'currentSrc'],['HTMLImageElement', 'referrerPolicy'],['HTMLImageElement', 'decoding'],['HTMLImageElement', 'name'],['HTMLImageElement', 'lowsrc'],['HTMLImageElement', 'align'],['HTMLImageElement', 'hspace'],['HTMLImageElement', 'vspace'],['HTMLImageElement', 'longDesc'],['HTMLImageElement', 'border'],['HTMLImageElement', 'x'],['HTMLImageElement', 'y'],['HTMLImageElement', 'loading'],['HTMLIFrameElement', 'src'],['HTMLIFrameElement', 'srcdoc'],['HTMLIFrameElement', 'name'],['HTMLIFrameElement', 'sandbox'],['HTMLIFrameElement', 'allowFullscreen'],['HTMLIFrameElement', 'width'],['HTMLIFrameElement', 'height'],['HTMLIFrameElement', 'contentDocument'],['HTMLIFrameElement', 'contentWindow'],['HTMLIFrameElement', 'referrerPolicy'],['HTMLIFrameElement', 'csp'],['HTMLIFrameElement', 'allow'],['HTMLIFrameElement', 'featurePolicy'],['HTMLIFrameElement', 'align'],['HTMLIFrameElement', 'scrolling'],['HTMLIFrameElement', 'frameBorder'],['HTMLIFrameElement', 'longDesc'],['HTMLIFrameElement', 'marginHeight'],['HTMLIFrameElement', 'marginWidth'],['HTMLIFrameElement', 'loading'],['HTMLIFrameElement', 'allowPaymentRequest'],['HTMLHtmlElement', 'version'],['HTMLHeadingElement', 'align'],['HTMLHRElement', 'align'],['HTMLHRElement', 'color'],['HTMLHRElement', 'noShade'],['HTMLHRElement', 'size'],['HTMLHRElement', 'width'],['HTMLFrameSetElement', 'cols'],['HTMLFrameSetElement', 'rows'],['HTMLFrameSetElement', 'onblur'],['HTMLFrameSetElement', 'onerror'],['HTMLFrameSetElement', 'onfocus'],['HTMLFrameSetElement', 'onload'],['HTMLFrameSetElement', 'onresize'],['HTMLFrameSetElement', 'onscroll'],['HTMLFrameSetElement', 'onafterprint'],['HTMLFrameSetElement', 'onbeforeprint'],['HTMLFrameSetElement', 'onbeforeunload'],['HTMLFrameSetElement', 'onhashchange'],['HTMLFrameSetElement', 'onlanguagechange'],['HTMLFrameSetElement', 'onmessage'],['HTMLFrameSetElement', 'onmessageerror'],['HTMLFrameSetElement', 'onoffline'],['HTMLFrameSetElement', 'ononline'],['HTMLFrameSetElement', 'onpagehide'],['HTMLFrameSetElement', 'onpageshow'],['HTMLFrameSetElement', 'onpopstate'],['HTMLFrameSetElement', 'onrejectionhandled'],['HTMLFrameSetElement', 'onstorage'],['HTMLFrameSetElement', 'onunhandledrejection'],['HTMLFrameSetElement', 'onunload'],['HTMLFrameElement', 'name'],['HTMLFrameElement', 'scrolling'],['HTMLFrameElement', 'src'],['HTMLFrameElement', 'frameBorder'],['HTMLFrameElement', 'longDesc'],['HTMLFrameElement', 'noResize'],['HTMLFrameElement', 'contentDocument'],['HTMLFrameElement', 'contentWindow'],['HTMLFrameElement', 'marginHeight'],['HTMLFrameElement', 'marginWidth'],['HTMLFormElement', 'acceptCharset'],['HTMLFormElement', 'action'],['HTMLFormElement', 'autocomplete'],['HTMLFormElement', 'enctype'],['HTMLFormElement', 'encoding'],['HTMLFormElement', 'method'],['HTMLFormElement', 'name'],['HTMLFormElement', 'noValidate'],['HTMLFormElement', 'target'],['HTMLFormElement', 'elements'],['HTMLFormElement', 'length'],['HTMLFontElement', 'color'],['HTMLFontElement', 'face'],['HTMLFontElement', 'size'],['HTMLFieldSetElement', 'disabled'],['HTMLFieldSetElement', 'form'],['HTMLFieldSetElement', 'name'],['HTMLFieldSetElement', 'type'],['HTMLFieldSetElement', 'elements'],['HTMLFieldSetElement', 'willValidate'],['HTMLFieldSetElement', 'validity'],['HTMLFieldSetElement', 'validationMessage'],['HTMLEmbedElement', 'src'],['HTMLEmbedElement', 'type'],['HTMLEmbedElement', 'width'],['HTMLEmbedElement', 'height'],['HTMLEmbedElement', 'align'],['HTMLEmbedElement', 'name'],['HTMLElement', 'title'],['HTMLElement', 'lang'],['HTMLElement', 'translate'],['HTMLElement', 'dir'],['HTMLElement', 'hidden'],['HTMLElement', 'accessKey'],['HTMLElement', 'draggable'],['HTMLElement', 'spellcheck'],['HTMLElement', 'autocapitalize'],['HTMLElement', 'contentEditable'],['HTMLElement', 'isContentEditable'],['HTMLElement', 'inputMode'],['HTMLElement', 'offsetParent'],['HTMLElement', 'offsetTop'],['HTMLElement', 'offsetLeft'],['HTMLElement', 'offsetWidth'],['HTMLElement', 'offsetHeight'],['HTMLElement', 'style'],['HTMLElement', 'innerText'],['HTMLElement', 'outerText'],['HTMLElement', 'onbeforexrselect'],['HTMLElement', 'onabort'],['HTMLElement', 'onblur'],['HTMLElement', 'oncancel'],['HTMLElement', 'oncanplay'],['HTMLElement', 'oncanplaythrough'],['HTMLElement', 'onchange'],['HTMLElement', 'onclick'],['HTMLElement', 'onclose'],['HTMLElement', 'oncontextmenu'],['HTMLElement', 'oncuechange'],['HTMLElement', 'ondblclick'],['HTMLElement', 'ondrag'],['HTMLElement', 'ondragend'],['HTMLElement', 'ondragenter'],['HTMLElement', 'ondragleave'],['HTMLElement', 'ondragover'],['HTMLElement', 'ondragstart'],['HTMLElement', 'ondrop'],['HTMLElement', 'ondurationchange'],['HTMLElement', 'onemptied'],['HTMLElement', 'onended'],['HTMLElement', 'onerror'],['HTMLElement', 'onfocus'],['HTMLElement', 'onformdata'],['HTMLElement', 'oninput'],['HTMLElement', 'oninvalid'],['HTMLElement', 'onkeydown'],['HTMLElement', 'onkeypress'],['HTMLElement', 'onkeyup'],['HTMLElement', 'onload'],['HTMLElement', 'onloadeddata'],['HTMLElement', 'onloadedmetadata'],['HTMLElement', 'onloadstart'],['HTMLElement', 'onmousedown'],['HTMLElement', 'onmouseenter'],['HTMLElement', 'onmouseleave'],['HTMLElement', 'onmousemove'],['HTMLElement', 'onmouseout'],['HTMLElement', 'onmouseover'],['HTMLElement', 'onmouseup'],['HTMLElement', 'onmousewheel'],['HTMLElement', 'onpause'],['HTMLElement', 'onplay'],['HTMLElement', 'onplaying'],['HTMLElement', 'onprogress'],['HTMLElement', 'onratechange'],['HTMLElement', 'onreset'],['HTMLElement', 'onresize'],['HTMLElement', 'onscroll'],['HTMLElement', 'onseeked'],['HTMLElement', 'onseeking'],['HTMLElement', 'onselect'],['HTMLElement', 'onstalled'],['HTMLElement', 'onsubmit'],['HTMLElement', 'onsuspend'],['HTMLElement', 'ontimeupdate'],['HTMLElement', 'ontoggle'],['HTMLElement', 'onvolumechange'],['HTMLElement', 'onwaiting'],['HTMLElement', 'onwebkitanimationend'],['HTMLElement', 'onwebkitanimationiteration'],['HTMLElement', 'onwebkitanimationstart'],['HTMLElement', 'onwebkittransitionend'],['HTMLElement', 'onwheel'],['HTMLElement', 'onauxclick'],['HTMLElement', 'ongotpointercapture'],['HTMLElement', 'onlostpointercapture'],['HTMLElement', 'onpointerdown'],['HTMLElement', 'onpointermove'],['HTMLElement', 'onpointerup'],['HTMLElement', 'onpointercancel'],['HTMLElement', 'onpointerover'],['HTMLElement', 'onpointerout'],['HTMLElement', 'onpointerenter'],['HTMLElement', 'onpointerleave'],['HTMLElement', 'onselectstart'],['HTMLElement', 'onselectionchange'],['HTMLElement', 'onanimationend'],['HTMLElement', 'onanimationiteration'],['HTMLElement', 'onanimationstart'],['HTMLElement', 'ontransitionrun'],['HTMLElement', 'ontransitionstart'],['HTMLElement', 'ontransitionend'],['HTMLElement', 'ontransitioncancel'],['HTMLElement', 'oncopy'],['HTMLElement', 'oncut'],['HTMLElement', 'onpaste'],['HTMLElement', 'dataset'],['HTMLElement', 'nonce'],['HTMLElement', 'autofocus'],['HTMLElement', 'tabIndex'],['HTMLElement', 'enterKeyHint'],['HTMLElement', 'virtualKeyboardPolicy'],['HTMLElement', 'onpointerrawupdate'],['HTMLDivElement', 'align'],['HTMLDirectoryElement', 'compact'],['HTMLDialogElement', 'open'],['HTMLDialogElement', 'returnValue'],['HTMLDetailsElement', 'open'],['HTMLDataListElement', 'options'],['HTMLDataElement', 'value'],['HTMLDListElement', 'compact'],['HTMLCollection', 'length'],['HTMLCanvasElement', 'width'],['HTMLCanvasElement', 'height'],['HTMLButtonElement', 'disabled'],['HTMLButtonElement', 'form'],['HTMLButtonElement', 'formAction'],['HTMLButtonElement', 'formEnctype'],['HTMLButtonElement', 'formMethod'],['HTMLButtonElement', 'formNoValidate'],['HTMLButtonElement', 'formTarget'],['HTMLButtonElement', 'name'],['HTMLButtonElement', 'type'],['HTMLButtonElement', 'value'],['HTMLButtonElement', 'willValidate'],['HTMLButtonElement', 'validity'],['HTMLButtonElement', 'validationMessage'],['HTMLButtonElement', 'labels'],['HTMLBodyElement', 'text'],['HTMLBodyElement', 'link'],['HTMLBodyElement', 'vLink'],['HTMLBodyElement', 'aLink'],['HTMLBodyElement', 'bgColor'],['HTMLBodyElement', 'background'],['HTMLBodyElement', 'onblur'],['HTMLBodyElement', 'onerror'],['HTMLBodyElement', 'onfocus'],['HTMLBodyElement', 'onload'],['HTMLBodyElement', 'onresize'],['HTMLBodyElement', 'onscroll'],['HTMLBodyElement', 'onafterprint'],['HTMLBodyElement', 'onbeforeprint'],['HTMLBodyElement', 'onbeforeunload'],['HTMLBodyElement', 'onhashchange'],['HTMLBodyElement', 'onlanguagechange'],['HTMLBodyElement', 'onmessage'],['HTMLBodyElement', 'onmessageerror'],['HTMLBodyElement', 'onoffline'],['HTMLBodyElement', 'ononline'],['HTMLBodyElement', 'onpagehide'],['HTMLBodyElement', 'onpageshow'],['HTMLBodyElement', 'onpopstate'],['HTMLBodyElement', 'onrejectionhandled'],['HTMLBodyElement', 'onstorage'],['HTMLBodyElement', 'onunhandledrejection'],['HTMLBodyElement', 'onunload'],['HTMLBaseElement', 'href'],['HTMLBaseElement', 'target'],['HTMLBRElement', 'clear'],['HTMLAreaElement', 'alt'],['HTMLAreaElement', 'coords'],['HTMLAreaElement', 'download'],['HTMLAreaElement', 'shape'],['HTMLAreaElement', 'target'],['HTMLAreaElement', 'ping'],['HTMLAreaElement', 'rel'],['HTMLAreaElement', 'relList'],['HTMLAreaElement', 'referrerPolicy'],['HTMLAreaElement', 'noHref'],['HTMLAreaElement', 'origin'],['HTMLAreaElement', 'protocol'],['HTMLAreaElement', 'username'],['HTMLAreaElement', 'password'],['HTMLAreaElement', 'host'],['HTMLAreaElement', 'hostname'],['HTMLAreaElement', 'port'],['HTMLAreaElement', 'pathname'],['HTMLAreaElement', 'search'],['HTMLAreaElement', 'hash'],['HTMLAreaElement', 'href'],['HTMLAnchorElement', 'target'],['HTMLAnchorElement', 'download'],['HTMLAnchorElement', 'ping'],['HTMLAnchorElement', 'rel'],['HTMLAnchorElement', 'relList'],['HTMLAnchorElement', 'hreflang'],['HTMLAnchorElement', 'type'],['HTMLAnchorElement', 'referrerPolicy'],['HTMLAnchorElement', 'text'],['HTMLAnchorElement', 'coords'],['HTMLAnchorElement', 'charset'],['HTMLAnchorElement', 'name'],['HTMLAnchorElement', 'rev'],['HTMLAnchorElement', 'shape'],['HTMLAnchorElement', 'origin'],['HTMLAnchorElement', 'protocol'],['HTMLAnchorElement', 'username'],['HTMLAnchorElement', 'password'],['HTMLAnchorElement', 'host'],['HTMLAnchorElement', 'hostname'],['HTMLAnchorElement', 'port'],['HTMLAnchorElement', 'pathname'],['HTMLAnchorElement', 'search'],['HTMLAnchorElement', 'hash'],['HTMLAnchorElement', 'href'],['HTMLAnchorElement', 'hrefTranslate'],['HTMLAllCollection', 'length'],['GeolocationPositionError', 'code'],['GeolocationPositionError', 'message'],['GeolocationPosition', 'coords'],['GeolocationPosition', 'timestamp'],['GeolocationCoordinates', 'latitude'],['GeolocationCoordinates', 'longitude'],['GeolocationCoordinates', 'altitude'],['GeolocationCoordinates', 'accuracy'],['GeolocationCoordinates', 'altitudeAccuracy'],['GeolocationCoordinates', 'heading'],['GeolocationCoordinates', 'speed'],['GamepadHapticActuator', 'type'],['GamepadEvent', 'gamepad'],['GamepadButton', 'pressed'],['GamepadButton', 'touched'],['GamepadButton', 'value'],['Gamepad', 'id'],['Gamepad', 'index'],['Gamepad', 'connected'],['Gamepad', 'timestamp'],['Gamepad', 'mapping'],['Gamepad', 'axes'],['Gamepad', 'buttons'],['Gamepad', 'vibrationActuator'],['GainNode', 'gain'],['FormDataEvent', 'formData'],['FontFaceSetLoadEvent', 'fontfaces'],['FontFace', 'family'],['FontFace', 'style'],['FontFace', 'weight'],['FontFace', 'stretch'],['FontFace', 'unicodeRange'],['FontFace', 'variant'],['FontFace', 'featureSettings'],['FontFace', 'display'],['FontFace', 'ascentOverride'],['FontFace', 'descentOverride'],['FontFace', 'lineGapOverride'],['FontFace', 'status'],['FontFace', 'loaded'],['FontFace', 'sizeAdjust'],['FocusEvent', 'relatedTarget'],['FileReader', 'readyState'],['FileReader', 'result'],['FileReader', 'error'],['FileReader', 'onloadstart'],['FileReader', 'onprogress'],['FileReader', 'onload'],['FileReader', 'onabort'],['FileReader', 'onerror'],['FileReader', 'onloadend'],['FileList', 'length'],['File', 'name'],['File', 'lastModified'],['File', 'lastModifiedDate'],['File', 'webkitRelativePath'],['EventSource', 'url'],['EventSource', 'withCredentials'],['EventSource', 'readyState'],['EventSource', 'onopen'],['EventSource', 'onmessage'],['EventSource', 'onerror'],['EventCounts', 'size'],['Event', 'type'],['Event', 'target'],['Event', 'currentTarget'],['Event', 'eventPhase'],['Event', 'bubbles'],['Event', 'cancelable'],['Event', 'defaultPrevented'],['Event', 'composed'],['Event', 'timeStamp'],['Event', 'srcElement'],['Event', 'returnValue'],['Event', 'cancelBubble'],['Event', 'path'],['ErrorEvent', 'message'],['ErrorEvent', 'filename'],['ErrorEvent', 'lineno'],['ErrorEvent', 'colno'],['ErrorEvent', 'error'],['ElementInternals', 'form'],['ElementInternals', 'willValidate'],['ElementInternals', 'validity'],['ElementInternals', 'validationMessage'],['ElementInternals', 'labels'],['ElementInternals', 'shadowRoot'],['ElementInternals', 'states'],['ElementInternals', 'ariaAtomic'],['ElementInternals', 'ariaAutoComplete'],['ElementInternals', 'ariaBusy'],['ElementInternals', 'ariaChecked'],['ElementInternals', 'ariaColCount'],['ElementInternals', 'ariaColIndex'],['ElementInternals', 'ariaColSpan'],['ElementInternals', 'ariaCurrent'],['ElementInternals', 'ariaDescription'],['ElementInternals', 'ariaDisabled'],['ElementInternals', 'ariaExpanded'],['ElementInternals', 'ariaHasPopup'],['ElementInternals', 'ariaHidden'],['ElementInternals', 'ariaKeyShortcuts'],['ElementInternals', 'ariaLabel'],['ElementInternals', 'ariaLevel'],['ElementInternals', 'ariaLive'],['ElementInternals', 'ariaModal'],['ElementInternals', 'ariaMultiLine'],['ElementInternals', 'ariaMultiSelectable'],['ElementInternals', 'ariaOrientation'],['ElementInternals', 'ariaPlaceholder'],['ElementInternals', 'ariaPosInSet'],['ElementInternals', 'ariaPressed'],['ElementInternals', 'ariaReadOnly'],['ElementInternals', 'ariaRelevant'],['ElementInternals', 'ariaRequired'],['ElementInternals', 'ariaRoleDescription'],['ElementInternals', 'ariaRowCount'],['ElementInternals', 'ariaRowIndex'],['ElementInternals', 'ariaRowSpan'],['ElementInternals', 'ariaSelected'],['ElementInternals', 'ariaSetSize'],['ElementInternals', 'ariaSort'],['ElementInternals', 'ariaValueMax'],['ElementInternals', 'ariaValueMin'],['ElementInternals', 'ariaValueNow'],['ElementInternals', 'ariaValueText'],['Element', 'namespaceURI'],['Element', 'prefix'],['Element', 'localName'],['Element', 'tagName'],['Element', 'id'],['Element', 'className'],['Element', 'classList'],['Element', 'slot'],['Element', 'attributes'],['Element', 'shadowRoot'],['Element', 'part'],['Element', 'assignedSlot'],['Element', 'innerHTML'],['Element', 'outerHTML'],['Element', 'scrollTop'],['Element', 'scrollLeft'],['Element', 'scrollWidth'],['Element', 'scrollHeight'],['Element', 'clientTop'],['Element', 'clientLeft'],['Element', 'clientWidth'],['Element', 'clientHeight'],['Element', 'attributeStyleMap'],['Element', 'onbeforecopy'],['Element', 'onbeforecut'],['Element', 'onbeforepaste'],['Element', 'onsearch'],['Element', 'elementTiming'],['Element', 'onfullscreenchange'],['Element', 'onfullscreenerror'],['Element', 'onwebkitfullscreenchange'],['Element', 'onwebkitfullscreenerror'],['Element', 'children'],['Element', 'firstElementChild'],['Element', 'lastElementChild'],['Element', 'childElementCount'],['Element', 'previousElementSibling'],['Element', 'nextElementSibling'],['Element', 'ariaAtomic'],['Element', 'ariaAutoComplete'],['Element', 'ariaBusy'],['Element', 'ariaChecked'],['Element', 'ariaColCount'],['Element', 'ariaColIndex'],['Element', 'ariaColSpan'],['Element', 'ariaCurrent'],['Element', 'ariaDescription'],['Element', 'ariaDisabled'],['Element', 'ariaExpanded'],['Element', 'ariaHasPopup'],['Element', 'ariaHidden'],['Element', 'ariaKeyShortcuts'],['Element', 'ariaLabel'],['Element', 'ariaLevel'],['Element', 'ariaLive'],['Element', 'ariaModal'],['Element', 'ariaMultiLine'],['Element', 'ariaMultiSelectable'],['Element', 'ariaOrientation'],['Element', 'ariaPlaceholder'],['Element', 'ariaPosInSet'],['Element', 'ariaPressed'],['Element', 'ariaReadOnly'],['Element', 'ariaRelevant'],['Element', 'ariaRequired'],['Element', 'ariaRoleDescription'],['Element', 'ariaRowCount'],['Element', 'ariaRowIndex'],['Element', 'ariaRowSpan'],['Element', 'ariaSelected'],['Element', 'ariaSetSize'],['Element', 'ariaSort'],['Element', 'ariaValueMax'],['Element', 'ariaValueMin'],['Element', 'ariaValueNow'],['Element', 'ariaValueText'],['DynamicsCompressorNode', 'threshold'],['DynamicsCompressorNode', 'knee'],['DynamicsCompressorNode', 'ratio'],['DynamicsCompressorNode', 'reduction'],['DynamicsCompressorNode', 'attack'],['DynamicsCompressorNode', 'release'],['DragEvent', 'dataTransfer'],['DocumentType', 'name'],['DocumentType', 'publicId'],['DocumentType', 'systemId'],['DocumentFragment', 'children'],['DocumentFragment', 'firstElementChild'],['DocumentFragment', 'lastElementChild'],['DocumentFragment', 'childElementCount'],['Document', 'implementation'],['Document', 'URL'],['Document', 'documentURI'],['Document', 'compatMode'],['Document', 'characterSet'],['Document', 'charset'],['Document', 'inputEncoding'],['Document', 'contentType'],['Document', 'doctype'],['Document', 'documentElement'],['Document', 'xmlEncoding'],['Document', 'xmlVersion'],['Document', 'xmlStandalone'],['Document', 'domain'],['Document', 'referrer'],
    // ['Document', 'cookie'],
    ['Document', 'lastModified'],['Document', 'readyState'],['Document', 'title'],['Document', 'dir'],['Document', 'body'],['Document', 'head'],['Document', 'images'],['Document', 'embeds'],['Document', 'plugins'],['Document', 'links'],['Document', 'forms'],['Document', 'scripts'],['Document', 'currentScript'],['Document', 'defaultView'],['Document', 'designMode'],['Document', 'onreadystatechange'],['Document', 'anchors'],['Document', 'applets'],['Document', 'fgColor'],['Document', 'linkColor'],['Document', 'vlinkColor'],['Document', 'alinkColor'],['Document', 'bgColor'],['Document', 'all'],['Document', 'scrollingElement'],['Document', 'onpointerlockchange'],['Document', 'onpointerlockerror'],['Document', 'hidden'],['Document', 'visibilityState'],['Document', 'wasDiscarded'],['Document', 'featurePolicy'],['Document', 'webkitVisibilityState'],['Document', 'webkitHidden'],['Document', 'onbeforecopy'],['Document', 'onbeforecut'],['Document', 'onbeforepaste'],['Document', 'onfreeze'],['Document', 'onresume'],['Document', 'onsearch'],['Document', 'onsecuritypolicyviolation'],['Document', 'onvisibilitychange'],['Document', 'fullscreenEnabled'],['Document', 'fullscreen'],['Document', 'onfullscreenchange'],['Document', 'onfullscreenerror'],['Document', 'webkitIsFullScreen'],['Document', 'webkitCurrentFullScreenElement'],['Document', 'webkitFullscreenEnabled'],['Document', 'webkitFullscreenElement'],['Document', 'onwebkitfullscreenchange'],['Document', 'onwebkitfullscreenerror'],['Document', 'rootElement'],['Document', 'onbeforexrselect'],['Document', 'onabort'],['Document', 'onblur'],['Document', 'oncancel'],['Document', 'oncanplay'],['Document', 'oncanplaythrough'],['Document', 'onchange'],['Document', 'onclick'],['Document', 'onclose'],['Document', 'oncontextmenu'],['Document', 'oncuechange'],['Document', 'ondblclick'],['Document', 'ondrag'],['Document', 'ondragend'],['Document', 'ondragenter'],['Document', 'ondragleave'],['Document', 'ondragover'],['Document', 'ondragstart'],['Document', 'ondrop'],['Document', 'ondurationchange'],['Document', 'onemptied'],['Document', 'onended'],['Document', 'onerror'],['Document', 'onfocus'],['Document', 'onformdata'],['Document', 'oninput'],['Document', 'oninvalid'],['Document', 'onkeydown'],['Document', 'onkeypress'],['Document', 'onkeyup'],['Document', 'onload'],['Document', 'onloadeddata'],['Document', 'onloadedmetadata'],['Document', 'onloadstart'],['Document', 'onmousedown'],['Document', 'onmouseenter'],['Document', 'onmouseleave'],['Document', 'onmousemove'],['Document', 'onmouseout'],['Document', 'onmouseover'],['Document', 'onmouseup'],['Document', 'onmousewheel'],['Document', 'onpause'],['Document', 'onplay'],['Document', 'onplaying'],['Document', 'onprogress'],['Document', 'onratechange'],['Document', 'onreset'],['Document', 'onresize'],['Document', 'onscroll'],['Document', 'onseeked'],['Document', 'onseeking'],['Document', 'onselect'],['Document', 'onstalled'],['Document', 'onsubmit'],['Document', 'onsuspend'],['Document', 'ontimeupdate'],['Document', 'ontoggle'],['Document', 'onvolumechange'],['Document', 'onwaiting'],['Document', 'onwebkitanimationend'],['Document', 'onwebkitanimationiteration'],['Document', 'onwebkitanimationstart'],['Document', 'onwebkittransitionend'],['Document', 'onwheel'],['Document', 'onauxclick'],['Document', 'ongotpointercapture'],['Document', 'onlostpointercapture'],['Document', 'onpointerdown'],['Document', 'onpointermove'],['Document', 'onpointerup'],['Document', 'onpointercancel'],['Document', 'onpointerover'],['Document', 'onpointerout'],['Document', 'onpointerenter'],['Document', 'onpointerleave'],['Document', 'onselectstart'],['Document', 'onselectionchange'],['Document', 'onanimationend'],['Document', 'onanimationiteration'],['Document', 'onanimationstart'],['Document', 'ontransitionrun'],['Document', 'ontransitionstart'],['Document', 'ontransitionend'],['Document', 'ontransitioncancel'],['Document', 'oncopy'],['Document', 'oncut'],['Document', 'onpaste'],['Document', 'children'],['Document', 'firstElementChild'],['Document', 'lastElementChild'],['Document', 'childElementCount'],['Document', 'activeElement'],['Document', 'styleSheets'],['Document', 'pointerLockElement'],['Document', 'fullscreenElement'],['Document', 'adoptedStyleSheets'],['Document', 'fonts'],['Document', 'fragmentDirective'],['Document', 'timeline'],['Document', 'pictureInPictureEnabled'],['Document', 'pictureInPictureElement'],['Document', 'onpointerrawupdate'],['DelayNode', 'delayTime'],['DecompressionStream', 'readable'],['DecompressionStream', 'writable'],['DataTransferItemList', 'length'],['DataTransferItem', 'kind'],['DataTransferItem', 'type'],['DataTransfer', 'dropEffect'],['DataTransfer', 'effectAllowed'],['DataTransfer', 'items'],['DataTransfer', 'types'],['DataTransfer', 'files'],['DOMTokenList', 'length'],['DOMTokenList', 'value'],['DOMStringList', 'length'],['DOMRectReadOnly', 'x'],['DOMRectReadOnly', 'y'],['DOMRectReadOnly', 'width'],['DOMRectReadOnly', 'height'],['DOMRectReadOnly', 'top'],['DOMRectReadOnly', 'right'],['DOMRectReadOnly', 'bottom'],['DOMRectReadOnly', 'left'],['DOMRectList', 'length'],['DOMRect', 'x'],['DOMRect', 'y'],['DOMRect', 'width'],['DOMRect', 'height'],['DOMQuad', 'p1'],['DOMQuad', 'p2'],['DOMQuad', 'p3'],['DOMQuad', 'p4'],['DOMPointReadOnly', 'x'],['DOMPointReadOnly', 'y'],['DOMPointReadOnly', 'z'],['DOMPointReadOnly', 'w'],['DOMPoint', 'x'],['DOMPoint', 'y'],['DOMPoint', 'z'],['DOMPoint', 'w'],['DOMMatrixReadOnly', 'a'],['DOMMatrixReadOnly', 'b'],['DOMMatrixReadOnly', 'c'],['DOMMatrixReadOnly', 'd'],['DOMMatrixReadOnly', 'e'],['DOMMatrixReadOnly', 'f'],['DOMMatrixReadOnly', 'm11'],['DOMMatrixReadOnly', 'm12'],['DOMMatrixReadOnly', 'm13'],['DOMMatrixReadOnly', 'm14'],['DOMMatrixReadOnly', 'm21'],['DOMMatrixReadOnly', 'm22'],['DOMMatrixReadOnly', 'm23'],['DOMMatrixReadOnly', 'm24'],['DOMMatrixReadOnly', 'm31'],['DOMMatrixReadOnly', 'm32'],['DOMMatrixReadOnly', 'm33'],['DOMMatrixReadOnly', 'm34'],['DOMMatrixReadOnly', 'm41'],['DOMMatrixReadOnly', 'm42'],['DOMMatrixReadOnly', 'm43'],['DOMMatrixReadOnly', 'm44'],['DOMMatrixReadOnly', 'is2D'],['DOMMatrixReadOnly', 'isIdentity'],['DOMException', 'code'],['DOMException', 'name'],['DOMException', 'message'],['DOMError', 'name'],['DOMError', 'message'],['CustomEvent', 'detail'],['CountQueuingStrategy', 'highWaterMark'],['CountQueuingStrategy', 'size'],['ConvolverNode', 'buffer'],['ConvolverNode', 'normalize'],['ConstantSourceNode', 'offset'],['CompressionStream', 'readable'],['CompressionStream', 'writable'],['CompositionEvent', 'data'],['CloseEvent', 'wasClean'],['CloseEvent', 'code'],['CloseEvent', 'reason'],['ClipboardEvent', 'clipboardData'],['CharacterData', 'data'],['CharacterData', 'length'],['CharacterData', 'previousElementSibling'],['CharacterData', 'nextElementSibling'],['CanvasRenderingContext2D', 'canvas'],['CanvasRenderingContext2D', 'globalAlpha'],['CanvasRenderingContext2D', 'globalCompositeOperation'],['CanvasRenderingContext2D', 'filter'],['CanvasRenderingContext2D', 'imageSmoothingEnabled'],['CanvasRenderingContext2D', 'imageSmoothingQuality'],['CanvasRenderingContext2D', 'strokeStyle'],['CanvasRenderingContext2D', 'fillStyle'],['CanvasRenderingContext2D', 'shadowOffsetX'],['CanvasRenderingContext2D', 'shadowOffsetY'],['CanvasRenderingContext2D', 'shadowBlur'],['CanvasRenderingContext2D', 'shadowColor'],['CanvasRenderingContext2D', 'lineWidth'],['CanvasRenderingContext2D', 'lineCap'],['CanvasRenderingContext2D', 'lineJoin'],['CanvasRenderingContext2D', 'miterLimit'],['CanvasRenderingContext2D', 'lineDashOffset'],['CanvasRenderingContext2D', 'font'],['CanvasRenderingContext2D', 'textAlign'],['CanvasRenderingContext2D', 'textBaseline'],['CanvasRenderingContext2D', 'direction'],['CanvasCaptureMediaStreamTrack', 'canvas'],['CSSVariableReferenceValue', 'variable'],['CSSVariableReferenceValue', 'fallback'],['CSSTransformComponent', 'is2D'],['CSSStyleSheet', 'ownerRule'],['CSSStyleSheet', 'cssRules'],['CSSStyleSheet', 'rules'],['CSSStyleRule', 'selectorText'],['CSSStyleRule', 'style'],['CSSStyleRule', 'styleMap'],['CSSStyleDeclaration', 'cssText'],['CSSStyleDeclaration', 'length'],['CSSStyleDeclaration', 'parentRule'],['CSSStyleDeclaration', 'cssFloat'],['CSSRuleList', 'length'],['CSSRule', 'type'],['CSSRule', 'cssText'],['CSSRule', 'parentRule'],['CSSRule', 'parentStyleSheet'],['CSSPropertyRule', 'name'],['CSSPropertyRule', 'syntax'],['CSSPropertyRule', 'inherits'],['CSSPropertyRule', 'initialValue'],['CSSPageRule', 'selectorText'],['CSSPageRule', 'style'],['CSSNumericArray', 'length'],['CSSNamespaceRule', 'namespaceURI'],['CSSNamespaceRule', 'prefix'],['CSSMediaRule', 'media'],['CSSKeyframesRule', 'name'],['CSSKeyframesRule', 'cssRules'],['CSSKeyframeRule', 'keyText'],['CSSKeyframeRule', 'style'],['CSSImportRule', 'href'],['CSSImportRule', 'media'],['CSSImportRule', 'styleSheet'],['CSSGroupingRule', 'cssRules'],['CSSFontFaceRule', 'style'],['CSSCounterStyleRule', 'name'],['CSSCounterStyleRule', 'system'],['CSSCounterStyleRule', 'symbols'],['CSSCounterStyleRule', 'additiveSymbols'],['CSSCounterStyleRule', 'negative'],['CSSCounterStyleRule', 'prefix'],['CSSCounterStyleRule', 'suffix'],['CSSCounterStyleRule', 'range'],['CSSCounterStyleRule', 'pad'],['CSSCounterStyleRule', 'speakAs'],['CSSCounterStyleRule', 'fallback'],['CSSConditionRule', 'conditionText'],['ByteLengthQueuingStrategy', 'highWaterMark'],['ByteLengthQueuingStrategy', 'size'],['BroadcastChannel', 'name'],['BroadcastChannel', 'onmessage'],['BroadcastChannel', 'onmessageerror'],['BlobEvent', 'data'],['BlobEvent', 'timecode'],['Blob', 'size'],['Blob', 'type'],['BiquadFilterNode', 'type'],['BiquadFilterNode', 'frequency'],['BiquadFilterNode', 'detune'],['BiquadFilterNode', 'Q'],['BiquadFilterNode', 'gain'],['BeforeUnloadEvent', 'returnValue'],['BeforeInstallPromptEvent', 'platforms'],['BeforeInstallPromptEvent', 'userChoice'],['BatteryManager', 'charging'],['BatteryManager', 'chargingTime'],['BatteryManager', 'dischargingTime'],['BatteryManager', 'level'],['BatteryManager', 'onchargingchange'],['BatteryManager', 'onchargingtimechange'],['BatteryManager', 'ondischargingtimechange'],['BatteryManager', 'onlevelchange'],['BaseAudioContext', 'destination'],['BaseAudioContext', 'currentTime'],['BaseAudioContext', 'sampleRate'],['BaseAudioContext', 'listener'],['BaseAudioContext', 'state'],['BaseAudioContext', 'onstatechange'],['BarProp', 'visible'],['AudioWorkletNode', 'parameters'],['AudioWorkletNode', 'port'],['AudioWorkletNode', 'onprocessorerror'],['AudioScheduledSourceNode', 'onended'],['AudioProcessingEvent', 'playbackTime'],['AudioProcessingEvent', 'inputBuffer'],['AudioProcessingEvent', 'outputBuffer'],['AudioParamMap', 'size'],['AudioParam', 'value'],['AudioParam', 'automationRate'],['AudioParam', 'defaultValue'],['AudioParam', 'minValue'],['AudioParam', 'maxValue'],['AudioNode', 'context'],['AudioNode', 'numberOfInputs'],['AudioNode', 'numberOfOutputs'],['AudioNode', 'channelCount'],['AudioNode', 'channelCountMode'],['AudioNode', 'channelInterpretation'],['AudioListener', 'positionX'],['AudioListener', 'positionY'],['AudioListener', 'positionZ'],['AudioListener', 'forwardX'],['AudioListener', 'forwardY'],['AudioListener', 'forwardZ'],['AudioListener', 'upX'],['AudioListener', 'upY'],['AudioListener', 'upZ'],['AudioDestinationNode', 'maxChannelCount'],['AudioContext', 'baseLatency'],['AudioBufferSourceNode', 'buffer'],['AudioBufferSourceNode', 'playbackRate'],['AudioBufferSourceNode', 'detune'],['AudioBufferSourceNode', 'loop'],['AudioBufferSourceNode', 'loopStart'],['AudioBufferSourceNode', 'loopEnd'],['AudioBuffer', 'length'],['AudioBuffer', 'duration'],['AudioBuffer', 'sampleRate'],['AudioBuffer', 'numberOfChannels'],['Attr', 'namespaceURI'],['Attr', 'prefix'],['Attr', 'localName'],['Attr', 'name'],['Attr', 'value'],['Attr', 'ownerElement'],['Attr', 'specified'],['AnimationEvent', 'animationName'],['AnimationEvent', 'elapsedTime'],['AnimationEvent', 'pseudoElement'],['Animation', 'effect'],['Animation', 'startTime'],['Animation', 'currentTime'],['Animation', 'playbackRate'],['Animation', 'playState'],['Animation', 'pending'],['Animation', 'id'],['Animation', 'onfinish'],['Animation', 'oncancel'],['Animation', 'timeline'],['Animation', 'replaceState'],['Animation', 'onremove'],['Animation', 'finished'],['Animation', 'ready'],['AnalyserNode', 'fftSize'],['AnalyserNode', 'frequencyBinCount'],['AnalyserNode', 'minDecibels'],['AnalyserNode', 'maxDecibels'],['AnalyserNode', 'smoothingTimeConstant'],['AbstractRange', 'startContainer'],['AbstractRange', 'startOffset'],['AbstractRange', 'endContainer'],['AbstractRange', 'endOffset'],['AbstractRange', 'collapsed'],['AbortSignal', 'aborted'],['AbortSignal', 'onabort'],['AbortController', 'signal'],['AudioData', 'format'],['AudioData', 'sampleRate'],['AudioData', 'numberOfFrames'],['AudioData', 'numberOfChannels'],['AudioData', 'duration'],['AudioData', 'timestamp'],['EncodedAudioChunk', 'type'],['EncodedAudioChunk', 'timestamp'],['EncodedAudioChunk', 'byteLength'],['EncodedAudioChunk', 'duration'],['EncodedVideoChunk', 'type'],['EncodedVideoChunk', 'timestamp'],['EncodedVideoChunk', 'duration'],['EncodedVideoChunk', 'byteLength'],['ImageTrack', 'frameCount'],['ImageTrack', 'animated'],['ImageTrack', 'repetitionCount'],['ImageTrack', 'selected'],['ImageTrackList', 'length'],['ImageTrackList', 'selectedIndex'],['ImageTrackList', 'selectedTrack'],['ImageTrackList', 'ready'],['VideoColorSpace', 'primaries'],['VideoColorSpace', 'transfer'],['VideoColorSpace', 'matrix'],['VideoColorSpace', 'fullRange'],['VideoFrame', 'format'],['VideoFrame', 'timestamp'],['VideoFrame', 'duration'],['VideoFrame', 'codedWidth'],['VideoFrame', 'codedHeight'],['VideoFrame', 'codedRect'],['VideoFrame', 'visibleRect'],['VideoFrame', 'displayWidth'],['VideoFrame', 'displayHeight'],['VideoFrame', 'colorSpace'],['MediaStreamTrackGenerator', 'writable'],['MediaStreamTrackProcessor', 'readable'],['Profiler', 'sampleInterval'],['Profiler', 'stopped'],['AnimationPlaybackEvent', 'currentTime'],['AnimationPlaybackEvent', 'timelineTime'],['AnimationTimeline', 'currentTime'],['CSSAnimation', 'animationName'],['CSSTransition', 'transitionProperty'],['BackgroundFetchRecord', 'request'],['BackgroundFetchRecord', 'responseReady'],['BackgroundFetchRegistration', 'id'],['BackgroundFetchRegistration', 'uploadTotal'],['BackgroundFetchRegistration', 'uploaded'],['BackgroundFetchRegistration', 'downloadTotal'],['BackgroundFetchRegistration', 'downloaded'],['BackgroundFetchRegistration', 'result'],['BackgroundFetchRegistration', 'failureReason'],['BackgroundFetchRegistration', 'recordsAvailable'],['BackgroundFetchRegistration', 'onprogress'],['CustomStateSet', 'size'],['DelegatedInkTrailPresenter', 'presentationArea'],['DelegatedInkTrailPresenter', 'expectedImprovement'],['MediaMetadata', 'title'],['MediaMetadata', 'artist'],['MediaMetadata', 'album'],['MediaMetadata', 'artwork'],['MediaSession', 'metadata'],['MediaSession', 'playbackState'],['MediaSource', 'sourceBuffers'],['MediaSource', 'activeSourceBuffers'],['MediaSource', 'duration'],['MediaSource', 'onsourceopen'],['MediaSource', 'onsourceended'],['MediaSource', 'onsourceclose'],['MediaSource', 'readyState'],['SourceBuffer', 'mode'],['SourceBuffer', 'updating'],['SourceBuffer', 'buffered'],['SourceBuffer', 'timestampOffset'],['SourceBuffer', 'appendWindowStart'],['SourceBuffer', 'appendWindowEnd'],['SourceBuffer', 'onupdatestart'],['SourceBuffer', 'onupdate'],['SourceBuffer', 'onupdateend'],['SourceBuffer', 'onerror'],['SourceBuffer', 'onabort'],['SourceBufferList', 'length'],['SourceBufferList', 'onaddsourcebuffer'],['SourceBufferList', 'onremovesourcebuffer'],['NavigatorUAData', 'brands'],['NavigatorUAData', 'mobile'],['NavigatorUAData', 'platform'],['Notification', 'onclick'],['Notification', 'onshow'],['Notification', 'onerror'],['Notification', 'onclose'],['Notification', 'title'],['Notification', 'dir'],['Notification', 'lang'],['Notification', 'body'],['Notification', 'tag'],['Notification', 'icon'],['Notification', 'badge'],['Notification', 'vibrate'],['Notification', 'timestamp'],['Notification', 'renotify'],['Notification', 'silent'],['Notification', 'requireInteraction'],['Notification', 'data'],['Notification', 'actions'],['Notification', 'image'],['PaymentManager', 'instruments'],['PaymentManager', 'userHint'],['PermissionStatus', 'state'],['PermissionStatus', 'onchange'],['PictureInPictureEvent', 'pictureInPictureWindow'],['PictureInPictureWindow', 'width'],['PictureInPictureWindow', 'height'],['PictureInPictureWindow', 'onresize'],['PushSubscription', 'endpoint'],['PushSubscription', 'expirationTime'],['PushSubscription', 'options'],['PushSubscriptionOptions', 'userVisibleOnly'],['PushSubscriptionOptions', 'applicationServerKey'],['RemotePlayback', 'state'],['RemotePlayback', 'onconnecting'],['RemotePlayback', 'onconnect'],['RemotePlayback', 'ondisconnect'],['TaskPriorityChangeEvent', 'previousPriority'],['TaskSignal', 'priority'],['TaskSignal', 'onprioritychange'],['SharedWorker', 'port'],['SharedWorker', 'onerror'],['SpeechSynthesisErrorEvent', 'error'],['SpeechSynthesisEvent', 'utterance'],['SpeechSynthesisEvent', 'charIndex'],['SpeechSynthesisEvent', 'charLength'],['SpeechSynthesisEvent', 'elapsedTime'],['SpeechSynthesisEvent', 'name'],['SpeechSynthesisUtterance', 'text'],['SpeechSynthesisUtterance', 'lang'],['SpeechSynthesisUtterance', 'voice'],['SpeechSynthesisUtterance', 'volume'],['SpeechSynthesisUtterance', 'rate'],['SpeechSynthesisUtterance', 'pitch'],['SpeechSynthesisUtterance', 'onstart'],['SpeechSynthesisUtterance', 'onend'],['SpeechSynthesisUtterance', 'onerror'],['SpeechSynthesisUtterance', 'onpause'],['SpeechSynthesisUtterance', 'onresume'],['SpeechSynthesisUtterance', 'onmark'],['SpeechSynthesisUtterance', 'onboundary'],['TrustedTypePolicy', 'name'],['TrustedTypePolicyFactory', 'emptyHTML'],['TrustedTypePolicyFactory', 'emptyScript'],['TrustedTypePolicyFactory', 'defaultPolicy'],['VideoPlaybackQuality', 'creationTime'],['VideoPlaybackQuality', 'totalVideoFrames'],['VideoPlaybackQuality', 'droppedVideoFrames'],['VideoPlaybackQuality', 'corruptedVideoFrames'],['webkitSpeechGrammar', 'src'],['webkitSpeechGrammar', 'weight'],['webkitSpeechGrammarList', 'length'],['webkitSpeechRecognition', 'grammars'],['webkitSpeechRecognition', 'lang'],['webkitSpeechRecognition', 'continuous'],['webkitSpeechRecognition', 'interimResults'],['webkitSpeechRecognition', 'maxAlternatives'],['webkitSpeechRecognition', 'onaudiostart'],['webkitSpeechRecognition', 'onsoundstart'],['webkitSpeechRecognition', 'onspeechstart'],['webkitSpeechRecognition', 'onspeechend'],['webkitSpeechRecognition', 'onsoundend'],['webkitSpeechRecognition', 'onaudioend'],['webkitSpeechRecognition', 'onresult'],['webkitSpeechRecognition', 'onnomatch'],['webkitSpeechRecognition', 'onerror'],['webkitSpeechRecognition', 'onstart'],['webkitSpeechRecognition', 'onend'],['webkitSpeechRecognitionError', 'error'],['webkitSpeechRecognitionError', 'message'],['webkitSpeechRecognitionEvent', 'resultIndex'],['webkitSpeechRecognitionEvent', 'results']]

var funcs = [['FinalizationRegistry', 'register'],['FinalizationRegistry', 'unregister'],['WeakRef', 'deref'],['Image', 'decode'],['webkitURL', 'toJSON'],['webkitURL', 'toString'],['webkitRTCPeerConnection', 'addIceCandidate'],['webkitRTCPeerConnection', 'addStream'],['webkitRTCPeerConnection', 'addTrack'],['webkitRTCPeerConnection', 'addTransceiver'],['webkitRTCPeerConnection', 'close'],['webkitRTCPeerConnection', 'createAnswer'],['webkitRTCPeerConnection', 'createDTMFSender'],['webkitRTCPeerConnection', 'createDataChannel'],['webkitRTCPeerConnection', 'createOffer'],['webkitRTCPeerConnection', 'getConfiguration'],['webkitRTCPeerConnection', 'getLocalStreams'],['webkitRTCPeerConnection', 'getReceivers'],['webkitRTCPeerConnection', 'getRemoteStreams'],['webkitRTCPeerConnection', 'getSenders'],['webkitRTCPeerConnection', 'getStats'],['webkitRTCPeerConnection', 'getTransceivers'],['webkitRTCPeerConnection', 'removeStream'],['webkitRTCPeerConnection', 'removeTrack'],['webkitRTCPeerConnection', 'restartIce'],['webkitRTCPeerConnection', 'setConfiguration'],['webkitRTCPeerConnection', 'setLocalDescription'],['webkitRTCPeerConnection', 'setRemoteDescription'],['webkitMediaStream', 'addTrack'],['webkitMediaStream', 'clone'],['webkitMediaStream', 'getAudioTracks'],['webkitMediaStream', 'getTrackById'],['webkitMediaStream', 'getTracks'],['webkitMediaStream', 'getVideoTracks'],['webkitMediaStream', 'removeTrack'],['WebKitMutationObserver', 'disconnect'],['WebKitMutationObserver', 'observe'],['WebKitMutationObserver', 'takeRecords'],['XPathResult', 'iterateNext'],['XPathResult', 'snapshotItem'],['XPathExpression', 'evaluate'],['XPathEvaluator', 'createExpression'],['XPathEvaluator', 'createNSResolver'],['XPathEvaluator', 'evaluate'],['XMLSerializer', 'serializeToString'],
    ['XMLHttpRequest', 'abort'],
    ['XMLHttpRequest', 'getAllResponseHeaders'],
    ['XMLHttpRequest', 'getResponseHeader'],
    ['XMLHttpRequest', 'open'],
    ['XMLHttpRequest', 'overrideMimeType'],
    ['XMLHttpRequest', 'send'],
    ['XMLHttpRequest', 'setRequestHeader'],
    ['WritableStreamDefaultWriter', 'abort'],['WritableStreamDefaultWriter', 'close'],['WritableStreamDefaultWriter', 'releaseLock'],['WritableStreamDefaultWriter', 'write'],['WritableStreamDefaultController', 'error'],['WritableStream', 'abort'],['WritableStream', 'close'],['WritableStream', 'getWriter'],['Worker', 'postMessage'],['Worker', 'terminate'],['WebSocket', 'close'],['WebSocket', 'send'],['WebGLRenderingContext', 'activeTexture'],['WebGLRenderingContext', 'attachShader'],['WebGLRenderingContext', 'bindAttribLocation'],['WebGLRenderingContext', 'bindRenderbuffer'],['WebGLRenderingContext', 'blendColor'],['WebGLRenderingContext', 'blendEquation'],['WebGLRenderingContext', 'blendEquationSeparate'],['WebGLRenderingContext', 'blendFunc'],['WebGLRenderingContext', 'blendFuncSeparate'],['WebGLRenderingContext', 'bufferData'],['WebGLRenderingContext', 'bufferSubData'],['WebGLRenderingContext', 'checkFramebufferStatus'],['WebGLRenderingContext', 'compileShader'],['WebGLRenderingContext', 'compressedTexImage2D'],['WebGLRenderingContext', 'compressedTexSubImage2D'],['WebGLRenderingContext', 'copyTexImage2D'],['WebGLRenderingContext', 'copyTexSubImage2D'],['WebGLRenderingContext', 'createBuffer'],['WebGLRenderingContext', 'createFramebuffer'],['WebGLRenderingContext', 'createProgram'],['WebGLRenderingContext', 'createRenderbuffer'],['WebGLRenderingContext', 'createShader'],['WebGLRenderingContext', 'createTexture'],['WebGLRenderingContext', 'cullFace'],['WebGLRenderingContext', 'deleteBuffer'],['WebGLRenderingContext', 'deleteFramebuffer'],['WebGLRenderingContext', 'deleteProgram'],['WebGLRenderingContext', 'deleteRenderbuffer'],['WebGLRenderingContext', 'deleteShader'],['WebGLRenderingContext', 'deleteTexture'],['WebGLRenderingContext', 'depthFunc'],['WebGLRenderingContext', 'depthMask'],['WebGLRenderingContext', 'depthRange'],['WebGLRenderingContext', 'detachShader'],['WebGLRenderingContext', 'disable'],['WebGLRenderingContext', 'enable'],['WebGLRenderingContext', 'finish'],['WebGLRenderingContext', 'flush'],['WebGLRenderingContext', 'framebufferRenderbuffer'],['WebGLRenderingContext', 'framebufferTexture2D'],['WebGLRenderingContext', 'frontFace'],['WebGLRenderingContext', 'generateMipmap'],['WebGLRenderingContext', 'getActiveAttrib'],['WebGLRenderingContext', 'getActiveUniform'],['WebGLRenderingContext', 'getAttachedShaders'],['WebGLRenderingContext', 'getAttribLocation'],['WebGLRenderingContext', 'getBufferParameter'],['WebGLRenderingContext', 'getContextAttributes'],['WebGLRenderingContext', 'getError'],['WebGLRenderingContext', 'getExtension'],['WebGLRenderingContext', 'getFramebufferAttachmentParameter'],['WebGLRenderingContext', 'getParameter'],['WebGLRenderingContext', 'getProgramInfoLog'],['WebGLRenderingContext', 'getProgramParameter'],['WebGLRenderingContext', 'getRenderbufferParameter'],['WebGLRenderingContext', 'getShaderInfoLog'],['WebGLRenderingContext', 'getShaderParameter'],['WebGLRenderingContext', 'getShaderPrecisionFormat'],['WebGLRenderingContext', 'getShaderSource'],['WebGLRenderingContext', 'getSupportedExtensions'],['WebGLRenderingContext', 'getTexParameter'],['WebGLRenderingContext', 'getUniform'],['WebGLRenderingContext', 'getUniformLocation'],['WebGLRenderingContext', 'getVertexAttrib'],['WebGLRenderingContext', 'getVertexAttribOffset'],['WebGLRenderingContext', 'hint'],['WebGLRenderingContext', 'isBuffer'],['WebGLRenderingContext', 'isContextLost'],['WebGLRenderingContext', 'isEnabled'],['WebGLRenderingContext', 'isFramebuffer'],['WebGLRenderingContext', 'isProgram'],['WebGLRenderingContext', 'isRenderbuffer'],['WebGLRenderingContext', 'isShader'],['WebGLRenderingContext', 'isTexture'],['WebGLRenderingContext', 'lineWidth'],['WebGLRenderingContext', 'linkProgram'],['WebGLRenderingContext', 'pixelStorei'],['WebGLRenderingContext', 'polygonOffset'],['WebGLRenderingContext', 'readPixels'],['WebGLRenderingContext', 'renderbufferStorage'],['WebGLRenderingContext', 'sampleCoverage'],['WebGLRenderingContext', 'shaderSource'],['WebGLRenderingContext', 'stencilFunc'],['WebGLRenderingContext', 'stencilFuncSeparate'],['WebGLRenderingContext', 'stencilMask'],['WebGLRenderingContext', 'stencilMaskSeparate'],['WebGLRenderingContext', 'stencilOp'],['WebGLRenderingContext', 'stencilOpSeparate'],['WebGLRenderingContext', 'texImage2D'],['WebGLRenderingContext', 'texParameterf'],['WebGLRenderingContext', 'texParameteri'],['WebGLRenderingContext', 'texSubImage2D'],['WebGLRenderingContext', 'uniform1fv'],['WebGLRenderingContext', 'uniform1iv'],['WebGLRenderingContext', 'uniform2fv'],['WebGLRenderingContext', 'uniform2iv'],['WebGLRenderingContext', 'uniform3fv'],['WebGLRenderingContext', 'uniform3iv'],['WebGLRenderingContext', 'uniform4fv'],['WebGLRenderingContext', 'uniform4iv'],['WebGLRenderingContext', 'uniformMatrix2fv'],['WebGLRenderingContext', 'uniformMatrix3fv'],['WebGLRenderingContext', 'uniformMatrix4fv'],['WebGLRenderingContext', 'useProgram'],['WebGLRenderingContext', 'validateProgram'],['WebGLRenderingContext', 'vertexAttrib1fv'],['WebGLRenderingContext', 'vertexAttrib2fv'],['WebGLRenderingContext', 'vertexAttrib3fv'],['WebGLRenderingContext', 'vertexAttrib4fv'],['WebGLRenderingContext', 'vertexAttribPointer'],['WebGLRenderingContext', 'bindBuffer'],['WebGLRenderingContext', 'bindFramebuffer'],['WebGLRenderingContext', 'bindTexture'],['WebGLRenderingContext', 'clear'],['WebGLRenderingContext', 'clearColor'],['WebGLRenderingContext', 'clearDepth'],['WebGLRenderingContext', 'clearStencil'],['WebGLRenderingContext', 'colorMask'],['WebGLRenderingContext', 'disableVertexAttribArray'],['WebGLRenderingContext', 'drawArrays'],['WebGLRenderingContext', 'drawElements'],['WebGLRenderingContext', 'enableVertexAttribArray'],['WebGLRenderingContext', 'scissor'],['WebGLRenderingContext', 'uniform1f'],['WebGLRenderingContext', 'uniform1i'],['WebGLRenderingContext', 'uniform2f'],['WebGLRenderingContext', 'uniform2i'],['WebGLRenderingContext', 'uniform3f'],['WebGLRenderingContext', 'uniform3i'],['WebGLRenderingContext', 'uniform4f'],['WebGLRenderingContext', 'uniform4i'],['WebGLRenderingContext', 'vertexAttrib1f'],['WebGLRenderingContext', 'vertexAttrib2f'],['WebGLRenderingContext', 'vertexAttrib3f'],['WebGLRenderingContext', 'vertexAttrib4f'],['WebGLRenderingContext', 'viewport'],['WebGL2RenderingContext', 'activeTexture'],['WebGL2RenderingContext', 'attachShader'],['WebGL2RenderingContext', 'beginQuery'],['WebGL2RenderingContext', 'beginTransformFeedback'],['WebGL2RenderingContext', 'bindAttribLocation'],['WebGL2RenderingContext', 'bindBufferBase'],['WebGL2RenderingContext', 'bindBufferRange'],['WebGL2RenderingContext', 'bindRenderbuffer'],['WebGL2RenderingContext', 'bindSampler'],['WebGL2RenderingContext', 'bindTransformFeedback'],['WebGL2RenderingContext', 'bindVertexArray'],['WebGL2RenderingContext', 'blendColor'],['WebGL2RenderingContext', 'blendEquation'],['WebGL2RenderingContext', 'blendEquationSeparate'],['WebGL2RenderingContext', 'blendFunc'],['WebGL2RenderingContext', 'blendFuncSeparate'],['WebGL2RenderingContext', 'blitFramebuffer'],['WebGL2RenderingContext', 'bufferData'],['WebGL2RenderingContext', 'bufferSubData'],['WebGL2RenderingContext', 'checkFramebufferStatus'],['WebGL2RenderingContext', 'clearBufferfi'],['WebGL2RenderingContext', 'clearBufferfv'],['WebGL2RenderingContext', 'clearBufferiv'],['WebGL2RenderingContext', 'clearBufferuiv'],['WebGL2RenderingContext', 'clientWaitSync'],['WebGL2RenderingContext', 'compileShader'],['WebGL2RenderingContext', 'compressedTexImage2D'],['WebGL2RenderingContext', 'compressedTexImage3D'],['WebGL2RenderingContext', 'compressedTexSubImage2D'],['WebGL2RenderingContext', 'compressedTexSubImage3D'],['WebGL2RenderingContext', 'copyBufferSubData'],['WebGL2RenderingContext', 'copyTexImage2D'],['WebGL2RenderingContext', 'copyTexSubImage2D'],['WebGL2RenderingContext', 'copyTexSubImage3D'],['WebGL2RenderingContext', 'createBuffer'],['WebGL2RenderingContext', 'createFramebuffer'],['WebGL2RenderingContext', 'createProgram'],['WebGL2RenderingContext', 'createQuery'],['WebGL2RenderingContext', 'createRenderbuffer'],['WebGL2RenderingContext', 'createSampler'],['WebGL2RenderingContext', 'createShader'],['WebGL2RenderingContext', 'createTexture'],['WebGL2RenderingContext', 'createTransformFeedback'],['WebGL2RenderingContext', 'createVertexArray'],['WebGL2RenderingContext', 'cullFace'],['WebGL2RenderingContext', 'deleteBuffer'],['WebGL2RenderingContext', 'deleteFramebuffer'],['WebGL2RenderingContext', 'deleteProgram'],['WebGL2RenderingContext', 'deleteQuery'],['WebGL2RenderingContext', 'deleteRenderbuffer'],['WebGL2RenderingContext', 'deleteSampler'],['WebGL2RenderingContext', 'deleteShader'],['WebGL2RenderingContext', 'deleteSync'],['WebGL2RenderingContext', 'deleteTexture'],['WebGL2RenderingContext', 'deleteTransformFeedback'],['WebGL2RenderingContext', 'deleteVertexArray'],['WebGL2RenderingContext', 'depthFunc'],['WebGL2RenderingContext', 'depthMask'],['WebGL2RenderingContext', 'depthRange'],['WebGL2RenderingContext', 'detachShader'],['WebGL2RenderingContext', 'disable'],['WebGL2RenderingContext', 'drawArraysInstanced'],['WebGL2RenderingContext', 'drawBuffers'],['WebGL2RenderingContext', 'drawElementsInstanced'],['WebGL2RenderingContext', 'drawRangeElements'],['WebGL2RenderingContext', 'enable'],['WebGL2RenderingContext', 'endQuery'],['WebGL2RenderingContext', 'endTransformFeedback'],['WebGL2RenderingContext', 'fenceSync'],['WebGL2RenderingContext', 'finish'],['WebGL2RenderingContext', 'flush'],['WebGL2RenderingContext', 'framebufferRenderbuffer'],['WebGL2RenderingContext', 'framebufferTexture2D'],['WebGL2RenderingContext', 'framebufferTextureLayer'],['WebGL2RenderingContext', 'frontFace'],['WebGL2RenderingContext', 'generateMipmap'],['WebGL2RenderingContext', 'getActiveAttrib'],['WebGL2RenderingContext', 'getActiveUniform'],['WebGL2RenderingContext', 'getActiveUniformBlockName'],['WebGL2RenderingContext', 'getActiveUniformBlockParameter'],['WebGL2RenderingContext', 'getActiveUniforms'],['WebGL2RenderingContext', 'getAttachedShaders'],['WebGL2RenderingContext', 'getAttribLocation'],['WebGL2RenderingContext', 'getBufferParameter'],['WebGL2RenderingContext', 'getBufferSubData'],['WebGL2RenderingContext', 'getContextAttributes'],['WebGL2RenderingContext', 'getError'],['WebGL2RenderingContext', 'getExtension'],['WebGL2RenderingContext', 'getFragDataLocation'],['WebGL2RenderingContext', 'getFramebufferAttachmentParameter'],['WebGL2RenderingContext', 'getIndexedParameter'],['WebGL2RenderingContext', 'getInternalformatParameter'],['WebGL2RenderingContext', 'getParameter'],['WebGL2RenderingContext', 'getProgramInfoLog'],['WebGL2RenderingContext', 'getProgramParameter'],['WebGL2RenderingContext', 'getQuery'],['WebGL2RenderingContext', 'getQueryParameter'],['WebGL2RenderingContext', 'getRenderbufferParameter'],['WebGL2RenderingContext', 'getSamplerParameter'],['WebGL2RenderingContext', 'getShaderInfoLog'],['WebGL2RenderingContext', 'getShaderParameter'],['WebGL2RenderingContext', 'getShaderPrecisionFormat'],['WebGL2RenderingContext', 'getShaderSource'],['WebGL2RenderingContext', 'getSupportedExtensions'],['WebGL2RenderingContext', 'getSyncParameter'],['WebGL2RenderingContext', 'getTexParameter'],['WebGL2RenderingContext', 'getTransformFeedbackVarying'],['WebGL2RenderingContext', 'getUniform'],['WebGL2RenderingContext', 'getUniformBlockIndex'],['WebGL2RenderingContext', 'getUniformIndices'],['WebGL2RenderingContext', 'getUniformLocation'],['WebGL2RenderingContext', 'getVertexAttrib'],['WebGL2RenderingContext', 'getVertexAttribOffset'],['WebGL2RenderingContext', 'hint'],['WebGL2RenderingContext', 'invalidateFramebuffer'],['WebGL2RenderingContext', 'invalidateSubFramebuffer'],['WebGL2RenderingContext', 'isBuffer'],['WebGL2RenderingContext', 'isContextLost'],['WebGL2RenderingContext', 'isEnabled'],['WebGL2RenderingContext', 'isFramebuffer'],['WebGL2RenderingContext', 'isProgram'],['WebGL2RenderingContext', 'isQuery'],['WebGL2RenderingContext', 'isRenderbuffer'],['WebGL2RenderingContext', 'isSampler'],['WebGL2RenderingContext', 'isShader'],['WebGL2RenderingContext', 'isSync'],['WebGL2RenderingContext', 'isTexture'],['WebGL2RenderingContext', 'isTransformFeedback'],['WebGL2RenderingContext', 'isVertexArray'],['WebGL2RenderingContext', 'lineWidth'],['WebGL2RenderingContext', 'linkProgram'],['WebGL2RenderingContext', 'pauseTransformFeedback'],['WebGL2RenderingContext', 'pixelStorei'],['WebGL2RenderingContext', 'polygonOffset'],['WebGL2RenderingContext', 'readBuffer'],['WebGL2RenderingContext', 'readPixels'],['WebGL2RenderingContext', 'renderbufferStorage'],['WebGL2RenderingContext', 'renderbufferStorageMultisample'],['WebGL2RenderingContext', 'resumeTransformFeedback'],['WebGL2RenderingContext', 'sampleCoverage'],['WebGL2RenderingContext', 'samplerParameterf'],['WebGL2RenderingContext', 'samplerParameteri'],['WebGL2RenderingContext', 'shaderSource'],['WebGL2RenderingContext', 'stencilFunc'],['WebGL2RenderingContext', 'stencilFuncSeparate'],['WebGL2RenderingContext', 'stencilMask'],['WebGL2RenderingContext', 'stencilMaskSeparate'],['WebGL2RenderingContext', 'stencilOp'],['WebGL2RenderingContext', 'stencilOpSeparate'],['WebGL2RenderingContext', 'texImage2D'],['WebGL2RenderingContext', 'texImage3D'],['WebGL2RenderingContext', 'texParameterf'],['WebGL2RenderingContext', 'texParameteri'],['WebGL2RenderingContext', 'texStorage2D'],['WebGL2RenderingContext', 'texStorage3D'],['WebGL2RenderingContext', 'texSubImage2D'],['WebGL2RenderingContext', 'texSubImage3D'],['WebGL2RenderingContext', 'transformFeedbackVaryings'],['WebGL2RenderingContext', 'uniform1fv'],['WebGL2RenderingContext', 'uniform1iv'],['WebGL2RenderingContext', 'uniform1ui'],['WebGL2RenderingContext', 'uniform1uiv'],['WebGL2RenderingContext', 'uniform2fv'],['WebGL2RenderingContext', 'uniform2iv'],['WebGL2RenderingContext', 'uniform2ui'],['WebGL2RenderingContext', 'uniform2uiv'],['WebGL2RenderingContext', 'uniform3fv'],['WebGL2RenderingContext', 'uniform3iv'],['WebGL2RenderingContext', 'uniform3ui'],['WebGL2RenderingContext', 'uniform3uiv'],['WebGL2RenderingContext', 'uniform4fv'],['WebGL2RenderingContext', 'uniform4iv'],['WebGL2RenderingContext', 'uniform4ui'],['WebGL2RenderingContext', 'uniform4uiv'],['WebGL2RenderingContext', 'uniformBlockBinding'],['WebGL2RenderingContext', 'uniformMatrix2fv'],['WebGL2RenderingContext', 'uniformMatrix2x3fv'],['WebGL2RenderingContext', 'uniformMatrix2x4fv'],['WebGL2RenderingContext', 'uniformMatrix3fv'],['WebGL2RenderingContext', 'uniformMatrix3x2fv'],['WebGL2RenderingContext', 'uniformMatrix3x4fv'],['WebGL2RenderingContext', 'uniformMatrix4fv'],['WebGL2RenderingContext', 'uniformMatrix4x2fv'],['WebGL2RenderingContext', 'uniformMatrix4x3fv'],['WebGL2RenderingContext', 'useProgram'],['WebGL2RenderingContext', 'validateProgram'],['WebGL2RenderingContext', 'vertexAttrib1fv'],['WebGL2RenderingContext', 'vertexAttrib2fv'],['WebGL2RenderingContext', 'vertexAttrib3fv'],['WebGL2RenderingContext', 'vertexAttrib4fv'],['WebGL2RenderingContext', 'vertexAttribDivisor'],['WebGL2RenderingContext', 'vertexAttribI4i'],['WebGL2RenderingContext', 'vertexAttribI4iv'],['WebGL2RenderingContext', 'vertexAttribI4ui'],['WebGL2RenderingContext', 'vertexAttribI4uiv'],['WebGL2RenderingContext', 'vertexAttribIPointer'],['WebGL2RenderingContext', 'vertexAttribPointer'],['WebGL2RenderingContext', 'waitSync'],['WebGL2RenderingContext', 'bindBuffer'],['WebGL2RenderingContext', 'bindFramebuffer'],['WebGL2RenderingContext', 'bindTexture'],['WebGL2RenderingContext', 'clear'],['WebGL2RenderingContext', 'clearColor'],['WebGL2RenderingContext', 'clearDepth'],['WebGL2RenderingContext', 'clearStencil'],['WebGL2RenderingContext', 'colorMask'],['WebGL2RenderingContext', 'disableVertexAttribArray'],['WebGL2RenderingContext', 'drawArrays'],['WebGL2RenderingContext', 'drawElements'],['WebGL2RenderingContext', 'enableVertexAttribArray'],['WebGL2RenderingContext', 'scissor'],['WebGL2RenderingContext', 'uniform1f'],['WebGL2RenderingContext', 'uniform1i'],['WebGL2RenderingContext', 'uniform2f'],['WebGL2RenderingContext', 'uniform2i'],['WebGL2RenderingContext', 'uniform3f'],['WebGL2RenderingContext', 'uniform3i'],['WebGL2RenderingContext', 'uniform4f'],['WebGL2RenderingContext', 'uniform4i'],['WebGL2RenderingContext', 'vertexAttrib1f'],['WebGL2RenderingContext', 'vertexAttrib2f'],['WebGL2RenderingContext', 'vertexAttrib3f'],['WebGL2RenderingContext', 'vertexAttrib4f'],['WebGL2RenderingContext', 'viewport'],['VTTCue', 'getCueAsHTML'],['URLSearchParams', 'append'],['URLSearchParams', 'get'],['URLSearchParams', 'getAll'],['URLSearchParams', 'has'],['URLSearchParams', 'set'],['URLSearchParams', 'sort'],['URLSearchParams', 'toString'],['URLSearchParams', 'entries'],['URLSearchParams', 'forEach'],['URLSearchParams', 'keys'],['URLSearchParams', 'values'],['URL', 'toJSON'],['URL', 'toString'],['UIEvent', 'initUIEvent'],['TreeWalker', 'firstChild'],['TreeWalker', 'lastChild'],['TreeWalker', 'nextNode'],['TreeWalker', 'nextSibling'],['TreeWalker', 'parentNode'],['TreeWalker', 'previousNode'],['TreeWalker', 'previousSibling'],['TouchList', 'item'],['TimeRanges', 'end'],['TimeRanges', 'start'],['TextTrackList', 'getTrackById'],['TextTrackCueList', 'getCueById'],['TextTrack', 'addCue'],['TextTrack', 'removeCue'],['TextEvent', 'initTextEvent'],['TextEncoder', 'encode'],['TextEncoder', 'encodeInto'],['TextDecoder', 'decode'],['Text', 'splitText'],['TaskAttributionTiming', 'toJSON'],['SyncManager', 'getTags'],['SyncManager', 'register'],['StyleSheetList', 'item'],['StylePropertyMapReadOnly', 'get'],['StylePropertyMapReadOnly', 'getAll'],['StylePropertyMapReadOnly', 'has'],['StylePropertyMapReadOnly', 'entries'],['StylePropertyMapReadOnly', 'forEach'],['StylePropertyMapReadOnly', 'keys'],['StylePropertyMapReadOnly', 'values'],['StylePropertyMap', 'append'],['StylePropertyMap', 'clear'],['StylePropertyMap', 'set'],['StorageEvent', 'initStorageEvent'],['Storage', 'clear'],['Storage', 'getItem'],['Storage', 'key'],['Storage', 'removeItem'],['Storage', 'setItem'],['ShadowRoot', 'elementFromPoint'],['ShadowRoot', 'elementsFromPoint'],['ShadowRoot', 'getSelection'],['ShadowRoot', 'getAnimations'],['ShadowRoot', 'getInnerHTML'],['Selection', 'addRange'],['Selection', 'collapse'],['Selection', 'collapseToEnd'],['Selection', 'collapseToStart'],['Selection', 'containsNode'],['Selection', 'deleteFromDocument'],['Selection', 'empty'],['Selection', 'extend'],['Selection', 'getRangeAt'],['Selection', 'modify'],['Selection', 'removeAllRanges'],['Selection', 'removeRange'],['Selection', 'selectAllChildren'],['Selection', 'setBaseAndExtent'],['Selection', 'setPosition'],['Selection', 'toString'],['ScreenOrientation', 'lock'],['ScreenOrientation', 'unlock'],['SVGTransformList', 'appendItem'],['SVGTransformList', 'clear'],['SVGTransformList', 'consolidate'],['SVGTransformList', 'createSVGTransformFromMatrix'],['SVGTransformList', 'getItem'],['SVGTransformList', 'initialize'],['SVGTransformList', 'insertItemBefore'],['SVGTransformList', 'removeItem'],['SVGTransformList', 'replaceItem'],['SVGTransform', 'setMatrix'],['SVGTransform', 'setRotate'],['SVGTransform', 'setScale'],['SVGTransform', 'setSkewX'],['SVGTransform', 'setSkewY'],['SVGTransform', 'setTranslate'],['SVGTextContentElement', 'getCharNumAtPosition'],['SVGTextContentElement', 'getComputedTextLength'],['SVGTextContentElement', 'getEndPositionOfChar'],['SVGTextContentElement', 'getExtentOfChar'],['SVGTextContentElement', 'getNumberOfChars'],['SVGTextContentElement', 'getRotationOfChar'],['SVGTextContentElement', 'getStartPositionOfChar'],['SVGTextContentElement', 'getSubStringLength'],['SVGTextContentElement', 'selectSubString'],['SVGStringList', 'appendItem'],['SVGStringList', 'clear'],['SVGStringList', 'getItem'],['SVGStringList', 'initialize'],['SVGStringList', 'insertItemBefore'],['SVGStringList', 'removeItem'],['SVGStringList', 'replaceItem'],['SVGSVGElement', 'animationsPaused'],['SVGSVGElement', 'checkEnclosure'],['SVGSVGElement', 'checkIntersection'],['SVGSVGElement', 'createSVGAngle'],['SVGSVGElement', 'createSVGLength'],['SVGSVGElement', 'createSVGMatrix'],['SVGSVGElement', 'createSVGNumber'],['SVGSVGElement', 'createSVGPoint'],['SVGSVGElement', 'createSVGRect'],['SVGSVGElement', 'createSVGTransform'],['SVGSVGElement', 'createSVGTransformFromMatrix'],['SVGSVGElement', 'deselectAll'],['SVGSVGElement', 'forceRedraw'],['SVGSVGElement', 'getCurrentTime'],['SVGSVGElement', 'getElementById'],['SVGSVGElement', 'getEnclosureList'],['SVGSVGElement', 'getIntersectionList'],['SVGSVGElement', 'pauseAnimations'],['SVGSVGElement', 'setCurrentTime'],['SVGSVGElement', 'suspendRedraw'],['SVGSVGElement', 'unpauseAnimations'],['SVGSVGElement', 'unsuspendRedraw'],['SVGSVGElement', 'unsuspendRedrawAll'],['SVGPointList', 'appendItem'],['SVGPointList', 'clear'],['SVGPointList', 'getItem'],['SVGPointList', 'initialize'],['SVGPointList', 'insertItemBefore'],['SVGPointList', 'removeItem'],['SVGPointList', 'replaceItem'],['SVGPoint', 'matrixTransform'],['SVGNumberList', 'appendItem'],['SVGNumberList', 'clear'],['SVGNumberList', 'getItem'],['SVGNumberList', 'initialize'],['SVGNumberList', 'insertItemBefore'],['SVGNumberList', 'removeItem'],['SVGNumberList', 'replaceItem'],['SVGMatrix', 'flipX'],['SVGMatrix', 'flipY'],['SVGMatrix', 'inverse'],['SVGMatrix', 'multiply'],['SVGMatrix', 'rotate'],['SVGMatrix', 'rotateFromVector'],['SVGMatrix', 'scale'],['SVGMatrix', 'scaleNonUniform'],['SVGMatrix', 'skewX'],['SVGMatrix', 'skewY'],['SVGMatrix', 'translate'],['SVGMarkerElement', 'setOrientToAngle'],['SVGMarkerElement', 'setOrientToAuto'],['SVGLengthList', 'appendItem'],['SVGLengthList', 'clear'],['SVGLengthList', 'getItem'],['SVGLengthList', 'initialize'],['SVGLengthList', 'insertItemBefore'],['SVGLengthList', 'removeItem'],['SVGLengthList', 'replaceItem'],['SVGLength', 'convertToSpecifiedUnits'],['SVGLength', 'newValueSpecifiedUnits'],['SVGImageElement', 'decode'],['SVGGraphicsElement', 'getBBox'],['SVGGraphicsElement', 'getCTM'],['SVGGraphicsElement', 'getScreenCTM'],['SVGGeometryElement', 'getPointAtLength'],['SVGGeometryElement', 'getTotalLength'],['SVGGeometryElement', 'isPointInFill'],['SVGGeometryElement', 'isPointInStroke'],['SVGFEGaussianBlurElement', 'setStdDeviation'],['SVGFEDropShadowElement', 'setStdDeviation'],['SVGElement', 'blur'],['SVGElement', 'focus'],['SVGAnimationElement', 'beginElement'],['SVGAnimationElement', 'beginElementAt'],['SVGAnimationElement', 'endElement'],['SVGAnimationElement', 'endElementAt'],['SVGAnimationElement', 'getCurrentTime'],['SVGAnimationElement', 'getSimpleDuration'],['SVGAnimationElement', 'getStartTime'],['SVGAngle', 'convertToSpecifiedUnits'],['SVGAngle', 'newValueSpecifiedUnits'],['Response', 'arrayBuffer'],['Response', 'blob'],['Response', 'clone'],['Response', 'formData'],['Response', 'json'],['Response', 'text'],['ResizeObserver', 'disconnect'],['ResizeObserver', 'observe'],['ResizeObserver', 'unobserve'],['Request', 'arrayBuffer'],['Request', 'blob'],['Request', 'clone'],['Request', 'formData'],['Request', 'json'],['Request', 'text'],['ReportingObserver', 'disconnect'],['ReportingObserver', 'observe'],['ReportingObserver', 'takeRecords'],['ReadableStreamDefaultReader', 'cancel'],['ReadableStreamDefaultReader', 'read'],['ReadableStreamDefaultReader', 'releaseLock'],['ReadableStreamDefaultController', 'close'],['ReadableStreamDefaultController', 'enqueue'],['ReadableStreamDefaultController', 'error'],['ReadableStreamBYOBRequest', 'respond'],['ReadableStreamBYOBRequest', 'respondWithNewView'],['ReadableStreamBYOBReader', 'cancel'],['ReadableStreamBYOBReader', 'read'],['ReadableStreamBYOBReader', 'releaseLock'],['ReadableStream', 'cancel'],['ReadableStream', 'getReader'],['ReadableStream', 'pipeThrough'],['ReadableStream', 'pipeTo'],['ReadableStream', 'tee'],['ReadableByteStreamController', 'close'],['ReadableByteStreamController', 'enqueue'],['ReadableByteStreamController', 'error'],['Range', 'cloneContents'],['Range', 'cloneRange'],['Range', 'collapse'],['Range', 'compareBoundaryPoints'],['Range', 'comparePoint'],['Range', 'createContextualFragment'],['Range', 'deleteContents'],['Range', 'detach'],['Range', 'expand'],['Range', 'extractContents'],['Range', 'getBoundingClientRect'],['Range', 'getClientRects'],['Range', 'insertNode'],['Range', 'intersectsNode'],['Range', 'isPointInRange'],['Range', 'selectNode'],['Range', 'selectNodeContents'],['Range', 'setEnd'],['Range', 'setEndAfter'],['Range', 'setEndBefore'],['Range', 'setStart'],['Range', 'setStartAfter'],['Range', 'setStartBefore'],['Range', 'surroundContents'],['Range', 'toString'],['RTCStatsReport', 'entries'],['RTCStatsReport', 'forEach'],['RTCStatsReport', 'get'],['RTCStatsReport', 'has'],['RTCStatsReport', 'keys'],['RTCStatsReport', 'values'],['RTCSessionDescription', 'toJSON'],['RTCRtpTransceiver', 'setCodecPreferences'],['RTCRtpTransceiver', 'stop'],['RTCRtpSender', 'createEncodedStreams'],['RTCRtpSender', 'getParameters'],['RTCRtpSender', 'getStats'],['RTCRtpSender', 'replaceTrack'],['RTCRtpSender', 'setParameters'],['RTCRtpSender', 'setStreams'],['RTCRtpReceiver', 'createEncodedStreams'],['RTCRtpReceiver', 'getContributingSources'],['RTCRtpReceiver', 'getParameters'],['RTCRtpReceiver', 'getStats'],['RTCRtpReceiver', 'getSynchronizationSources'],['RTCPeerConnection', 'addIceCandidate'],['RTCPeerConnection', 'addStream'],['RTCPeerConnection', 'addTrack'],['RTCPeerConnection', 'addTransceiver'],['RTCPeerConnection', 'close'],['RTCPeerConnection', 'createAnswer'],['RTCPeerConnection', 'createDTMFSender'],['RTCPeerConnection', 'createDataChannel'],['RTCPeerConnection', 'createOffer'],['RTCPeerConnection', 'getConfiguration'],['RTCPeerConnection', 'getLocalStreams'],['RTCPeerConnection', 'getReceivers'],['RTCPeerConnection', 'getRemoteStreams'],['RTCPeerConnection', 'getSenders'],['RTCPeerConnection', 'getStats'],['RTCPeerConnection', 'getTransceivers'],['RTCPeerConnection', 'removeStream'],['RTCPeerConnection', 'removeTrack'],['RTCPeerConnection', 'restartIce'],['RTCPeerConnection', 'setConfiguration'],['RTCPeerConnection', 'setLocalDescription'],['RTCPeerConnection', 'setRemoteDescription'],['RTCIceCandidate', 'toJSON'],['RTCEncodedVideoFrame', 'getMetadata'],['RTCEncodedVideoFrame', 'toString'],['RTCEncodedAudioFrame', 'getMetadata'],['RTCEncodedAudioFrame', 'toString'],['RTCDtlsTransport', 'getRemoteCertificates'],['RTCDataChannel', 'close'],['RTCDataChannel', 'send'],['RTCDTMFSender', 'insertDTMF'],['RTCCertificate', 'getFingerprints'],['PointerEvent', 'getCoalescedEvents'],['PointerEvent', 'getPredictedEvents'],['PluginArray', 'item'],['PluginArray', 'namedItem'],['PluginArray', 'refresh'],['Plugin', 'item'],['Plugin', 'namedItem'],['PerformanceTiming', 'toJSON'],['PerformanceServerTiming', 'toJSON'],['PerformanceResourceTiming', 'toJSON'],['PerformanceObserverEntryList', 'getEntries'],['PerformanceObserverEntryList', 'getEntriesByName'],['PerformanceObserverEntryList', 'getEntriesByType'],['PerformanceObserver', 'disconnect'],['PerformanceObserver', 'observe'],['PerformanceObserver', 'takeRecords'],['PerformanceNavigationTiming', 'toJSON'],['PerformanceNavigation', 'toJSON'],['PerformanceLongTaskTiming', 'toJSON'],['PerformanceEventTiming', 'toJSON'],['PerformanceEntry', 'toJSON'],['PerformanceElementTiming', 'toJSON'],['Performance', 'clearMarks'],['Performance', 'clearMeasures'],['Performance', 'clearResourceTimings'],['Performance', 'getEntries'],['Performance', 'getEntriesByName'],['Performance', 'getEntriesByType'],['Performance', 'mark'],['Performance', 'measure'],['Performance', 'now'],['Performance', 'setResourceTimingBufferSize'],['Performance', 'toJSON'],['Path2D', 'addPath'],['Path2D', 'arc'],['Path2D', 'arcTo'],['Path2D', 'bezierCurveTo'],['Path2D', 'closePath'],['Path2D', 'ellipse'],['Path2D', 'lineTo'],['Path2D', 'moveTo'],['Path2D', 'quadraticCurveTo'],['Path2D', 'rect'],['PannerNode', 'setOrientation'],['PannerNode', 'setPosition'],['OscillatorNode', 'setPeriodicWave'],['OffscreenCanvasRenderingContext2D', 'clip'],['OffscreenCanvasRenderingContext2D', 'createImageData'],['OffscreenCanvasRenderingContext2D', 'createLinearGradient'],['OffscreenCanvasRenderingContext2D', 'createPattern'],['OffscreenCanvasRenderingContext2D', 'createRadialGradient'],['OffscreenCanvasRenderingContext2D', 'drawImage'],['OffscreenCanvasRenderingContext2D', 'fill'],['OffscreenCanvasRenderingContext2D', 'fillText'],['OffscreenCanvasRenderingContext2D', 'getImageData'],['OffscreenCanvasRenderingContext2D', 'getLineDash'],['OffscreenCanvasRenderingContext2D', 'getTransform'],['OffscreenCanvasRenderingContext2D', 'isPointInPath'],['OffscreenCanvasRenderingContext2D', 'isPointInStroke'],['OffscreenCanvasRenderingContext2D', 'measureText'],['OffscreenCanvasRenderingContext2D', 'putImageData'],['OffscreenCanvasRenderingContext2D', 'save'],['OffscreenCanvasRenderingContext2D', 'scale'],['OffscreenCanvasRenderingContext2D', 'setLineDash'],['OffscreenCanvasRenderingContext2D', 'setTransform'],['OffscreenCanvasRenderingContext2D', 'stroke'],['OffscreenCanvasRenderingContext2D', 'strokeText'],['OffscreenCanvasRenderingContext2D', 'transform'],['OffscreenCanvasRenderingContext2D', 'translate'],['OffscreenCanvasRenderingContext2D', 'arc'],['OffscreenCanvasRenderingContext2D', 'arcTo'],['OffscreenCanvasRenderingContext2D', 'beginPath'],['OffscreenCanvasRenderingContext2D', 'bezierCurveTo'],['OffscreenCanvasRenderingContext2D', 'clearRect'],['OffscreenCanvasRenderingContext2D', 'closePath'],['OffscreenCanvasRenderingContext2D', 'ellipse'],['OffscreenCanvasRenderingContext2D', 'fillRect'],['OffscreenCanvasRenderingContext2D', 'lineTo'],['OffscreenCanvasRenderingContext2D', 'moveTo'],['OffscreenCanvasRenderingContext2D', 'quadraticCurveTo'],['OffscreenCanvasRenderingContext2D', 'rect'],['OffscreenCanvasRenderingContext2D', 'resetTransform'],['OffscreenCanvasRenderingContext2D', 'restore'],['OffscreenCanvasRenderingContext2D', 'rotate'],['OffscreenCanvasRenderingContext2D', 'strokeRect'],['OffscreenCanvas', 'convertToBlob'],['OffscreenCanvas', 'getContext'],['OffscreenCanvas', 'transferToImageBitmap'],['OfflineAudioContext', 'resume'],['OfflineAudioContext', 'startRendering'],['OfflineAudioContext', 'suspend'],['NodeList', 'entries'],['NodeList', 'keys'],['NodeList', 'values'],['NodeList', 'forEach'],['NodeList', 'item'],['NodeIterator', 'detach'],['NodeIterator', 'nextNode'],['NodeIterator', 'previousNode'],['Node', 'appendChild'],['Node', 'cloneNode'],['Node', 'compareDocumentPosition'],['Node', 'contains'],['Node', 'getRootNode'],['Node', 'hasChildNodes'],['Node', 'insertBefore'],['Node', 'isDefaultNamespace'],['Node', 'isEqualNode'],['Node', 'isSameNode'],['Node', 'lookupNamespaceURI'],['Node', 'lookupPrefix'],['Node', 'normalize'],['Node', 'removeChild'],['Node', 'replaceChild'],['Navigator', 'getBattery'],['Navigator', 'getGamepads'],['Navigator', 'javaEnabled'],['Navigator', 'sendBeacon'],['Navigator', 'vibrate'],['NamedNodeMap', 'getNamedItem'],['NamedNodeMap', 'getNamedItemNS'],['NamedNodeMap', 'item'],['NamedNodeMap', 'removeNamedItem'],['NamedNodeMap', 'removeNamedItemNS'],['NamedNodeMap', 'setNamedItem'],['NamedNodeMap', 'setNamedItemNS'],['MutationObserver', 'disconnect'],['MutationObserver', 'observe'],['MutationObserver', 'takeRecords'],['MutationEvent', 'initMutationEvent'],['MouseEvent', 'getModifierState'],['MouseEvent', 'initMouseEvent'],['MimeTypeArray', 'item'],['MimeTypeArray', 'namedItem'],['MessagePort', 'close'],['MessagePort', 'postMessage'],['MessagePort', 'start'],['MessageEvent', 'initMessageEvent'],['MediaStreamTrack', 'applyConstraints'],['MediaStreamTrack', 'clone'],['MediaStreamTrack', 'getCapabilities'],['MediaStreamTrack', 'getConstraints'],['MediaStreamTrack', 'getSettings'],['MediaStreamTrack', 'stop'],['MediaStream', 'addTrack'],['MediaStream', 'clone'],['MediaStream', 'getAudioTracks'],['MediaStream', 'getTrackById'],['MediaStream', 'getTracks'],['MediaStream', 'getVideoTracks'],['MediaStream', 'removeTrack'],['MediaRecorder', 'pause'],['MediaRecorder', 'requestData'],['MediaRecorder', 'resume'],['MediaRecorder', 'start'],['MediaRecorder', 'stop'],['MediaQueryList', 'addListener'],['MediaQueryList', 'removeListener'],['MediaList', 'appendMedium'],['MediaList', 'deleteMedium'],['MediaList', 'item'],['MediaList', 'toString'],['MediaCapabilities', 'decodingInfo'],['LayoutShiftAttribution', 'toJSON'],['LayoutShift', 'toJSON'],['LargestContentfulPaint', 'toJSON'],['KeyframeEffect', 'getKeyframes'],['KeyframeEffect', 'setKeyframes'],['KeyboardEvent', 'getModifierState'],['KeyboardEvent', 'initKeyboardEvent'],['IntersectionObserver', 'disconnect'],['IntersectionObserver', 'observe'],['IntersectionObserver', 'takeRecords'],['IntersectionObserver', 'unobserve'],['InputEvent', 'getTargetRanges'],['InputDeviceInfo', 'getCapabilities'],['ImageCapture', 'getPhotoCapabilities'],['ImageCapture', 'getPhotoSettings'],['ImageCapture', 'grabFrame'],['ImageCapture', 'takePhoto'],['ImageBitmapRenderingContext', 'transferFromImageBitmap'],['ImageBitmap', 'close'],['IdleDeadline', 'timeRemaining'],['IIRFilterNode', 'getFrequencyResponse'],['IDBTransaction', 'abort'],['IDBTransaction', 'commit'],['IDBTransaction', 'objectStore'],['IDBObjectStore', 'add'],['IDBObjectStore', 'clear'],['IDBObjectStore', 'count'],['IDBObjectStore', 'createIndex'],['IDBObjectStore', 'deleteIndex'],['IDBObjectStore', 'get'],['IDBObjectStore', 'getAll'],['IDBObjectStore', 'getAllKeys'],['IDBObjectStore', 'getKey'],['IDBObjectStore', 'index'],['IDBObjectStore', 'openCursor'],['IDBObjectStore', 'openKeyCursor'],['IDBObjectStore', 'put'],['IDBKeyRange', 'includes'],['IDBIndex', 'count'],['IDBIndex', 'get'],['IDBIndex', 'getAll'],['IDBIndex', 'getAllKeys'],['IDBIndex', 'getKey'],['IDBIndex', 'openCursor'],['IDBIndex', 'openKeyCursor'],['IDBFactory', 'cmp'],['IDBFactory', 'databases'],['IDBFactory', 'deleteDatabase'],['IDBFactory', 'open'],['IDBDatabase', 'close'],['IDBDatabase', 'createObjectStore'],['IDBDatabase', 'deleteObjectStore'],['IDBDatabase', 'transaction'],['IDBCursor', 'advance'],['IDBCursor', 'continuePrimaryKey'],['IDBCursor', 'update'],['History', 'back'],['History', 'forward'],['History', 'go'],['History', 'pushState'],['History', 'replaceState'],['Headers', 'append'],['Headers', 'get'],['Headers', 'has'],['Headers', 'set'],['Headers', 'entries'],['Headers', 'forEach'],['Headers', 'keys'],['Headers', 'values'],['HTMLVideoElement', 'cancelVideoFrameCallback'],['HTMLVideoElement', 'requestVideoFrameCallback'],['HTMLVideoElement', 'getVideoPlaybackQuality'],['HTMLVideoElement', 'requestPictureInPicture'],['HTMLVideoElement', 'webkitEnterFullScreen'],['HTMLVideoElement', 'webkitEnterFullscreen'],['HTMLVideoElement', 'webkitExitFullScreen'],['HTMLVideoElement', 'webkitExitFullscreen'],['HTMLTextAreaElement', 'checkValidity'],['HTMLTextAreaElement', 'reportValidity'],['HTMLTextAreaElement', 'select'],['HTMLTextAreaElement', 'setCustomValidity'],['HTMLTextAreaElement', 'setRangeText'],['HTMLTextAreaElement', 'setSelectionRange'],['HTMLTableSectionElement', 'deleteRow'],['HTMLTableSectionElement', 'insertRow'],['HTMLTableRowElement', 'deleteCell'],['HTMLTableRowElement', 'insertCell'],['HTMLTableElement', 'createCaption'],['HTMLTableElement', 'createTBody'],['HTMLTableElement', 'createTFoot'],['HTMLTableElement', 'createTHead'],['HTMLTableElement', 'deleteCaption'],['HTMLTableElement', 'deleteRow'],['HTMLTableElement', 'deleteTFoot'],['HTMLTableElement', 'deleteTHead'],['HTMLTableElement', 'insertRow'],['HTMLSlotElement', 'assign'],['HTMLSlotElement', 'assignedElements'],['HTMLSlotElement', 'assignedNodes'],['HTMLSelectElement', 'add'],['HTMLSelectElement', 'checkValidity'],['HTMLSelectElement', 'item'],['HTMLSelectElement', 'namedItem'],['HTMLSelectElement', 'remove'],['HTMLSelectElement', 'reportValidity'],['HTMLSelectElement', 'setCustomValidity'],['HTMLOutputElement', 'checkValidity'],['HTMLOutputElement', 'reportValidity'],['HTMLOutputElement', 'setCustomValidity'],['HTMLOptionsCollection', 'add'],['HTMLOptionsCollection', 'remove'],['HTMLObjectElement', 'checkValidity'],['HTMLObjectElement', 'getSVGDocument'],['HTMLObjectElement', 'reportValidity'],['HTMLObjectElement', 'setCustomValidity'],['HTMLMediaElement', 'addTextTrack'],['HTMLMediaElement', 'canPlayType'],['HTMLMediaElement', 'captureStream'],['HTMLMediaElement', 'load'],['HTMLMediaElement', 'pause'],['HTMLMediaElement', 'play'],['HTMLMediaElement', 'setSinkId'],['HTMLMarqueeElement', 'start'],['HTMLMarqueeElement', 'stop'],['HTMLInputElement', 'checkValidity'],['HTMLInputElement', 'reportValidity'],['HTMLInputElement', 'select'],['HTMLInputElement', 'setCustomValidity'],['HTMLInputElement', 'setRangeText'],['HTMLInputElement', 'setSelectionRange'],['HTMLInputElement', 'stepDown'],['HTMLInputElement', 'stepUp'],['HTMLImageElement', 'decode'],['HTMLIFrameElement', 'getSVGDocument'],
    ['HTMLFormElement', 'checkValidity'],
    ['HTMLFormElement', 'reportValidity'],
    ['HTMLFormElement', 'requestSubmit'],
    ['HTMLFormElement', 'reset'],
    ['HTMLFormElement', 'submit'],
    ['HTMLFormControlsCollection', 'namedItem'],['HTMLFieldSetElement', 'checkValidity'],['HTMLFieldSetElement', 'reportValidity'],['HTMLFieldSetElement', 'setCustomValidity'],['HTMLEmbedElement', 'getSVGDocument'],['HTMLElement', 'attachInternals'],['HTMLElement', 'blur'],['HTMLElement', 'click'],['HTMLElement', 'focus'],['HTMLDialogElement', 'close'],['HTMLDialogElement', 'show'],['HTMLDialogElement', 'showModal'],['HTMLCollection', 'item'],['HTMLCollection', 'namedItem'],['HTMLCanvasElement', 'captureStream'],['HTMLCanvasElement', 'getContext'],['HTMLCanvasElement', 'toBlob'],['HTMLCanvasElement', 'toDataURL'],['HTMLCanvasElement', 'transferControlToOffscreen'],['HTMLButtonElement', 'checkValidity'],['HTMLButtonElement', 'reportValidity'],['HTMLButtonElement', 'setCustomValidity'],['HTMLAreaElement', 'toString'],['HTMLAnchorElement', 'toString'],['HTMLAllCollection', 'item'],['HTMLAllCollection', 'namedItem'],['Geolocation', 'clearWatch'],['Geolocation', 'getCurrentPosition'],['Geolocation', 'watchPosition'],['GamepadHapticActuator', 'playEffect'],['GamepadHapticActuator', 'reset'],['FormData', 'append'],['FormData', 'get'],['FormData', 'getAll'],['FormData', 'has'],['FormData', 'set'],['FormData', 'entries'],['FormData', 'forEach'],['FormData', 'keys'],['FormData', 'values'],['FontFace', 'load'],['FileReader', 'abort'],['FileReader', 'readAsArrayBuffer'],['FileReader', 'readAsBinaryString'],['FileReader', 'readAsDataURL'],['FileReader', 'readAsText'],['FileList', 'item'],['FeaturePolicy', 'allowedFeatures'],['FeaturePolicy', 'allowsFeature'],['FeaturePolicy', 'features'],['FeaturePolicy', 'getAllowlistForFeature'],['External', 'AddSearchProvider'],['External', 'IsSearchProviderInstalled'],['EventTarget', 'addEventListener'],['EventTarget', 'dispatchEvent'],['EventTarget', 'removeEventListener'],['EventSource', 'close'],['EventCounts', 'entries'],['EventCounts', 'forEach'],['EventCounts', 'get'],['EventCounts', 'has'],['EventCounts', 'keys'],['EventCounts', 'values'],['Event', 'composedPath'],['Event', 'initEvent'],['Event', 'preventDefault'],['Event', 'stopImmediatePropagation'],['Event', 'stopPropagation'],['ElementInternals', 'checkValidity'],['ElementInternals', 'reportValidity'],['ElementInternals', 'setFormValue'],['ElementInternals', 'setValidity'],['Element', 'after'],['Element', 'animate'],['Element', 'append'],['Element', 'attachShadow'],['Element', 'before'],['Element', 'closest'],['Element', 'computedStyleMap'],['Element', 'getAttribute'],['Element', 'getAttributeNS'],['Element', 'getAttributeNames'],['Element', 'getAttributeNode'],['Element', 'getAttributeNodeNS'],['Element', 'getBoundingClientRect'],['Element', 'getClientRects'],['Element', 'getElementsByClassName'],['Element', 'getElementsByTagName'],['Element', 'getElementsByTagNameNS'],['Element', 'hasAttribute'],['Element', 'hasAttributeNS'],['Element', 'hasAttributes'],['Element', 'hasPointerCapture'],['Element', 'insertAdjacentElement'],['Element', 'insertAdjacentHTML'],['Element', 'insertAdjacentText'],['Element', 'matches'],['Element', 'prepend'],['Element', 'querySelector'],['Element', 'querySelectorAll'],['Element', 'releasePointerCapture'],['Element', 'remove'],['Element', 'removeAttribute'],['Element', 'removeAttributeNS'],['Element', 'removeAttributeNode'],['Element', 'replaceChildren'],['Element', 'replaceWith'],['Element', 'requestFullscreen'],['Element', 'requestPointerLock'],['Element', 'scroll'],['Element', 'scrollBy'],['Element', 'scrollIntoView'],['Element', 'scrollIntoViewIfNeeded'],['Element', 'scrollTo'],['Element', 'setAttribute'],['Element', 'setAttributeNS'],['Element', 'setAttributeNode'],['Element', 'setAttributeNodeNS'],['Element', 'setPointerCapture'],['Element', 'toggleAttribute'],['Element', 'webkitMatchesSelector'],['Element', 'webkitRequestFullScreen'],['Element', 'webkitRequestFullscreen'],['Element', 'getAnimations'],['Element', 'getInnerHTML'],['DocumentType', 'after'],['DocumentType', 'before'],['DocumentType', 'remove'],['DocumentType', 'replaceWith'],['DocumentFragment', 'append'],['DocumentFragment', 'getElementById'],['DocumentFragment', 'prepend'],['DocumentFragment', 'querySelector'],['DocumentFragment', 'querySelectorAll'],['DocumentFragment', 'replaceChildren'],['Document', 'adoptNode'],['Document', 'append'],['Document', 'captureEvents'],['Document', 'caretRangeFromPoint'],['Document', 'clear'],['Document', 'close'],['Document', 'createAttribute'],['Document', 'createAttributeNS'],['Document', 'createCDATASection'],['Document', 'createComment'],['Document', 'createDocumentFragment'],['Document', 'createElement'],['Document', 'createElementNS'],['Document', 'createEvent'],['Document', 'createExpression'],['Document', 'createNSResolver'],['Document', 'createNodeIterator'],['Document', 'createProcessingInstruction'],['Document', 'createRange'],['Document', 'createTextNode'],['Document', 'createTreeWalker'],['Document', 'elementFromPoint'],['Document', 'elementsFromPoint'],['Document', 'evaluate'],['Document', 'execCommand'],['Document', 'exitFullscreen'],['Document', 'exitPointerLock'],['Document', 'getElementById'],['Document', 'getElementsByClassName'],['Document', 'getElementsByName'],['Document', 'getElementsByTagName'],['Document', 'getElementsByTagNameNS'],['Document', 'getSelection'],['Document', 'hasFocus'],['Document', 'importNode'],['Document', 'open'],['Document', 'prepend'],['Document', 'queryCommandEnabled'],['Document', 'queryCommandIndeterm'],['Document', 'queryCommandState'],['Document', 'queryCommandSupported'],['Document', 'queryCommandValue'],['Document', 'querySelector'],['Document', 'querySelectorAll'],['Document', 'releaseEvents'],['Document', 'replaceChildren'],['Document', 'webkitCancelFullScreen'],['Document', 'webkitExitFullscreen'],['Document', 'write'],['Document', 'writeln'],['Document', 'exitPictureInPicture'],['Document', 'getAnimations'],['DataTransferItemList', 'add'],['DataTransferItemList', 'clear'],['DataTransferItemList', 'remove'],['DataTransferItem', 'getAsFile'],['DataTransferItem', 'getAsString'],['DataTransferItem', 'webkitGetAsEntry'],['DataTransferItem', 'getAsFileSystemHandle'],['DataTransfer', 'clearData'],['DataTransfer', 'getData'],['DataTransfer', 'setData'],['DataTransfer', 'setDragImage'],['DOMTokenList', 'entries'],['DOMTokenList', 'keys'],['DOMTokenList', 'values'],['DOMTokenList', 'forEach'],['DOMTokenList', 'add'],['DOMTokenList', 'contains'],['DOMTokenList', 'item'],['DOMTokenList', 'remove'],['DOMTokenList', 'replace'],['DOMTokenList', 'supports'],['DOMTokenList', 'toggle'],['DOMTokenList', 'toString'],['DOMStringList', 'contains'],['DOMStringList', 'item'],['DOMRectReadOnly', 'toJSON'],['DOMRectList', 'item'],['DOMQuad', 'getBounds'],['DOMQuad', 'toJSON'],['DOMPointReadOnly', 'matrixTransform'],['DOMPointReadOnly', 'toJSON'],['DOMParser', 'parseFromString'],['DOMMatrixReadOnly', 'flipX'],['DOMMatrixReadOnly', 'flipY'],['DOMMatrixReadOnly', 'inverse'],['DOMMatrixReadOnly', 'multiply'],['DOMMatrixReadOnly', 'rotate'],['DOMMatrixReadOnly', 'rotateAxisAngle'],['DOMMatrixReadOnly', 'rotateFromVector'],['DOMMatrixReadOnly', 'scale'],['DOMMatrixReadOnly', 'scale3d'],['DOMMatrixReadOnly', 'scaleNonUniform'],['DOMMatrixReadOnly', 'skewX'],['DOMMatrixReadOnly', 'skewY'],['DOMMatrixReadOnly', 'toFloat32Array'],['DOMMatrixReadOnly', 'toFloat64Array'],['DOMMatrixReadOnly', 'toJSON'],['DOMMatrixReadOnly', 'transformPoint'],['DOMMatrixReadOnly', 'translate'],['DOMMatrixReadOnly', 'toString'],['DOMImplementation', 'createDocument'],['DOMImplementation', 'createDocumentType'],['DOMImplementation', 'createHTMLDocument'],['DOMImplementation', 'hasFeature'],['CustomEvent', 'initCustomEvent'],['CustomElementRegistry', 'define'],['CustomElementRegistry', 'get'],['CustomElementRegistry', 'upgrade'],['CustomElementRegistry', 'whenDefined'],['Crypto', 'getRandomValues'],['CompositionEvent', 'initCompositionEvent'],['CharacterData', 'after'],['CharacterData', 'appendData'],['CharacterData', 'before'],['CharacterData', 'deleteData'],['CharacterData', 'insertData'],['CharacterData', 'remove'],['CharacterData', 'replaceData'],['CharacterData', 'replaceWith'],['CharacterData', 'substringData'],['CanvasRenderingContext2D', 'clip'],['CanvasRenderingContext2D', 'createImageData'],['CanvasRenderingContext2D', 'createLinearGradient'],['CanvasRenderingContext2D', 'createPattern'],['CanvasRenderingContext2D', 'createRadialGradient'],['CanvasRenderingContext2D', 'drawFocusIfNeeded'],['CanvasRenderingContext2D', 'drawImage'],['CanvasRenderingContext2D', 'fill'],['CanvasRenderingContext2D', 'fillText'],['CanvasRenderingContext2D', 'getContextAttributes'],['CanvasRenderingContext2D', 'getImageData'],['CanvasRenderingContext2D', 'getLineDash'],['CanvasRenderingContext2D', 'getTransform'],['CanvasRenderingContext2D', 'isPointInPath'],['CanvasRenderingContext2D', 'isPointInStroke'],['CanvasRenderingContext2D', 'measureText'],['CanvasRenderingContext2D', 'putImageData'],['CanvasRenderingContext2D', 'save'],['CanvasRenderingContext2D', 'scale'],['CanvasRenderingContext2D', 'setLineDash'],['CanvasRenderingContext2D', 'setTransform'],['CanvasRenderingContext2D', 'stroke'],['CanvasRenderingContext2D', 'strokeText'],['CanvasRenderingContext2D', 'transform'],['CanvasRenderingContext2D', 'translate'],['CanvasRenderingContext2D', 'arc'],['CanvasRenderingContext2D', 'arcTo'],['CanvasRenderingContext2D', 'beginPath'],['CanvasRenderingContext2D', 'bezierCurveTo'],['CanvasRenderingContext2D', 'clearRect'],['CanvasRenderingContext2D', 'closePath'],['CanvasRenderingContext2D', 'ellipse'],['CanvasRenderingContext2D', 'fillRect'],['CanvasRenderingContext2D', 'lineTo'],['CanvasRenderingContext2D', 'moveTo'],['CanvasRenderingContext2D', 'quadraticCurveTo'],['CanvasRenderingContext2D', 'rect'],['CanvasRenderingContext2D', 'resetTransform'],['CanvasRenderingContext2D', 'restore'],['CanvasRenderingContext2D', 'rotate'],['CanvasRenderingContext2D', 'strokeRect'],['CanvasPattern', 'setTransform'],['CanvasGradient', 'addColorStop'],['CanvasCaptureMediaStreamTrack', 'requestFrame'],['CSSTransformComponent', 'toMatrix'],['CSSTransformComponent', 'toString'],['CSSStyleValue', 'toString'],['CSSStyleSheet', 'addRule'],['CSSStyleSheet', 'deleteRule'],['CSSStyleSheet', 'insertRule'],['CSSStyleSheet', 'removeRule'],['CSSStyleSheet', 'replace'],['CSSStyleSheet', 'replaceSync'],['CSSStyleDeclaration', 'getPropertyPriority'],['CSSStyleDeclaration', 'getPropertyValue'],['CSSStyleDeclaration', 'item'],['CSSStyleDeclaration', 'removeProperty'],['CSSStyleDeclaration', 'setProperty'],['CSSRuleList', 'item'],['CSSNumericArray', 'entries'],['CSSNumericArray', 'keys'],['CSSNumericArray', 'values'],['CSSNumericArray', 'forEach'],['CSSKeyframesRule', 'appendRule'],['CSSKeyframesRule', 'deleteRule'],['CSSKeyframesRule', 'findRule'],['CSSGroupingRule', 'deleteRule'],['CSSGroupingRule', 'insertRule'],['BroadcastChannel', 'close'],['BroadcastChannel', 'postMessage'],['Blob', 'arrayBuffer'],['Blob', 'slice'],['Blob', 'stream'],['Blob', 'text'],['BiquadFilterNode', 'getFrequencyResponse'],['BeforeInstallPromptEvent', 'prompt'],['BaseAudioContext', 'createAnalyser'],['BaseAudioContext', 'createBiquadFilter'],['BaseAudioContext', 'createBuffer'],['BaseAudioContext', 'createBufferSource'],['BaseAudioContext', 'createChannelMerger'],['BaseAudioContext', 'createChannelSplitter'],['BaseAudioContext', 'createConstantSource'],['BaseAudioContext', 'createConvolver'],['BaseAudioContext', 'createDelay'],['BaseAudioContext', 'createDynamicsCompressor'],['BaseAudioContext', 'createGain'],['BaseAudioContext', 'createIIRFilter'],['BaseAudioContext', 'createOscillator'],['BaseAudioContext', 'createPanner'],['BaseAudioContext', 'createPeriodicWave'],['BaseAudioContext', 'createScriptProcessor'],['BaseAudioContext', 'createStereoPanner'],['BaseAudioContext', 'createWaveShaper'],['BaseAudioContext', 'decodeAudioData'],['AudioScheduledSourceNode', 'start'],['AudioScheduledSourceNode', 'stop'],['AudioParamMap', 'entries'],['AudioParamMap', 'forEach'],['AudioParamMap', 'get'],['AudioParamMap', 'has'],['AudioParamMap', 'keys'],['AudioParamMap', 'values'],['AudioParam', 'cancelAndHoldAtTime'],['AudioParam', 'cancelScheduledValues'],['AudioParam', 'exponentialRampToValueAtTime'],['AudioParam', 'linearRampToValueAtTime'],['AudioParam', 'setTargetAtTime'],['AudioParam', 'setValueAtTime'],['AudioParam', 'setValueCurveAtTime'],['AudioNode', 'connect'],['AudioNode', 'disconnect'],['AudioListener', 'setOrientation'],['AudioListener', 'setPosition'],['AudioContext', 'close'],['AudioContext', 'createMediaElementSource'],['AudioContext', 'createMediaStreamDestination'],['AudioContext', 'createMediaStreamSource'],['AudioContext', 'getOutputTimestamp'],['AudioContext', 'resume'],['AudioContext', 'suspend'],['AudioBufferSourceNode', 'start'],['AudioBuffer', 'copyFromChannel'],['AudioBuffer', 'copyToChannel'],['AudioBuffer', 'getChannelData'],['AnimationEffect', 'getComputedTiming'],['AnimationEffect', 'getTiming'],['AnimationEffect', 'updateTiming'],['Animation', 'cancel'],['Animation', 'finish'],['Animation', 'pause'],['Animation', 'play'],['Animation', 'reverse'],['Animation', 'updatePlaybackRate'],['Animation', 'commitStyles'],['Animation', 'persist'],['AnalyserNode', 'getByteFrequencyData'],['AnalyserNode', 'getByteTimeDomainData'],['AnalyserNode', 'getFloatFrequencyData'],['AnalyserNode', 'getFloatTimeDomainData'],['AbortController', 'abort'],['AudioData', 'allocationSize'],['AudioData', 'clone'],['AudioData', 'close'],['AudioData', 'copyTo'],['EncodedAudioChunk', 'copyTo'],['EncodedVideoChunk', 'copyTo'],['VideoColorSpace', 'toJSON'],['VideoFrame', 'allocationSize'],['VideoFrame', 'clone'],['VideoFrame', 'close'],['VideoFrame', 'copyTo'],['Profiler', 'stop'],['Scheduling', 'isInputPending'],['BackgroundFetchManager', 'fetch'],['BackgroundFetchManager', 'get'],['BackgroundFetchManager', 'getIds'],['BackgroundFetchRegistration', 'abort'],['BackgroundFetchRegistration', 'match'],['BackgroundFetchRegistration', 'matchAll'],['CustomStateSet', 'add'],['CustomStateSet', 'clear'],['CustomStateSet', 'entries'],['CustomStateSet', 'forEach'],['CustomStateSet', 'has'],['CustomStateSet', 'keys'],['CustomStateSet', 'values'],['DelegatedInkTrailPresenter', 'updateInkTrailStartPoint'],['Ink', 'requestPresenter'],['MediaSession', 'setActionHandler'],['MediaSession', 'setCameraActive'],['MediaSession', 'setMicrophoneActive'],['MediaSession', 'setPositionState'],['MediaSource', 'addSourceBuffer'],['MediaSource', 'clearLiveSeekableRange'],['MediaSource', 'endOfStream'],['MediaSource', 'removeSourceBuffer'],['MediaSource', 'setLiveSeekableRange'],['SourceBuffer', 'abort'],['SourceBuffer', 'appendBuffer'],['SourceBuffer', 'changeType'],['SourceBuffer', 'remove'],['NavigatorUAData', 'getHighEntropyValues'],['NavigatorUAData', 'toJSON'],['Notification', 'close'],['PaymentInstruments', 'clear'],['PaymentInstruments', 'get'],['PaymentInstruments', 'has'],['PaymentInstruments', 'keys'],['PaymentInstruments', 'set'],['PaymentManager', 'enableDelegations'],['PaymentRequestUpdateEvent', 'updateWith'],['PeriodicSyncManager', 'getTags'],['PeriodicSyncManager', 'register'],['PeriodicSyncManager', 'unregister'],['Permissions', 'query'],['PushManager', 'getSubscription'],['PushManager', 'permissionState'],['PushManager', 'subscribe'],['PushSubscription', 'getKey'],['PushSubscription', 'toJSON'],['PushSubscription', 'unsubscribe'],['RemotePlayback', 'cancelWatchAvailability'],['RemotePlayback', 'prompt'],['RemotePlayback', 'watchAvailability'],['Scheduler', 'postTask'],['TaskController', 'setPriority'],['TrustedHTML', 'toJSON'],['TrustedHTML', 'toString'],['TrustedScript', 'toJSON'],['TrustedScript', 'toString'],['TrustedScriptURL', 'toJSON'],['TrustedScriptURL', 'toString'],['TrustedTypePolicy', 'createHTML'],['TrustedTypePolicy', 'createScript'],['TrustedTypePolicy', 'createScriptURL'],['TrustedTypePolicyFactory', 'createPolicy'],['TrustedTypePolicyFactory', 'getAttributeType'],['TrustedTypePolicyFactory', 'getPropertyType'],['TrustedTypePolicyFactory', 'getTypeMapping'],['TrustedTypePolicyFactory', 'isHTML'],['TrustedTypePolicyFactory', 'isScript'],['TrustedTypePolicyFactory', 'isScriptURL'],['XSLTProcessor', 'clearParameters'],['XSLTProcessor', 'getParameter'],['XSLTProcessor', 'importStylesheet'],['XSLTProcessor', 'removeParameter'],['XSLTProcessor', 'reset'],['XSLTProcessor', 'setParameter'],['XSLTProcessor', 'transformToDocument'],['XSLTProcessor', 'transformToFragment'],['webkitSpeechGrammarList', 'addFromString'],['webkitSpeechGrammarList', 'addFromUri'],['webkitSpeechGrammarList', 'item'],['webkitSpeechRecognition', 'abort'],['webkitSpeechRecognition', 'start'],['webkitSpeechRecognition', 'stop']]

function make_domhooker_funcs(){
  var ret = []
    function v_getset_hook(obname, name){
      var v_model = `
      !function(){
        if (!e["config-hook-${obname}-${name}"]){ return }
        try{ 
          var _desc = Object.getOwnPropertyDescriptors(${obname}.prototype).${name} 
          var _old_get = _desc.get, _old_set = _desc.set
        }catch(e){ return }
        var _new_get = saf(function get(){
          var r = _old_get.apply(this, arguments)
          if (e["config-hook-domobj"] && e["config-hook-domobj-get"] && e["config-hook-${obname}-${name}"]){ 
            var expstr = v_Error().stack.v_split('\\n')[2]
            v_cache_node(expstr, "${obname}", "${name}", "get", r)
            inspect_arguments(this, arguments, r, "${obname}", "${name}", "get")
            if (expurl.v_test(expstr) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('(*) [${obname} ${name} get]', r, get_log_at(expstr.trim())))
            }
          }
          return r }, 'get ${name}')
        if (_old_set){
          var _new_set = saf(function set(v){
            if (e["config-hook-domobj"] && e["config-hook-domobj-set"] && e["config-hook-${obname}-${name}"]){ 
              var expstr = v_Error().stack.v_split('\\n')[2]
              v_cache_node(expstr, "${obname}", "${name}", "set")
              inspect_arguments(this, arguments, null, "${obname}", "${name}", "set")
              if (expurl.v_test(expstr) && typeof expstr == 'string'){
                window.v_log(..._mk_logs('(*) [${obname} ${name} set]', v, get_log_at(expstr.trim())))
              }
            }
            return _old_set.apply(this, arguments) }, 'set ${name}')
        }else{ _new_set = undefined }
        Object.defineProperty(${obname}.prototype, '${name}', { get: _new_get, set: _new_set, enumerable: _desc['enumerable'], configurable: _desc['configurable'], })
      }()
      `
      ret.push(v_model)
    }
    getsets.map(function(e){ v_getset_hook(e[0], e[1]) })
    function v_valuefunc_hook(obname, name){
      var v_model = `
      !function(){
        if (!e["config-hook-${obname}-${name}"]){ return }
        try{ var _desc = Object.getOwnPropertyDescriptors(${obname}.prototype).${name}, _old_val = _desc.value }catch(e){ return }
        var _new_val = saf(function ${name}(){
          var err;
          try{
            var r = _old_val.apply(this, arguments) 
          }catch(e){
            err = e
          }
          if (e["config-hook-domobj"] && e["config-hook-domobj-func"] && e["config-hook-${obname}-${name}"]){ 
            var expstr = v_Error().stack.v_split('\\n')[2]
            v_cache_node(expstr, "${obname}", "${name}", "func")
            if (expurl.v_test(expstr) && typeof expstr == 'string'){
              window.v_log(..._mk_logs('  (f) [${obname} ${name} func]', origslice.call(arguments), '===>', err ? '[ERROR]' : r, get_log_at(expstr.trim())))
            }
          }
          inspect_arguments(this, arguments, r, "${obname}", "${name}", "func")
          if (err){
            throw err;
          }
          return r })
        try{ Object.defineProperty(${obname}.prototype, '${name}', { value: _new_val, enumerable: _desc['enumerable'], configurable: _desc['configurable'], writable: _desc['writable'], })
        }catch(e){  }
      }()
      `
      ret.push(v_model)
    }
    funcs.map(function(e){ v_valuefunc_hook(e[0], e[1]) })
  return ret.join('')
}

var hookers = [
  "config-hook-global",
  "config-hook-test",
  "config-hook-console",
  "config-hook-Function",
  "config-hook-eval",
  "config-hook-remove-dyn-debugger",
  "config-hook-settimeout",
  "config-hook-setinterval",
  "config-hook-random",
  "config-hook-random-freeze",
  "config-hook-random-fake",
  "config-hook-time-performance",
  "config-hook-time-freeze",
  "config-hook-time-freeze-number",
  "config-hook-cookie",
  "config-hook-cookie-add-debugger",
  "config-hook-cookie-get",
  "config-hook-cookie-set",
  "config-hook-cookie-match",
  "config-hook-encrypt-normal",
  "config-hook-JSON.parse",
  "config-hook-JSON.stringify",
  "config-hook-decodeURI",
  "config-hook-decodeURIComponent",
  "config-hook-encodeURI",
  "config-hook-encodeURIComponent",
  "config-hook-escape",
  "config-hook-unescape",
  "config-hook-atob",
  "config-hook-btoa",
  "config-hook-alt-w",
  "config-hook-domobj",
  "config-hook-domobj-get",
  "config-hook-domobj-set",
  "config-hook-domobj-func",
  "config-hook-regexp-url",
  "config-hook-log-at",
  "config-myinject",
  "config-myinject_toggle",
  "config-hook-log-toggle",
  "config-hook-log-limit-num",
]
function add_config_hook(input){
  for (var i = 0; i < input.length; i++) {
    var kv = input[i]
    hookers.push(`config-hook-${kv[0]}-${kv[1]}`)
  }
}
add_config_hook(getsets)
add_config_hook(funcs)

function inject_script(code){
  var script = document.createElement("script");
  script.innerHTML = code;
  script.onload = script.onreadystatechange = function(){
    script.onreadystatechange = script.onload = null;
  }
  var html = document.getElementsByTagName("html")[0];
  html.appendChild( script );
  html.removeChild( script );
}

function check_format(str){
  try{
    eval(`function test(){
      $myinject
    }`.replace('$myinject', str))
    return true
  }catch(e){
    return false
  }
}

function inject_code(){
  try{
    $myinject
  }catch(e){
    console.log('inject error.')
    console.log(e)
  }
}

var code_hookdom;
var code_inject;
chrome.storage.local.get(hookers, function (result) {
  if (result["config-hook-global"]){
    var replacer_injectfunc = (injectfunc + '').replace('$domobj_placeholder', make_domhooker_funcs())
    var replacer_injectfunc = replacer_injectfunc.replace('$make_v_func', make_v+';')
    result["config-hook-cookie-match"] = (result["config-hook-cookie-match"] || '').trim()
    var log_toggle = result["config-hook-log-toggle"]
    delete result["config-hook-log-toggle"] // 分两次注入是因为要保证第一次注入的代码是不变的，这样可以直接在代码处打断点
    inject_script(code_hookdom = `(${replacer_injectfunc})(${JSON.stringify(result)},window)`);
    if(!log_toggle){
      inject_script(`globalConfig.logtogglefunc({key:'w',altKey:true})`)
    }
  }
  if (result["config-myinject_toggle"]){
    var myinject = result["config-myinject"]
    var myinject = check_format(myinject) ? myinject : 'console.log("format error.")'
    inject_script(code_inject = `(${(inject_code+'').replace('$myinject', myinject)})()`);
  }
})

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action.type == 'error'){
    inject_script(`console.error(${JSON.stringify(msg.action.info)})`)
  }
  if (msg.action.type == 'addlistener'){
    inject_script(`try{v_log_env()}catch(e){debugger;alert('请打开调试总开关，同时将dom挂钩全部选中后，再刷新页面点击代码生成按钮。')}`)
  }
  if (msg.action.type == 'logtoggle'){
    inject_script(`globalConfig.logtogglefunc({key:'w',altKey:true})`)
  }
  if (msg.action.type == 'alerterror'){
    inject_script(`alert(${JSON.stringify(msg.action.info)})`)
  }
  if (msg.action.type == 'run_in_page'){
    inject_script(`${msg.action.info}`)
  }
  if (msg.action.type == 'getcookie'){
    // 有些 onlyhttp 的 cookie 直接通过 js 拿不到，所以这个插件会主动在 js 环境下注入一个 vilame_setter 参数。
    // 通过 vilame_setter 参数可以直接拿到所有当前页面 domain 下的 cookie 包括 httponly 类型的 cookie。
    inject_script('window.vilame_setter='+JSON.stringify(msg.action.info))
  }
  if (msg.action.type == 'eval'){
    var jscode = msg.action.info
    jscode = `
    ${jscode}
    var envstr = (function(txt){
      txt = txt.split('http://pls_init_href_first/test1/test2').join(location.href)
      txt = txt.split('// $$$referrer').join('document[_y].referrer = "' + (document.referrer || '') + '"')
      txt = txt.split('// $$$init_cookie').join('window[_y].init_cookie("' + document.cookie + '")')
      return txt
    })(window.v_mk())
    ;(function openwin(txt) {
      var OpenWindow = window.open("about:blank", "1", "height=600, width=800,toolbar=no,scrollbars=" + scroll + ",menubar=no");
      OpenWindow.document.write(\`
    <!DOCTYPE html>
    <html>
    <head>
    <title></title>
    </head>
    <body>
    <h3>从下面的窗口直接复制生成的代码使用</h3>
    <textarea style="width: 100%; height: 1500px" id="txt" spellcheck="false"></textarea>
    </body>
    </html>
    \`)
        var left = 100
        var top = 100
        OpenWindow.moveTo(left, top);
        OpenWindow.document.close()
        return OpenWindow.txt.value = txt || ''
    })(envstr)
    `
    inject_script(jscode)
  }
  sendResponse({})
});
chrome.extension.sendMessage({getcookie:true, domain:document.domain}, function(res){})




