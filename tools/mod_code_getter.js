function errorHandler(e){
    console.log(e)
}

function get_file(filename, callback){
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getFile(filename, {}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    // console.log(e, this.result)
                    callback(this.result)
                }
                reader.readAsText(file);
            }, errorHandler);
        }, errorHandler);
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