import test from 'ava';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import path from 'path';

var customStubs = {
  mkdirpStub: function () { }
};

var requireStub = {
  './test-config.json': {
    "keep_fnames": true,
    '@noCallThru': true
  },
  fs: {
    writeFile: function () { }
  },
  mkdirp: function () {
    return customStubs.mkdirpStub.apply(this, arguments);
  },
  'uglify-js': {
    minify: function () { }
  },
  'uglify-es': {
    minify: function () { }
  }
};

var uglifyJsFolder = proxyquire('../index', requireStub);
var sandbox;

test.beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

test.afterEach(() => {
  sandbox.restore();
});

test('exports a functions', t => {
  t.is(typeof uglifyJsFolder, 'function');
});

test('calls minify for all the files', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  uglifyJsFolder(__dirname + '/fixtures/folder1');

  t.deepEqual(requireStub['uglify-js'].minify.callCount, 2);
});

test('calls minify for all nested files', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  uglifyJsFolder(__dirname + '/fixtures/folder2');

  t.deepEqual(requireStub['uglify-js'].minify.callCount, 2);
});

test('comments are present when minifying in a single file', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1');

  t.true(result.indexOf('/**** file1.js ****/') > -1);
  t.true(result.indexOf('/**** file2.js ****/') > -1);
});

test('skip comments if disabled', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    comments: false
  });

  t.true(result.indexOf('/**** file1.js ****/') == -1);
  t.true(result.indexOf('/**** file2.js ****/') == -1);
});

test('write file if the output parameter is present', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').callsArg(1);
  sandbox.stub(requireStub.fs, 'writeFile');

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    output: 'subfolder/scripts.min.js'
  });

  t.true(customStubs.mkdirpStub.calledOnce);
  t.true(customStubs.mkdirpStub.calledWith('subfolder'));
  t.true(requireStub.fs.writeFile.calledWith('subfolder/scripts.min.js'));
});

test('write files in the specified output folder', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').callsArg(1);
  sandbox.stub(requireStub.fs, 'writeFile');

  var dirPath = __dirname + '/fixtures/folder1';
  var outputPath = 'folder/dist';

  var result = uglifyJsFolder(dirPath, {
    output: outputPath,
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[0][0], outputPath + '/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[1][0], outputPath + '/file2.min.js'), '');
});

test('maintain subfolder structure', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').callsArg(1);
  sandbox.stub(requireStub.fs, 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';
  var outputPath = 'folder/dist';

  var result = uglifyJsFolder(dirPath, {
    output: outputPath,
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[0][0], outputPath + '/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[1][0], outputPath + '/folder2-nested/file2.min.js'), '');
});

test('_out_ used as default output folder', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').callsArg(1);
  sandbox.stub(requireStub.fs, 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';

  var result = uglifyJsFolder(dirPath, {
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[0][0], '_out_/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[1][0], '_out_/folder2-nested/file2.min.js'), '');
});

test('uses custom extension', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').callsArg(1);
  sandbox.stub(requireStub.fs, 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';

  var result = uglifyJsFolder(dirPath, {
    each: true,
    extension: '.test.txx'
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[0][0], '_out_/file1.test.txx'), '');
  t.deepEqual(path.relative(requireStub.fs.writeFile.args[1][0], '_out_/folder2-nested/file2.test.txx'), '');
});

test('uses the standard uglifyjs when the es6 parameter is not present', t => {
  var uglifyJS = sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var uglifyES6 = sandbox.stub(requireStub['uglify-es'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    output: 'subfolder/scripts.min.js'
  });

  t.deepEqual(uglifyJS.callCount, 2);
  t.deepEqual(uglifyES6.callCount, 0);
});

test('uses uglify-es when the es6 parameter is true', t => {
  var uglifyJS = sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var uglifyES6 = sandbox.stub(requireStub['uglify-es'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    output: 'subfolder/scripts.min.js',
    es6: true
  });

  t.deepEqual(uglifyJS.callCount, 0);
  t.deepEqual(uglifyES6.callCount, 2);

});

test('uses the pattern parameter', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    patterns: ['file*.js']
  });

  t.true(result.indexOf('/**** file1.js ****/') != -1);
  t.true(result.indexOf('/**** ignore1.js ****/') == -1);
});

test('accepts negative pattern pattern', t => {
  sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    patterns: ['**/*.js', '!ignore*.js']
  });

  t.true(result.indexOf('/**** file1.js ****/') != -1);
  t.true(result.indexOf('/**** ignore1.js ****/') == -1);
});

test('has an empty minify configuration if no configguration file is specified', t => {
  var minifyStub = sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {});

  t.deepEqual(minifyStub.callCount, 2);
  t.deepEqual(minifyStub.firstCall.args[1], {});
});


test('uses the specified config file', t => {
  var minifyStub = sandbox.stub(requireStub['uglify-js'], 'minify').returns({
    code: ''
  });

  const sPath = sinon.stub(path, 'resolve')
  sPath.withArgs('./test-config.json').returns('./test-config.json');
  sPath.callThrough();

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    configFile: './test-config.json'
  });

  t.deepEqual(minifyStub.callCount, 2);
  t.deepEqual(minifyStub.firstCall.args[1], requireStub['./test-config.json']);
});

