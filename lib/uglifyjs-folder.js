#! /usr/bin/env node
/*
 * uglifyjs-folder
 * https://github.com/ionutvmi/uglifyjs-folder
 *
 * Copyright (c) 2014 Mihai Ionut Vilcu
 * Licensed under the MIT license.
 */
'use strict';

// dependencies
var UglifyJS = require("uglify-js");
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var path = require( 'path' );

// helper functions
function getFiles(dir){
    if(!fs.existsSync(dir)) {
        console.log("\n\n(!) `" + dir + "` doesn't exists ! \n\n");
        return [];
    }

    var files = fs.readdirSync(dir);
    var result = [];
    for(var i in files){

        if (!files.hasOwnProperty(i)) {continue;}

        var name = dir+'/'+files[i];

        if (fs.statSync(name).isDirectory()){
            result = result.concat(getFiles(name));
        } else {
            result.push(name);
        }

    }
    return result;
}

var args = process.argv.slice(2);
var options = {};

options.isHelp = (args.indexOf("-h") > -1) || (args.indexOf("--help") > -1);
options.isNoComments = (args.indexOf("-c") > -1) || (args.indexOf("--no-comments") > -1);
options.isOutput = (args.indexOf("-o") > -1) || (args.indexOf("--output") > -1);
options.OutputValue = 'uglify-folder-output.js'; // default value
options.isEach = (args.indexOf("-e") > -1) || (args.indexOf("--each") > -1);

if(options.isOutput) {
    var index = args.indexOf("-o") > -1 ? args.indexOf("-o") : args.indexOf("--output");
    // remove `-o folder-name` and hold the folder
    options.OutputValue = args.splice(index, 2)[1] || 'uglify-folder-output.js';
}
// check if the output folder exists
if(options.isEach) {
    if(!fs.existsSync(options.OutputValue)) {
        mkdirp.sync(options.OutputValue);
    }
}


if (options.isHelp) {
  console.log([
    "usage: uglifyjs-folder path[,...] [options]",
    "",
    "options:",
    "  -c --no-comments   Will remove the filename comments, so result will be in one line",
    "  -o --output        Specify a file/folder to write the minified code",
    "  -e --each          Will minify each file in <output>/*.min.js",
    "  -h --help          Print this list and exit."
  ].join('\n'));

  process.exit();
}






var result = ''; // will contain the final result

// read all files
args.forEach(function(dir) {

    if(dir[0] === '-') { // ignore options
        return;
    }

    var files = getFiles(dir);

    files.forEach(function(f){
        var tmp = '';
        if(options.isNoComments) {
            tmp += UglifyJS.minify(f).code;
        } else {
            tmp += "/**** "+ f +" ****/\n" +  UglifyJS.minify(f).code + "\n\n";
        }

        // write the new file
        if(options.isEach) {
            var newName = options.OutputValue + "/" + path.dirname(f) + "/" +
                            path.basename(f, path.extname(f)) + ".min.js";

            mkdirp.sync(path.dirname(newName));

            fs.writeFileSync(newName, tmp);
            console.log("File " + newName + " was written !");
        } else {
            result += tmp;
        }

    });

});


if(options.isOutput) {

    if(!options.isEach) {
        fs.writeFileSync(options.OutputValue, result);
        console.log("The minified code was written in " + options.OutputValue + " !");
    }

} else { // show the output in console (maybe copy it to your clipbard?)
    console.log(result);
}

