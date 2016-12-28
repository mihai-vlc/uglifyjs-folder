'use strict';

var uglifyJS = require('uglify-js');
var readDir = require('readdir');
var path = require('path');
var extend = require('extend');
var fs = require('fs');
var mkdirp = require('mkdirp');

var defaultOptions = {
  comments: true,
  output: '',
  each: false,
  extension: '.min.js'
};

module.exports = function (dirPath, options) {
  options = extend({}, defaultOptions, options);

  // grab and minify all the js files
  var files = readDir.readSync(dirPath, ['**.js']);

  if (options.each) {
    // minify each file individually
    files.forEach(function (fileName) {
      options.output = isEmpty(options.output) ? '_out_' : options.output;
      var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;

      var code = uglifyJS.minify(path.join(dirPath, fileName)).code;
      writeFile(newName, code);
    });

  } else {

    var result = '';
    // concatenate all the files into one
    files.forEach(function (fileName) {
      if (options.comments) {
        result += '/**** ' + fileName + ' ****/\n';
      }

      result += uglifyJS.minify(path.join(dirPath, fileName)).code + '\n';
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

