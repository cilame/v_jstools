function errorHandler(e){
    console.log(e)
}

function get_file(filename, callback, errcallback){
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getFile(filename, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    // console.log(e, this.result)
                    callback(this.result)
                }
                reader.readAsText(file);
            }, (errcallback||errorHandler));
        }, (errcallback||errorHandler));
    });
}

var test_get_model_code = document.getElementById('test_get_model_code')
if (test_get_model_code){
    test_get_model_code.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/mod_code_getter.js', callback)
    })
}

var get_code_babel_ast = document.getElementById('get_code_babel_ast')
if (get_code_babel_ast){
    get_code_babel_ast.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/babel_asttool.js', callback)
    })
}

var get_code_cryptojs = document.getElementById('get_code_cryptojs')
if (get_code_cryptojs){
    get_code_cryptojs.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/cryptojs.js', callback)
    })
}

var get_code_uglifyjs = document.getElementById('get_code_uglifyjs')
if (get_code_uglifyjs){
    get_code_uglifyjs.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/uglify_es.js', callback)
    })
}

var get_code_request = document.getElementById('get_code_request')
if (get_code_request){
    get_code_request.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/request.js', callback)
    })
}

var get_code_jsencrypt = document.getElementById('get_code_jsencrypt')
if (get_code_jsencrypt){
    get_code_jsencrypt.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/jsencrypt.js', callback)
    })
}

var get_code_cheerio = document.getElementById('get_code_cheerio')
if (get_code_cheerio){
    get_code_cheerio.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/cheerio.js', callback)
    })
}

var get_code_terser = document.getElementById('get_code_terser')
if (get_code_terser){
    get_code_terser.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/terser.js', callback)
    })
}

var get_code_parse5 = document.getElementById('get_code_parse5')
if (get_code_parse5){
    get_code_parse5.addEventListener('click', function(e){
        function callback(text){
            document.getElementById('my_code_dec').value = text
        }
        get_file('tools/parse5.js', callback)
    })
}