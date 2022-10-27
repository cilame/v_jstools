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
  });
  resize(dv, window.innerHeight-100)
}

initUI();
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