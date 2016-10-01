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
    '  -c --comments      Will add a comment with the file name.',
    '  -o --output        Specify a file/folder to write the minified code',
    '  -e --each          Will minify each file independently',
    '  -h --help          Print this list and exit.'
  ].join('\n')
});


var res = uglifyFolder(cli.input[0], {
  comments: cli.flags.comments || cli.flags.c || false,
  output: cli.flags.output || cli.flags.o,
  each: cli.flags.each || cli.flags.e || false
});

if(res) {
  console.log(res);
}


