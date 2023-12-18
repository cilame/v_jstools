
var open_ast_pagetn = document.getElementById('open_ast_page')
var open_diff_texttn = document.getElementById('open_diff_text')
var sojsontn = document.getElementById('sojson')
var obtn = document.getElementById('ob')
var jsfuckbtn = document.getElementById('jsfuck')
var obnormalbtn = document.getElementById('obnormal')
var babel_aline = document.getElementById('babel_aline')
var uglifybtn = document.getElementById('uglify')
var terserbtn = document.getElementById('terser')
var uglify_minibtn = document.getElementById('uglify_mini')
var terser_minibtn = document.getElementById('terser_mini')
var txt = document.getElementById('txt')
var txt2 = document.getElementById('txt2')

open_ast_pagetn.addEventListener('click', function(e){
  var temp = chrome.runtime.getURL('astexplorer_babel.html')
  console.log(temp)
  chrome.tabs.create({
    url: temp
  });
})

open_diff_texttn.addEventListener('click', function(e){
  var temp = chrome.runtime.getURL('diff_text.html')
  console.log(temp)
  chrome.tabs.create({
    url: temp
  });
})

babel_aline.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_aline(txt.value)
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

function get_ob_config(){
  return {
    clear_ob_extra: clear_ob_extra.checked,
    clear_not_use: clear_not_use.checked,
    ob_dec_name: ob_dec_name.value,
  }
}

sojsontn.addEventListener('click', function(e){
  try{
    try{
      ;(txt2||txt).value = muti_process_sojsondefusion(txt.value, get_ob_config())
    }catch(e){
      console.log('解密失败，尝试不配置清理 clear_ob_extra 再次解密')
      var config = get_ob_config()
      delete config.clear_ob_extra
      ;(txt2||txt).value = muti_process_sojsondefusion(txt.value)
    }
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

obtn.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_obdefusion(txt.value, get_ob_config())
  }catch(e){
    if (e.__proto__.name == 'ReferenceError'){
      var mth = /^(.*) is not defined/.exec(e.message)
      if (mth){
        console.log(`出现 ReferenceError: '${mth[1]}' is not defined 的异常，尝试用 '${mth[1]}' 作为解密名字二次解密。`)
        var config = get_ob_config()
        config.ob_dec_name = mth[1]
        try{
          ;(txt2||txt).value = muti_process_obdefusion(txt.value, config)
        }catch(e){
          ;(txt2||txt).value = e.stack
        }
        return
      }
    }
    ;(txt2||txt).value = e.stack
  }
})

obnormal.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_defusion(txt.value, get_ob_config())
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

jsfuckbtn.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_jsfuckdefusion(txt.value)
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

uglifybtn.addEventListener('click', function(e){
  var r = UglifyJS.minify(txt.value, {
      compress: { 
          drop_debugger: false, 
          hoist_vars: false, 
          join_vars: false,
          sequences: false,
          inline: false,
          loops: false,
          reduce_funcs: false,
          reduce_vars: false,
          collapse_vars: false,
          comparisons: false,
          computed_props: false,
          conditionals: true,
          evaluate: true,
          expression: false,
      },
      output: {
          bracketize: true,
          beautify: true,
      },
  })
  ;(txt2||txt).value = r.code?r.code:r.error;
})

uglify_minibtn.addEventListener('click', function(e){
  var r = UglifyJS.minify(txt.value)
  ;(txt2||txt).value = r.code?r.code:r.error;
})

terserbtn.addEventListener('click', function(e){
  terser.charlist = '0123456789'
  terser.prefix = 'vvv_'
  terser.tail = '_'
  terser.minify(txt.value, {compress:false,output:{beautify:true}}).then(function(e){
    terser.charlist = undefined
    terser.prefix = undefined
    terser.tail = undefined
    ;(txt2||txt).value = e.code?e.code:e.error;
  })
})

terser_minibtn.addEventListener('click', function(e){
  terser.minify(txt.value).then(function(e){
    ;(txt2||txt).value = e.code?e.code:e.error;
  })
})

var envb = document.getElementById('env');
envb.addEventListener('dblclick', function(e){
  ;(txt2||txt).value = '!'+v_mk+'()';
})

var envb = document.getElementById('debug_hook');
envb.addEventListener('dblclick', function(e){
  get_file('inject.js', function(e){
    var ast = parser.parse(e)
    var fdecls = []
    for (var i = 0; i < ast.program.body.length; i++) {
      if (t.isFunctionDeclaration(ast.program.body[i])){
        fdecls.push(ast.program.body[i])
      }
      else if(t.isVariableDeclaration(ast.program.body[i])){
        fdecls.push(ast.program.body[i])
      }
    }
    ast.program.body = fdecls
    var code = generator(ast).code
    code = code + `
    add_config_hook(getsets)
    add_config_hook(funcs)
    chrome.storage.local.get(hookers, function (result) {
      result["config-hook-global"] = true
      var replacer_injectfunc = (injectfunc + '').replace('$domobj_placeholder', make_domhooker_funcs())
      var replacer_injectfunc = replacer_injectfunc.replace('$make_v_func', make_v+';')
      var inject_code = \`(\${replacer_injectfunc})(\${JSON.stringify(result)},window)\`
      var log_toggle = result["config-hook-log-toggle"]
      if(!log_toggle){
        inject_code += ';globalConfig.logtogglefunc({key:"w",altKey:true})'
      }
      my_magic_obj['inject_code'] = inject_code
    })
    `
    new Function('my_magic_obj', code)(new Proxy({}, {
      set(a,b,c){
        a[b] = c
        if (b == 'inject_code'){
          attach_all(c)
        }
        return true
      }
    }))
    function attach_all(code){
      debug_tab = true
      chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].url.indexOf("chrome") == 0){
            continue
          }
          attach_tab_debug(tabs[i].id, code)
        }
      });
      function attach_tab_debug(tabId, code){
        cache_tabid_new[tabId] = 1
        var tabids = Object.keys(cache_tabid_new)
        for (var i = 0; i < tabids.length; i++) {
          if (cache_tabid_new[tabids[i]] == 1 && !cache_tabid_att[tabids[i]]){
            cache_tabid_att[tabids[i]] = 1
            var currtab = { tabId: +tabids[i] };
            chrome.debugger.attach(currtab, "1.2", function () {
              chrome.debugger.sendCommand(currtab, "Page.enable", function(){
                chrome.debugger.sendCommand(currtab, "Page.addScriptToEvaluateOnNewDocument", {
                  source: code
                }, function(){
                  console.log('addScriptToEvaluateOnNewDocument ok .')
                });
              });
            });
          }
        }
      }
    }
  })
})