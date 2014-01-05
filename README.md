# uglifyjs-folder

Command to run uglifyjs on a folder and minify the result in a single file or a new folder.

## Getting Started
Install the module with: `npm install uglifyjs-folder -g`


## Documentation
    usage: uglifyjs-folder path[,...] [options]

    options:
      -c --no-comments   Will remove the filename comments, so result will be in one line
      -o --output        Specify a file/folder to write the minified code
      -e --each          Will minify each file in <output>/*.min.js
      -h --help          Print this list and exit.

## Examples
    $ uglifyjs-folder test-folder
    $ uglifyjs-folder test-folder --no-comments
    $ uglifyjs-folder test-folder -o all.min.js
    $ uglifyjs-folder test-folder -e -o newFolder

## Contributing
Pull requests are appreciated.

## Release History
Jan/05/2014 - Initial release

## License
Copyright (c) 2014 Mihai Ionut Vilcu
Licensed under the MIT license.
