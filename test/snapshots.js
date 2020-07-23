var test = require('ava');
var fs = require('fs');
var del = require('del');
var globby = require('globby');
var path = require('path');
var process = require('process');
var mkdrip = require('mkdirp');

var uglifyJSFolder = require('../index');

var dataDir = path.join(__dirname, 'snapshots-data');
var workingDir = path.normalize(path.join(__dirname, '..', 'tmp'));

mkdrip.sync(workingDir);
process.chdir(workingDir);

test.serial.beforeEach(() => {
  var files = globby.sync('**', {
    cwd: path.join(dataDir, 'source-files')
  });

  files.forEach(file => {
    var source = path.join(dataDir, 'source-files', file);
    var destination = path.join(workingDir, file);

    mkdrip.sync(path.dirname(destination));
    fs.copyFileSync(source, destination);
  })
});

test.serial.afterEach(() => {
  // clear the working directory
  del.sync([
    path.join(workingDir, '**'),
    path.join(workingDir, '*')
  ]);
});

test.serial('Minifier using the default options', t => {
  var result = uglifyJSFolder(workingDir);

  t.snapshot(globby.sync('**'), 'Folder structure');
  t.snapshot(result, 'Return value');
});

test.serial('Minifier with no comments', t => {
  var result = uglifyJSFolder(workingDir, {
    comments: false
  });

  t.snapshot(globby.sync('**'), 'Folder structure');
  t.snapshot(result, 'Return value');
});



test.serial.cb('Minifier with the --each flag and empty output', t => {
  var opts = {
    each: true,
    callback: function () {
      t.snapshot(globby.sync('**'), 'Folder structure');
      t.end();
    }
  };
  var result = uglifyJSFolder(workingDir, opts);

  t.snapshot(result, 'Return value');
});


test.serial.cb('Minifier with output file', t => {
  var opts = {
    output: 'all.min.js',
    callback: function () {
      t.snapshot(globby.sync('**'), 'Folder structure');
      t.snapshot(fs.readFileSync('all.min.js', 'utf-8'), 'all.min.js');
      t.end();
    }
  };
  var result = uglifyJSFolder(workingDir, opts);

  t.snapshot(result, 'Return value');
});


