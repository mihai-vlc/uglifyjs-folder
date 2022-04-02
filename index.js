'use strict';


var globby = require("globby")
var path = require('path');
var extend = require('extend');
var fs = require('graceful-fs');
var mkdirp = require('mkdirp');

var defaultOptions = {
  comments: true,
  output: '',
  each: false,
  extension: '.min.js',
  patterns: ['**/*.js'],
  configFile: null,
  callback: null,
  logLevel: 'info'
};


module.exports = async function (dirPath, options) {
  options = extend({}, defaultOptions, options);

  var minifier = require('terser');
  var state = {
    processCounter: 0,
    logLevel: options.logLevel,
    callback: options.callback
  };

  var uglifyConfiguration = options.configFile ? require(path.resolve(options.configFile)) : {};

  // grab and minify all the js files
  var files = globby.sync(options.patterns, {
    cwd: dirPath
  });

  if (options.each) {

    // minify each file individually
    files.forEach(async function (fileName) {
      options.output = isEmpty(options.output) ? '_out_' : options.output;
      var newName = path.join(options.output, path.dirname(fileName), path.basename(fileName, path.extname(fileName))) + options.extension;
      var originalCode = {};
      originalCode[fileName] = readFile(path.join(dirPath, fileName));
      var minifyResult = await minifier.minify(originalCode, getUglifyOptions(newName, uglifyConfiguration));

      if (minifyResult.error) {
        console.error(minifyResult.error);
        throw minifyResult.error;
      }

      writeFile(newName, minifyResult.code, state);

      if (minifyResult.map) {
        var mapContent = updateSourcesPath(fileName, minifyResult.map);
        writeFile(newName + '.map', mapContent, state);
      }
    });

  } else {

    // concatenate all the files into one
    var originalCode = {};

    files.forEach(function (fileName) {
      var source = readFile(path.join(dirPath, fileName));

      if (options.comments) {
        source = '/**** ' + fileName + ' ****/\n' + source;
      }
      originalCode[fileName] = source;
    });

    var uglifyOptions = getUglifyOptions(options.output, uglifyConfiguration);

    if (options.comments) {
      uglifyOptions.output = uglifyOptions.output || {};
      uglifyOptions.output.comments = uglifyOptions.output.comments || '/\\*{2}/';
    }

    var minifyResult = await minifier.minify(originalCode, uglifyOptions);

    if (minifyResult.error) {
      console.error(minifyResult.error);
      throw minifyResult.error;
    }

    if (isEmpty(options.output)) {
      if (state.callback) {
        state.callback();
      }
      return minifyResult.code;
    } else {
      writeFile(options.output, minifyResult.code, state);

      if (minifyResult.map) {
        writeFile(options.output + '.map', minifyResult.map, state);
      }
    }

  }

};

/**
 * Updates the path for the sources array generated by terser.
 *
 * @param {String} sourceFile The path to the source file.
 * @param {String} sourceMap The source map JSON generated by terser.
 * @returns
 */
function updateSourcesPath(sourceFile, sourceMap) {
  try {
    var parentDir = path.dirname(sourceFile);
    var sourceMapData = JSON.parse(sourceMap);

    sourceMapData.sources = sourceMapData.sources.map(function (source) {
      return path.relative(parentDir, source);
    });

    return JSON.stringify(sourceMapData);
  } catch (e) {
    console.error("Failed to update source path for", sourceFile, e);
    return sourceMap;
  }
}

/**
 * Processes the uglifyjs options
 * @param  {String} fileName
 * @param  {Object} uglifyConfiguration
 * @return {Object}
 */
function getUglifyOptions (fileName, uglifyConfiguration) {
  fileName = path.basename(fileName);
  var uglifyOptions = JSON.parse(JSON.stringify(uglifyConfiguration));

  if (uglifyOptions.sourceMap) {
    if (uglifyOptions.sourceMap.filename) {
      uglifyOptions.sourceMap.filename = uglifyOptions.sourceMap.filename.replace('{file}', fileName);
    }
    if (uglifyOptions.sourceMap.url) {
      uglifyOptions.sourceMap.url = uglifyOptions.sourceMap.url.replace('{file}', fileName);
    }
  }

  return uglifyOptions;
}

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
function writeFile(filePath, code, state) {
  state.processCounter++;

  mkdirp(path.dirname(filePath)).then(function () {
    fs.writeFile(filePath, code, function (err) {
      state.processCounter--;
      if (state.callback && state.processCounter === 0) {
        state.callback();
      }
      if (err) {
        console.error('Error: ' + err);
        return;
      }
      if (state.logLevel == 'info') {
        console.info('File ' + filePath + ' written successfully !');
      }
    });
  })
  .catch(function (err) {
    state.processCounter--;
    if (state.callback && state.processCounter === 0) {
      state.callback();
    }

    console.error('Error: ' + err);
  });

}

