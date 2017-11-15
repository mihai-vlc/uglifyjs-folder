'use strict';

var uglifyJS;
var globby = require("globby")
var path = require('path');
var extend = require('extend');
var fs = require('fs');
var mkdirp = require('mkdirp');

var defaultOptions = {
  comments: true,
  output: '',
  each: false,
  extension: '.min.js',
  es6: false,
  patterns: ['**/*.js'],
  configFile: null
};

module.exports = function (dirPath, options) {
  options = extend({}, defaultOptions, options);

  if (options.es6) {
    uglifyJS = require('uglify-es');
  } else {
    uglifyJS = require('uglify-js');
  }

  var uglifyConfiguration = options.configFile ? require(path.resolve(options.configFile)) : {};

  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath
  });

  if (options.each) {
    // minify each file individually
    files.forEach(function (fileName) {
      options.output = isEmpty(options.output) ? '_out_' : options.output;
      var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;
      var originalCode = readFile(path.join(dirPath, fileName));
      var minifyResult = uglifyJS.minify(originalCode, uglifyConfiguration);

      if (minifyResult.error) {
        console.log(minifyResult.error);
        throw minifyResult.error;
      }

      writeFile(newName, minifyResult.code);
    });

  } else {

    var result = '';
    // concatenate all the files into one
    files.forEach(function (fileName) {
      if (options.comments) {
        result += '/**** ' + fileName + ' ****/\n';
      }
      var originalCode = readFile(path.join(dirPath, fileName));
      var minifyResult = uglifyJS.minify(originalCode, uglifyConfiguration);

      if (minifyResult.error) {
        console.log(minifyResult.error);
        throw minifyResult.error;
      }
      result += minifyResult.code + '\n';
    });

    if (isEmpty(options.output)) {
      return result;
    } else {
      writeFile(options.output, result);
    }

  }

};

/**
 * Checks if the provided parameter is not an empty string.
 */
function isEmpty(str) {
  if (typeof str != 'string' || str.trim() == '') {
    return true;
  }
  return false;
}

function readFile(path) {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (e) {
    console.error("UGLIFYJS FOLDER ERROR: ", path, "was not found !");
    return '';
  }
}

/**
 * Writes the code at the specified path.
 */
function writeFile(filePath, code) {

  mkdirp(path.dirname(filePath), function () {

    fs.writeFile(filePath, code, function (err) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      console.log('File ' + filePath + ' written successfully !');
    });
  });

}

