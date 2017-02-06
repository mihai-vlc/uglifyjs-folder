#!/usr/bin/env node
'use strict';

var meow = require('meow');
var uglifyFolder = require('./');

var cli = meow({
  help: [
    'Usage',
    '  uglifyjs-folder path [options]',
    '',
    'options:',
    '  -c --comments      Add a comment with the file name.',
    '  -o --output        Specify a file/folder to write the minified code',
    '  -e --each          Minify each file independently',
    '  -x --extension     Minified file extension (default: .min.js)',
    '  -y --harmony       Uses uglify-js-harmony as a minifier',
    '  -h --help          Print this list and exit.'
  ].join('\n')
});


var res = uglifyFolder(cli.input[0], {
  comments: cli.flags.comments || cli.flags.c || false,
  output: cli.flags.output || cli.flags.o,
  each: cli.flags.each || cli.flags.e || false,
  es6: cli.flags.harmony || cli.flags.y || false,
  extension: cli.flags.extension || cli.flags.x || ".min.js"
});

if(res) {
  console.log(res);
}


