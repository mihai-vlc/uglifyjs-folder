# uglifyjs-folder

[![Build Status](https://travis-ci.org/ionutvmi/uglifyjs-folder.svg?branch=master)](https://travis-ci.org/ionutvmi/uglifyjs-folder)

Command to run uglifyjs on a folder and minify the result in a single file or a new folder.

## Getting Started
Install the module with: `npm install uglifyjs-folder -g`


## Documentation
    Usage
      uglifyjs-folder path [options]

    options:
      -c --comments      Add a comment with the file name.
      -o --output        Specify a file/folder to write the minified code
      -e --each          Minify each file independently
      -x --extension     Minified file extension (default: .min.js)
      -y --harmony       Uses uglify-js-harmony as a minifier
      -p --pattern       Specifies a comma separated glob patterns for the file selections. Default: **/*.js
         --pseparator    Specifies the separator for the pattern input. Default: ,
         --version       Prints the current version from package.json
         --config-file   Specifies a json configuration file for the uglify-js/uglify-es module'
      -h --help          Print this list and exit.
## Examples
    $ uglifyjs-folder test-folder
    $ uglifyjs-folder test-folder --comments
    $ uglifyjs-folder test-folder -o all.min.js
    $ uglifyjs-folder test-folder --output all.min.js --pattern "**/*.js,!**/*min.js" # ignore minified files 
    $ uglifyjs-folder test-folder -eo newFolder
    $ uglifyjs-folder test-folder-es6 -yo newFolder
    $ uglifyjs-folder test-folder -e -x .js -o test-folder # careful: overwrite all files in test-folder
    $ uglifyjs-folder test-folder --config-file "./uglify.json"
    where uglify.json contains
    {
      "keep_fnames": true
    }

## Contributing
Pull requests are appreciated.

## Release History
- 25/Nov/2017 - Added support for sourcemaps via the uglifyjs config file   
Exmaple configuration:
```
{
  "sourceMap": {
    "root": "../src",
    "url": "{file}.map"
  }
}
```
- 11/Nov/2017 - Added support for the --config-file option
- 11/Nov/2017 - Upgraded to uglify-js@3 and uglify-es@3 
- 27/Aug/2017 - Added support for the --pattern and --pseparator flags. 
- 06/Feb/2017 - Added support for the --harmony flag. 
- 28/Dec/2016 - Added support for sub folder output files. 
    Example: `uglifyjs-folder test-folder -o newFolder/nested/all.min.js`
- 01/Oct/2016 - Added the --extension flag
- 12/Oct/2014 - Removes the extra files, organizes the code
- 05/Jan/2014 - Initial release

## License
Copyright (c) 2014 Mihai Ionut Vilcu
Licensed under the MIT license.
