function get_html(url){
    var json = save_cache
    function replaceX(e, r, n) {
        var t, u, f, i, l;
        t = e.indexOf(r);
        if (t >= 0) {
            f = e.substr(0, t);
            u = r.length;
            i = e.substr(t + u, e.length - (t + u) + 1);
            l = f + n + i;
            t = l.indexOf(r);
            return t >= 0 ? replaceX(l, r, n) : l;
        }
        return e;
    }
    function script_escape(str){
        str = str.replace(/<( *\/ *script *>)/g, '\\x3C$1')
        return str.replace(/<( *script *>)/g, '\\x3C$1')
    }
    if (!json[url]){
        return
    }
    var $ = cheerio.load(json[url].data)
    var keys = Object.keys(json)
    var used_script = []
    function get_match(src, type) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf(src) != -1 && json[keys[i]].type == type){
                if (json[keys[i]].type == 'Script'){
                    used_script.push(keys[i])
                }
                return json[keys[i]].data
            }
        }
    }
    var scripts = $("script")
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i]
        if (script.attribs && script.attribs.src){
            console.log(script.attribs.src)
            var src = script.attribs.src
            var rep = get_match(src, 'Script')
            if (rep){
                script.children.push({
                    type: 'text',
                    data: script_escape(rep),
                    parent: script,
                    prev: null,
                    next: null,
                })
                delete script.attribs.src
            }else{
                console.log('not find...', src)
            }
        }
    }
    var links = $("link")
    for (var i = 0; i < links.length; i++) {
        var link = links[i]
        if (link.attribs && link.attribs.href){
            var href = link.attribs.href
            var data = get_match(href, 'Stylesheet')
            if (data){
                var mlist = data.match(/url\( *[^\( ]+ *\)/g)
                if (mlist){
                    mlist = mlist.map(function(e){
                        return /url\( *([^\( ]+) *\)/g.exec(e)[1]
                    })
                    for (var j = 0; j < mlist.length; j++) {
                        var woff = get_match(mlist[j], 'Font')
                        if (woff){
                            console.log(mlist[j])
                            data = replaceX(data, mlist[j], 'data:application/x-font-woff;charset=utf-8;base64,' + woff)
                        }
                    }
                }
                var style = cheerio.load("<style>" + data + "</style>")("style")
                $(link).replaceWith(style);
            }
            // var data = get_match(href, 'Font')
            // if (data){
            //     console.log(href, href in json)
            // }
            var data = get_match(href, 'Other')
            if (data){
                link.attribs.href = "data:;base64," + data
            }
            // console.log(link)
            console.log(href)
        }
    }
    var imgs = $('img')
    for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i]
        if (img.attribs && img.attribs.src){
            var src = img.attribs.src
            var rep = get_match(src, 'Image')
            if (rep){
                console.log('ok', src)
                img.attribs.src = "data:image/png;base64," + rep
            }else{
                console.log('img not find...', src)
            }
        }
    }
    var json_obj = {};
    var func_str = ''
    for (var i = 0; i < keys.length; i++) {
        if (json[keys[i]].type == 'Script' && used_script.indexOf(keys[i]) == -1){
            console.log('not find script...', keys[i], json[keys[i]].data.length)
            json_obj[keys[i]] = {}
            json_obj[keys[i]].type = json[keys[i]].type
            json_obj[keys[i]].func = `vilame_run${i}`
            func_str += script_escape(`vilame_json['vilame_run${i}'] = function (){${json[keys[i]].data}}`) + '\n'
        }
    }
    var insert_code = `
    var vilame_json = ` + JSON.stringify(json_obj) + `
    ` + func_str + `
    var vilame_keys = Object.keys(vilame_json)
    function get_match(src){
        for (var i = 0; i < vilame_keys.length; i++) {
            if (vilame_keys[i].indexOf(src) != -1){
                return vilame_json[vilame_json[vilame_keys[i]].func]
            }
        }
    }
    var v_insertBefore = Node.prototype.insertBefore
    Node.prototype.insertBefore = function(v){
        var src;
        if (v && v.getAttribute && (src = v.getAttribute('src'))){
            var func = get_match(src)
            if (func){
                setTimeout(func, 0)
                return
            }
        }
        return v_insertBefore.apply(this, arguments)
    }
    var v_appendChild = Node.prototype.appendChild
    Node.prototype.appendChild = function(v){
        if (v && v.getAttribute && (src = v.getAttribute('src'))){
            var func = get_match(src)
            if (func){
                setTimeout(func, 0)
                return
            }
        }
        return v_appendChild.apply(this, arguments)
    }
    `
    var insert_script = cheerio.load("<script>" + script_escape(insert_code) + "</script>")("script")[0]
    var head = $("head")
    if (head.length){
        head.append(insert_script)
    }
    return $.html()
}