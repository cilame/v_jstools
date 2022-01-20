
var sojsontn = document.getElementById('sojson')
var obtn = document.getElementById('ob')
var jsfuckbtn = document.getElementById('jsfuck')
var obnormalbtn = document.getElementById('obnormal')
var babel_aline = document.getElementById('babel_aline')
var uglifybtn = document.getElementById('uglify')
var uglify_minibtn = document.getElementById('uglify_mini')
var txt = document.getElementById('txt')
var txt2 = document.getElementById('txt2')

babel_aline.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_aline(txt.value)
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

sojsontn.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_sojsondefusion(txt.value)
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

obtn.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_obdefusion(txt.value)
  }catch(e){
    ;(txt2||txt).value = e.stack
  }
})

obnormal.addEventListener('click', function(e){
  try{
    ;(txt2||txt).value = muti_process_defusion(txt.value)
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

var envb = document.getElementById('env');
envb.addEventListener('dblclick', function(e){
  ;(txt2||txt).value = '!'+v_mk+'()';
})