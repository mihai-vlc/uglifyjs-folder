var test = require('ava');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var path = require('path');

var customStubs = {
  mkdirpStub: function () { return Promise.resolve() }
};

var requireStub = {
  './test-config.json': {
    "keep_fnames": true,
    '@noCallThru': true
  },
  'graceful-fs': {
    writeFile: function () { }
  },
  mkdirp: function () {
    return customStubs.mkdirpStub.apply(this, arguments);
  },
  'terser': {
    minify: function () { }
  },
};

var uglifyJsFolder = proxyquire('../index', requireStub);
var sandbox;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
});

test.afterEach(() => {
  sandbox.restore();
});

test.serial('exports a functions', t => {
  t.is(typeof uglifyJsFolder, 'function');
});

test.serial('calls minify for all the files', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  uglifyJsFolder(__dirname + '/fixtures/folder1');

  t.deepEqual(requireStub['terser'].minify.callCount, 1);
});

test.serial('calls minify for all nested files', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  uglifyJsFolder(__dirname + '/fixtures/folder2');

  t.deepEqual(requireStub['terser'].minify.callCount, 1);
});

test.serial('comments are present by default', t => {
  delete requireStub['terser'].minify;

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1');

  t.true(result.indexOf('/**** file1.js ****/') > -1);
  t.true(result.indexOf('/**** file2.js ****/') > -1);

  requireStub['terser'].minify = function () {};
});

test.serial('skip comments if disabled', t => {
  delete requireStub['terser'].minify;

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    comments: false
  });

  t.true(result.indexOf('/**** file1.js ****/') == -1);
  t.true(result.indexOf('/**** file2.js ****/') == -1);

  requireStub['terser'].minify = function () {};
});

test.serial('write file if the output parameter is present', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').returns({
    then: sinon.stub().callsArg(0).returns({
      catch: sinon.stub()
    })
  });
  sandbox.stub(requireStub['graceful-fs'], 'writeFile');

  var result = uglifyJsFolder(__dirname + '/fixtures/folder1', {
    output: 'subfolder/scripts.min.js'
  });

  t.true(customStubs.mkdirpStub.calledOnce);
  t.true(customStubs.mkdirpStub.calledWith('subfolder'));
  t.true(requireStub['graceful-fs'].writeFile.calledWith('subfolder/scripts.min.js'));
});

test.serial('write files in the specified output folder', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').returns({
    then: sinon.stub().callsArg(0).returns({
      catch: sinon.stub()
    })
  });
  sandbox.stub(requireStub['graceful-fs'], 'writeFile');

  var dirPath = __dirname + '/fixtures/folder1';
  var outputPath = 'folder/dist';

  var result = uglifyJsFolder(dirPath, {
    output: outputPath,
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[0][0], outputPath + '/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[1][0], outputPath + '/file2.min.js'), '');
});

test.serial('maintain subfolder structure', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').returns({
    then: sinon.stub().callsArg(0).returns({
      catch: sinon.stub()
    })
  });
  sandbox.stub(requireStub['graceful-fs'], 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';
  var outputPath = 'folder/dist';

  var result = uglifyJsFolder(dirPath, {
    output: outputPath,
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[0][0], outputPath + '/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[1][0], outputPath + '/folder2-nested/file2.min.js'), '');
});

test.serial('_out_ used as default output folder', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').returns({
    then: sinon.stub().callsArg(0).returns({
      catch: sinon.stub()
    })
  });
  sandbox.stub(requireStub['graceful-fs'], 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';

  var result = uglifyJsFolder(dirPath, {
    each: true
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[0][0], '_out_/file1.min.js'), '');
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[1][0], '_out_/folder2-nested/file2.min.js'), '');
});

test.serial('uses custom extension', t => {
  sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  sandbox.stub(customStubs, 'mkdirpStub').returns({
    then: sinon.stub().callsArg(0).returns({
      catch: sinon.stub()
    })
  });
  sandbox.stub(requireStub['graceful-fs'], 'writeFile');

  var dirPath = __dirname + '/fixtures/folder2';

  var result = uglifyJsFolder(dirPath, {
    each: true,
    extension: '.test.txx'
  });

  t.deepEqual(customStubs.mkdirpStub.callCount, 2);
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[0][0], '_out_/file1.test.txx'), '');
  t.deepEqual(path.relative(requireStub['graceful-fs'].writeFile.args[1][0], '_out_/folder2-nested/file2.test.txx'), '');
});


test.serial('uses the pattern parameter', t => {
  delete requireStub['terser'].minify;

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    patterns: ['file*.js']
  });

  t.true(result.indexOf('/**** file1.js ****/') != -1);
  t.true(result.indexOf('/**** ignore1.js ****/') == -1);

  requireStub['terser'].minify = function () {};
});

test.serial('accepts negative pattern pattern', t => {
  delete requireStub['terser'].minify;

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    patterns: ['**/*.js', '!ignore*.js']
  });

  t.true(result.indexOf('/**** file1.js ****/') != -1);
  t.true(result.indexOf('/**** ignore1.js ****/') == -1);

  requireStub['terser'].minify = function () {};
});

test.serial('has a default minify configuration if no configuration file is specified', t => {
  var minifyStub = sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {});

  t.deepEqual(minifyStub.callCount, 1);
  t.truthy(minifyStub.firstCall.args[1]);
});


test.serial('uses the specified config file', t => {
  var minifyStub = sandbox.stub(requireStub['terser'], 'minify').returns({
    code: ''
  });

  var sPath = sinon.stub(path, 'resolve')
  sPath.withArgs('./test-config.json').returns('./test-config.json');
  sPath.callThrough();

  var result = uglifyJsFolder(__dirname + '/fixtures/folder3', {
    configFile: './test-config.json'
  });

  t.deepEqual(minifyStub.callCount, 1);
  t.deepEqual(minifyStub.firstCall.args[1].keep_fnames, requireStub['./test-config.json'].keep_fnames);
});

