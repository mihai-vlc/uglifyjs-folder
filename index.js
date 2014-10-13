'use strict';

var uglifyJS = require('uglify-js');
var readDir = require('readdir');
var path = require('path');
var extend = require('extend');
var fs = require('fs');
var mkdirp = require('mkdirp');

var _default = {
  comments: true,
  output: '',
  each: false
};

module.exports = function(dirPath, options) {
  var res = '';
  var opt = extend({}, _default, options);

  // grab and minify all the js files
  var files = readDir.readSync(dirPath, ['**.js']);

  files.forEach(function(v, i) {
    var code, newName;

    // minify each file in the new folder
    if (opt.each) {
      code = uglifyJS.minify(path.join(dirPath, v)).code;

      // build the new path
      if ( ! isValidOutput(opt.output)) {
        opt.output = '_out_';
      }
      newName = path.join(opt.output,
        path.dirname(v), path.basename(v, path.extname(v))) + '.min.js';

      mkdirp.sync(path.dirname(newName));

      fs.writeFile(newName, code, function(err) {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        console.log('File ' + newName + ' written successfully !');
      });

    } else {
      // concatenate all the files into one
      if (opt.comments) {
        res += '/**** ' + v + ' ****/\n';
      }

      res += uglifyJS.minify(path.join(dirPath, v)).code + '\n';
    }

  });

  // return or write the content in the output file
  if (opt.output) {

    if (!opt.each) {

      if ( ! isValidOutput(opt.output)) {
        opt.output = '_out_.js';
      }
      fs.writeFile(opt.output, res, function(err) {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        console.log('File ' + opt.output + ' written successfully !');
      });
    }

  } else {

    return res;
  }


  function isValidOutput(str) {
    if (typeof opt.output != 'string' || opt.output.trim() == '') {
      return false;
    }
    return true;
  }

};
