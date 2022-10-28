var value = '';
var orig1 = '';
var orig2 = '';
var dv
var panes = 2
var highlight = false
var connect = false
var collapse = false;
function initUI() {
  if (value == null) return;
  var target = document.getElementById("view");
  target.innerHTML = "";
  if(dv){
    var left = dv.leftOriginal()
    var curr = dv.editor()
    var right = dv.rightOriginal()
    value = curr.getValue()
    if (left){ orig1 = left.getValue() }
    if (right){ orig2 = right.getValue() }
  }
  dv = CodeMirror.MergeView(target, {
    value: value,
    origLeft: panes == 2 ? null : orig1,
    orig: orig2,
    lineNumbers: true,
    mode: "text/html",
    highlightDifferences: highlight,
    // viewportMargin: Infinity,
    // connect: connect,
    collapseIdentical: false,
    allowEditingOriginals: true,
    // onChange: function (cm) {
    //   console.log(cm.getValue());
    // },
  });
  var left = dv.leftOriginal()
  var curr = dv.editor()
  var right = dv.rightOriginal()
  function changer(_saver, cm) {
    chrome.storage.local.set({
      [_saver]: cm.getValue(),
    })
  }
  curr.on('change', changer.bind(null, 'diff_value'))
  if (left){ left.on('change', changer.bind(null, 'diff_orig1')) }
  if (right){ right.on('change', changer.bind(null, 'diff_orig2')) }
  resize(dv, window.innerHeight-100)
}

window.onload = function(){
  chrome.storage.local.get([
    'diff_value',
    'diff_orig1',
    'diff_orig2',
  ], function (result) {
    value = result['diff_value'] || ''
    orig1 = result['diff_orig1'] || ''
    orig2 = result['diff_orig2'] || ''
    initUI();
  })
}
window.onresize = function(){
  resize(dv, window.innerHeight-100)
}
 
function resize(mergeView, height) {
  if (mergeView.leftOriginal()){
    mergeView.leftOriginal().setSize(null, height);
  }
  mergeView.editor().setSize(null, height);
  if (mergeView.rightOriginal()){
    mergeView.rightOriginal().setSize(null, height);
  }
  mergeView.wrap.style.height = height + "px";
}

var diff_0 = document.getElementById('diff_0')
if(diff_0){
  diff_0.addEventListener('click', function(){
    initUI()
  })
}
var diff_1 = document.getElementById('diff_1')
if(diff_1){
  diff_1.addEventListener('click', function(){
    panes=2;initUI()
  })
}
var diff_2 = document.getElementById('diff_2')
if(diff_2){
  diff_2.addEventListener('click', function(){
    panes=3;initUI()
  })
}