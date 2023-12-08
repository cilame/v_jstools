window.onload = function() {
    var nav = document.getElementById('nav');
    var oNav = nav.getElementsByTagName('button');
    var container = document.getElementById('container');
    var oDiv = container.getElementsByClassName('tab');
    for (var i = 0; i < oNav.length; i++) {
        oNav[i].index = i;
        oNav[i].onclick = function() {
            for (var i = 0; i < oNav.length; i++) {
                oNav[i].className = '';
                oDiv[i].style.display = "none";
            }
            this.className = 'act';
            oDiv[this.index].style.display = "block"
        }
        for (var m = 1; m < oNav.length; m++) {
            oNav[m].className = '';
            oDiv[m].style.display = "none";
        }
    }
}















// getsets_0
// funcs_0
// getsets_1
// funcs_1

function _mk_html(input, clsname, index){
  var div = document.getElementById(clsname)
  div.innerHTML += `
  <label ><input class="${clsname}-e0" type="checkbox" id="${clsname}" data-key="config-hook-all-${clsname}" vilame="${index}">${clsname} 全选/全不选<br /> </label>
  `
  var htmls = []
  var keys = []
  for (var i = 0; i < input.length; i++) {
    var kv = input[i]
    var k = kv[0]
    var v = kv[1]
    if (keys.indexOf(k) == -1){
      keys.push(k)
      htmls.push(`<label style="margin-left: 20px" >${k}<br /> </label>`)
    }
    htmls.push(`<label style="margin-left: 40px; display:block" ><input class="${clsname}-e2" checked=true type="checkbox" data-key="config-hook-${k}-${v}" vilame="${index}">${k} ${v}<br /></label> `)
  }
  div.innerHTML += htmls.join('')
}

_mk_html(getsets_0, 'getsets_0', 0)
_mk_html(funcs_0, 'funcs_0', 0)
_mk_html(getsets_1, 'getsets_1', 1)
_mk_html(funcs_1, 'funcs_1', 1)

document.querySelectorAll("input").forEach(function(v){
  if(!v.dataset.key) return
  chrome.storage.local.get([v.dataset.key], function (result) {
    if (v.type == 'checkbox'){
      v.checked = result[v.dataset.key];
    }
    if (v.type == 'text' || v.type == 'password'){
      v.value = result[v.dataset.key] || '';
    }
  })
  v.addEventListener("change", function (e) {
    if (v.type == 'checkbox'){
      // console.log(e.target.dataset.key, e.target.checked)
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.checked
      })
      if (e.target.dataset.key == 'config-pac_proxy'){
        if (e.target.checked){
          chrome.storage.local.get(['config-proxy_config'], function(res){
            if (res['config-proxy_config']){
              set_my_proxy(res['config-proxy_config'])
            }
          })
        }else{
          set_my_proxy()
        }
      }
      sub_logger()
    }
    if (v.type == 'text' || v.type == 'password'){
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.value
      })
    }
  })
})

function changer(name, index, v){
  if (v.target.dataset.key.indexOf('config-hook-all-') === -1){
    chrome.storage.local.set({
      [v.target.dataset.key]: v.target.checked
    })
    return
  }
  var ck = v.target.checked
  var wt = {}
  document.querySelectorAll("input").forEach(function(v){
    if (v.className.indexOf(name) !== -1){
      if (+v.getAttribute('vilame') == index){
        v.checked = ck
        wt[v.dataset.key] = v.checked
      }
    }
  })
  chrome.storage.local.set(wt)
}

document.getElementById('getsets_0').addEventListener("change", changer.bind(null, 'getsets_0', 0))
document.getElementById('funcs_0').addEventListener("change", changer.bind(null, 'funcs_0', 0))
document.getElementById('getsets_1').addEventListener("change", changer.bind(null, 'getsets_1', 1))
document.getElementById('funcs_1').addEventListener("change", changer.bind(null, 'funcs_1', 1))

var fetch_hook = document.getElementById('fetch_hook');
chrome.storage.local.get([fetch_hook.dataset.key], function (result) {
  fetch_hook.value = result[fetch_hook.dataset.key] || '';
})
function change_fetch_hook(v){    console.log('change_fetch_hook')
  chrome.storage.local.set({
    [v.target.dataset.key]: v.target.value
  })
}
fetch_hook.addEventListener("input", change_fetch_hook)
fetch_hook.addEventListener("change", change_fetch_hook)
fetch_hook.addEventListener("blur", change_fetch_hook)
var request_hook = document.getElementById('request_hook')
chrome.storage.local.get([request_hook.dataset.key], function (result) {
  request_hook.value = result[request_hook.dataset.key] || '';
})
function change_request_hook(v){    console.log('change_request_hook')
  chrome.storage.local.set({
    [v.target.dataset.key]: v.target.value
  })
}
request_hook.addEventListener("input", change_request_hook)
request_hook.addEventListener("change", change_request_hook)
request_hook.addEventListener("blur", change_request_hook)
var default_code_dyn_change_request = document.getElementById('default_code_dyn_change_request')
default_code_dyn_change_request.addEventListener('click', function(e){
    request_hook.value = 
`/* 
 * 在固定的函数名字里面编写你需要对特定参数修改的处理方式
 * 请勿修改下面函数的名字，需要的处理在函数内部处理即可
 * change_request 这个函数用于修改 Request 请求中的数据
 *     将修改后的值赋值给 config 就可以修改内容
 */

function change_request(config){
    var { url, method, postData, headers } = config
    var new_url = url
    var new_method = method
    var new_postData = postData
    var new_headers = headers

    // do something in here.
    if (method == 'POST'){
        console.log('new_postData', new_postData)
        config.postData = new_postData
    }
}`
    request_hook.focus()
})

var myinject = document.getElementById('myinject');
chrome.storage.local.get([myinject.dataset.key], function (result) {
  myinject.value = result[myinject.dataset.key] || '';
})
myinject.addEventListener("change", function(v){
  chrome.storage.local.set({
    [v.target.dataset.key]: v.target.value
  })
})
var myinject_2 = document.getElementById('myinject_2');
chrome.storage.local.get([myinject_2.dataset.key], function (result) {
  myinject_2.value = result[myinject_2.dataset.key] || '';
})
myinject_2.addEventListener("change", function(v){
  chrome.storage.local.set({
    [v.target.dataset.key]: v.target.value
  })
})

var get_now = document.getElementById('get_now');
get_now.addEventListener("click", function(){
  var show_now = document.getElementById('show_now')
  show_now.value = +new Date+''
  chrome.storage.local.set({
    [show_now.dataset.key]: show_now.value
  })
})

var cookie_match = document.getElementById('cookie_match');
cookie_match.addEventListener("click", function(){
  var show_now = document.getElementById('show_now')
  show_now.value = +new Date+''
  chrome.storage.local.set({
    [show_now.dataset.key]: show_now.value
  })
})



function clear_mode(func, is_comment){
  var code = /\{([\w\W]*)\}/.exec(func+'')[1]
  if (is_comment){
    code = code.replace(/\/\*\*([\w\W]*?)\*\//, '$1')
  }
  return code.trim()
}

var websocket_js = document.getElementById('websocket_js');
websocket_js.addEventListener("click", function(){
  var code_model = document.getElementById('code_model')
  code_model.value = clear_mode(mk_websocket_js_code)
})

var websocket_py = document.getElementById('websocket_py');
websocket_py.addEventListener("click", function(){
  var code_model = document.getElementById('code_model')
  code_model.value = clear_mode(mk_websocket_py_code, true)
})

var websocket_hook = document.getElementById('websocket_hook');
websocket_hook.addEventListener("click", function(){
  var code_model = document.getElementById('code_model')
  code_model.value = clear_mode(mk_websocket_hook_code)
})

var proxy_js = document.getElementById('proxy_js');
proxy_js.addEventListener("click", function(){
  var code_model = document.getElementById('code_model')
  code_model.value = clear_mode(mk_proxy_code)
})

var code_model = document.getElementById('code_model')
code_model.ondragover = function(e) {
    e.preventDefault();
}
code_model.ondrop = function(e) {
    e.preventDefault();
    var f = e.dataTransfer.files[0];
    var fr = new FileReader();
    fr.readAsDataURL(f);
    fr.onload = function(e) {
        code_model.value = this.result;
    }
}

var my_code_dec = document.getElementById('my_code_dec')
my_code_dec.ondragover = function(e) {
    e.preventDefault();
}
my_code_dec.ondrop = function(e) {
    e.preventDefault();
    var f = e.dataTransfer.files[0];
    var fr = new FileReader();
    fr.readAsText(f);
    fr.onload = function(e) {
        my_code_dec.value = this.result;
    }
}

var add_script_in_all_document = document.getElementById('add_script_in_all_document');
add_script_in_all_document.addEventListener("click", function(){
  debug_tab = true
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].url.indexOf("chrome") == 0){
        continue
      }
      attach_tab_debug(tabs[i].id)
    }
  });
})

var cache_tabid_new = {}
var cache_tabid_att = {}
var debug_tab = false
function attach_tab_debug(tabId){
  cache_tabid_new[tabId] = 1
  var tabids = Object.keys(cache_tabid_new)
  for (var i = 0; i < tabids.length; i++) {
    if (cache_tabid_new[tabids[i]] == 1 && !cache_tabid_att[tabids[i]]){
      cache_tabid_att[tabids[i]] = 1
      var currtab = { tabId: +tabids[i] };
      chrome.debugger.attach(currtab, "1.2", function () {
        chrome.debugger.sendCommand(currtab, "Page.enable", function(){});
        chrome.debugger.sendCommand(currtab, "Page.addScriptToEvaluateOnNewDocument", {
          source: myinject_2.value
        }, function(){});
      });
    }
  }
}
function attach_tab_debug_update(tabId, changeInfo, tab) {
  if (tab.url.indexOf('chrome://') == 0) return
  if (!debug_tab) return
  attach_tab_debug(tabId)
}
chrome.tabs.onUpdated.addListener(attach_tab_debug_update); 
chrome.debugger.onDetach.addListener(function(){
  cache_tabid_new = {}
  cache_tabid_att = {} 
  debug_tab = false 
})

var proxy_config = document.getElementById('proxy_config')
proxy_config.placeholder = `// 请在第一行输出你使用的 pac 路径例如： 
// 1: PROXY 127.0.0.1:8888
// 2: HTTPS hk2.link.ac.cn:152;HTTPS fmt1.link.ac.cn:995
`
chrome.storage.local.get([proxy_config.dataset.key], function (result) {
  proxy_config.value = result[proxy_config.dataset.key] || '';
})
function change_proxy_config(v){    console.log('change_proxy_config')
  chrome.storage.local.set({
    [v.target.dataset.key]: v.target.value
  })
}
proxy_config.addEventListener("input", change_proxy_config)
proxy_config.addEventListener("change", change_proxy_config)
proxy_config.addEventListener("blur", change_proxy_config)

var mysec = document.getElementById('my_secret')
var mycode_dec = document.getElementById('my_code_dec')
document.getElementById('myenc').addEventListener('click', function(e){
    try{
        var md5 = CryptoJS.MD5(mysec.value)+''
        var srcs = CryptoJS.enc.Utf8.parse(mycode_dec.value)
        var key = CryptoJS.enc.Utf8.parse(md5.slice(0, 16)); //16位
        var iv = CryptoJS.enc.Utf8.parse(md5.slice(16));
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
        mycode_dec.value = encrypted
    }catch(e){
        mycode_dec.value = e
    }
})
document.getElementById('mydec').addEventListener('click', function(e){
    try{
        var md5 = CryptoJS.MD5(mysec.value)+''
        var key = CryptoJS.enc.Utf8.parse(md5.slice(0, 16)); //16位
        var iv = CryptoJS.enc.Utf8.parse(md5.slice(16));
        var decrypted = CryptoJS.AES.decrypt(mycode_dec.value, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
        mycode_dec.value = decrypted
    }catch(e){
        mycode_dec.value = e
    }
})

function response_changer_init(idname, titlenames, init_data, callback) {
    var cid = "#" + idname
    var trlast = cid + " tr:last"
    var opindex = titlenames.length
    var title = "<tr>"
    for (var i = 0; i < titlenames.length; i++) {
        title += "<td>" + titlenames[i].split('|')[0] + "</td>"
    }
    title += "<td>操作</td>"
    title += "</tr>"
    title += '<tr><td colspan="5"><button>添加行</button><button>添加示例1(重定向到本地文件)</button><button>添加示例2(直接修改返回值)</button></td></tr>'
    $(cid).html(title)
    $($(trlast).find("button")[0]).click(function() {
        addRow()
    })
    $($(trlast).find("button")[1]).click(function() {
        addRow(["baidu.com", "file:///C:/Users/Administrator/Desktop/test.html", "redirect local."]) // 这里的最后一个值不能随意修改
        __cache_data()
    })
    $($(trlast).find("button")[2]).click(function() {
        addRow(["baidu.com", "console.log(123)", "change return data."]) // 这里的最后一个值不能随意修改
        __cache_data()
    })
    init_data = init_data || []
    for (var i = 0; i < init_data.length; i++) {
        addRow(init_data[i])
    }
    function __cache_data(){
        var data_list = []
        var trs = $(cid).find("tr")
        for (var i = 0; i < trs.length; i++) {
            var tds = $(trs[i]).find("td")
            var data_line = []
            for (var j = 0; j < tds.length; j++) {
                var ipt = $(tds[j]).find("input")[0]
                if (ipt){
                    data_line.push(ipt.value)
                }
            }
            if (data_line.length){
                data_list.push(data_line)
            }
        }
        while(init_data.length){ init_data.pop() }
        while(data_list.length){ init_data.unshift(data_list.pop()) }
        callback(init_data)
    }
    function __add_remover(index){
        $(cid).find("tr").eq(index).find("td").eq(opindex).remove();
        var htmlStr = "<td><button>删除行</button></td>"
        $(cid).find("tr").eq(index).append(htmlStr)
        $(cid).find("tr").eq(index).find("td").find("button").click(function(){
            removeRow(index)
        })
    }
    function __add_changer(index){
        var tds = $(cid).find("tr").eq(index).find("td")
        for (var i = 0; i < tds.length; i++) {
            var ipt = $(tds[i]).find("input")[0]
            if (ipt){
                $(ipt).on("input", function(){
                    __cache_data()
                })
            }
        }
    }
    function addRow(data) {
        var trArray = $(cid).find("tr");
        var thisIndex = trArray.length - 1;
        var addRowHtmlStr = "<tr>"
        for (var i = 0; i < titlenames.length; i++) {
            var [name, style, disabled] = titlenames[i].split('|')
            style = style || 'width: 300px'
            if (disabled == 'true'){
                disabled = 'disabled="disabled" readonly="readonly"'
            }else if (disabled == 'false' || disabled == '' || disabled === undefined){
                disabled = ''
            }else { throw Error('not in "true" or "false" string.') }
            addRowHtmlStr += `<td style='width: 300px'><input type='text' style='${style}' ${disabled}></td>`
        }
        "<td></td></tr>"
        $(trlast).before(addRowHtmlStr);
        __add_changer(thisIndex)
        __add_remover(thisIndex)
        if (data){ 
            var ctds = $(cid).find("tr").eq(thisIndex).find("td")
            var leng = Math.min(data.length, titlenames.length)
            for (var i = 0; i < leng; i++) {
                $(ctds[i]).find('input').val(data[i])
            }
        }
    }
    function removeRow(index) {
        $(cid).find("tr").eq(index).remove();
        var trArrayNow = $(cid).find("tr");
        for (var i = index; i < trArrayNow.length - 1; i++) {
            __add_remover(i)
        }
        __cache_data()
    }
}

chrome.storage.local.get(["response_changer"], function(res){
    var init_data = JSON.parse(res["response_changer"] || "[]")
    localStorage.webRedirect = JSON.stringify(init_data)
    response_changer_init("response_changer", ["(URL)字符串匹配", "重定向地址或修改的字符串", "类型|width:120px|true"], init_data, function(data){
        chrome.storage.local.set({
            response_changer: JSON.stringify(data)
        })
        localStorage.webRedirect = JSON.stringify(data)
    })
})