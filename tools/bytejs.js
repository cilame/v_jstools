// makebytejs.js
var vm = require('vm');
var fs = require('fs');
var _module = require('module');
var v8 = require('v8');
v8.setFlagsFromString('--no-lazy');

function xor(buffer){
  var key = '123456789'.split('').map(function(e){return e.charCodeAt()})
  for (var i = 0; i < buffer.length; i++) {
    buffer[i] ^= key[i % key.length]
  }
}

function compileFile(filePath) {
  if (!fs.existsSync(filePath)) return
  var code = fs.readFileSync(filePath, 'utf-8');
  var script = new vm.Script(_module.wrap(code));
  var bytecode = script.createCachedData();
  xor(bytecode)
  fs.writeFileSync('main.bytecode', bytecode);
}
compileFile('./main_.js');


// runbytejs.js
var _module = require('module');
var path = require('path');
var fs = require('fs')
var vm = require('vm');
var v8 = require('v8');
v8.setFlagsFromString('--no-flush-bytecode');
function validateString(value, name) {
  if (typeof value !== 'string') {
    throw new Error(`${name} is not string`);
  }
}
function makeRequireFunction(mod) {
  var Module = mod.constructor;
    var require = function require(path) {
    return mod.require(path);
  };
    require.resolve = function resolve(request, options) {
    validateString(request, 'request');
    return Module._resolveFilename(request, mod, false, options);
  }
    require.resolve.paths = function paths(request) {
    validateString(request, 'request');
    return Module._resolveLookupPaths(request, mod);
  };
    require.main = process.mainModule;
  require.extensions = Module._extensions;
  require.cache = Module._cache;
    return require;
}
var HeaderOffsetMap = {
  'magic': 0,
  'version_hash': 4,
  'source_hash': 8,
  'flag_hash': 12
};
function getFlagBuf() {
  var script = new vm.Script("");
  return getHeader(script.createCachedData(), 'flag_hash');
}
function getHeader(buffer, type) {
  var offset = HeaderOffsetMap[type];
  return buffer.slice(offset, offset + 4);
}
function setHeader(buffer, type, vBuffer) {
  vBuffer.copy(buffer, HeaderOffsetMap[type]);
}
function buf2num(buf) {
  // 注意字节序问题
  var ret = 0;
  ret |= buf[3] << 24;
  ret |= buf[2] << 16;
  ret |= buf[1] << 8;
  ret |= buf[0];
    return ret;
}
function loadBytecode(filePath) {
  var bytecode = fs.readFileSync(filePath, null);
  xor(bytecode)
  setHeader(bytecode, 'flag_hash', getFlagBuf());
  var sourceHash = buf2num(getHeader(bytecode, 'source_hash'));
  var script = new vm.Script(' '.repeat(sourceHash), {
    filename: filePath,
    cachedData: bytecode,
    lineOffset: 0,
    displayErrors: true
  });
    if (script.cachedDataRejected) {
    throw new Error('something is wrong');
  }
  return script;
}
_module._extensions['.bytecode'] = function (module, filename) {
  var script = loadBytecode(filename, false);
  var wrapperFn = script.runInThisContext({
    filename: filename,
    displayErrors: true,
    lineOffset: 0,
    columnOffset: 0,
  });
  var require = makeRequireFunction(module);
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
}

require('./main.bytecode')