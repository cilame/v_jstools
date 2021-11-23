// makebytejs.js
const vm = require('vm');
const fs = require('fs').promises;
const _module = require('module');
const v8 = require('v8');
v8.setFlagsFromString('--no-lazy');

async function compileFile(filePath) {
  const code = await fs.readFile(filePath, 'utf-8');
  const script = new vm.Script(_module.wrap(code));
  const bytecode = script.createCachedData();
  await fs.writeFile(filePath.replace(/\.js$/i, '.bytecode'), bytecode);
}
compileFile('./test.js');



// runbytejs.js
const _module = require('module');
const path = require('path');
const fs = require('fs')
const vm = require('vm');
const v8 = require('v8');
v8.setFlagsFromString('--no-flush-bytecode');
function validateString(value, name) {
  if (typeof value !== 'string') {
    throw new Error(`${name} is not string`);
  }
}
function makeRequireFunction(mod) {
  const Module = mod.constructor;
    const require = function require(path) {
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
const HeaderOffsetMap = {
  'magic': 0,
  'version_hash': 4,
  'source_hash': 8,
  'flag_hash': 12
};
let _flag_buf;
function getFlagBuf() {
  if (!_flag_buf) {
    const script = new vm.Script("");
    _flag_buf = getHeader(script.createCachedData(), 'flag_hash');
  }
  return _flag_buf;
}
function getHeader(buffer, type) {
  const offset = HeaderOffsetMap[type];
  return buffer.slice(offset, offset + 4);
}
function setHeader(buffer, type, vBuffer) {
  vBuffer.copy(buffer, HeaderOffsetMap[type]);
}
function buf2num(buf) {
  // 注意字节序问题
  let ret = 0;
  ret |= buf[3] << 24;
  ret |= buf[2] << 16;
  ret |= buf[1] << 8;
  ret |= buf[0];
    return ret;
}
function loadBytecode(filePath) {
  const bytecode = fs.readFileSync(filePath, null);
  console.log(bytecode.toString('latin1'))
  setHeader(bytecode, 'flag_hash', getFlagBuf());
  const sourceHash = buf2num(getHeader(bytecode, 'source_hash'));
  const script = new vm.Script(' '.repeat(sourceHash), {
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
  const script = loadBytecode(filename, false);
  const wrapperFn = script.runInThisContext({
    filename: filename,
    displayErrors: true,
    lineOffset: 0,
    columnOffset: 0,
  });
  const require = makeRequireFunction(module);
  wrapperFn.bind(module.exports)(module.exports, require, module, filename, path.dirname(filename));
}

require('./test.bytecode')

console.log(window.top == window.self)