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
    '  -p --pattern       Specifies a comma separated glob patterns for the file selections. Default: **/*.js',
    '     --pseparator    Specifies the separator for the pattern input. Default: ,',
    '     --version       Prints the current version from package.json',
    '     --config-file   Specifies a json configuration file for the terser module',
    '     --log-level     Specifies the log level used when processing the files. Default: info',
    '  -h --help          Print this list and exit.'
  ].join('\n')
});

async function main() {
  var result = await uglifyFolder(cli.input[0], {
    comments: cli.flags.comments || cli.flags.c || false,
    output: cli.flags.output || cli.flags.o,
    each: cli.flags.each || cli.flags.e || false,
    extension: cli.flags.extension || cli.flags.x || ".min.js",
    patterns: (cli.flags.pattern || cli.flags.p || "**/*.js").split(cli.flags.pseparator || ','),
    configFile: cli.flags.configFile || null,
    logLevel: cli.flags.logLevel || 'info'
  });

  if (result) {
    console.log(result);
  }
}

main();
