function html_script_replacer(body, replacer, url){
  var html = cheerio.load(body)
  var scripts = html("script");
  if (!scripts.length){
    return
  }
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i]
    if (script.attribs.src){
      continue
    }
    if (!script.children.length){
      continue
    }
    if (script.attribs.type != 'text/javascript' && script.attribs.type !== undefined){
      continue
    }
    var jscode = ''
    for (var j = 0; j < script.children.length; j++) {
      jscode += script.children[j].data
    }
    if (!jscode){
      return
    }
    var newscript = cheerio.load("<script>" + replacer(jscode, url) + "</script>")("script");
    newscript.attribs = script.attribs;
    html(script).replaceWith(newscript);
  }
  return html.html()
}