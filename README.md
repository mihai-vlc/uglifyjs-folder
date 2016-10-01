# uglifyjs-folder

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
      -h --help          Print this list and exit.
## Examples
    $ uglifyjs-folder test-folder
    $ uglifyjs-folder test-folder --comments
    $ uglifyjs-folder test-folder -o all.min.js
    $ uglifyjs-folder test-folder -eo newFolder
    $ uglifyjs-folder test-folder -e -x .js -o test-folder # careful: overwrite all files in test-folder

## Contributing
Pull requests are appreciated.

## Release History
01/Oct/2016 - Added the --extension flag
12/Oct/2014 - Removes the extra files, organizes the code
05/Jan/2014 - Initial release

## License
Copyright (c) 2014 Mihai Ionut Vilcu
Licensed under the MIT license.
