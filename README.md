# uglifyjs-folder

![tests](https://github.com/mihai-vlc/uglifyjs-folder/actions/workflows/test.yml/badge.svg)

Command to run uglifyjs on a folder and minify the result in a single file or a new folder.
Uses the [terser](https://www.npmjs.com/package/terser) package to perform the minification.

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
      -p --pattern       Specifies a comma separated glob patterns for the file selections. Default: **/*.js
         --pseparator    Specifies the separator for the pattern input. Default: ,
         --version       Prints the current version from package.json
         --config-file   Specifies a json configuration file for the terser module
         --log-level     Specifies the log level used when processing the files. Default: info
      -h --help          Print this list and exit.

## Examples

    $ uglifyjs-folder test-folder
    $ uglifyjs-folder test-folder --comments
    $ uglifyjs-folder test-folder -o all.min.js
    $ uglifyjs-folder test-folder --output all.min.js --pattern "**/*.js,!**/*min.js" # ignore minified files
    $ uglifyjs-folder test-folder -eo newFolder
    $ uglifyjs-folder test-folder -eo newFolder --log-level error
    $ uglifyjs-folder test-folder-es6 -o newFolder
    $ uglifyjs-folder test-folder -e -x .js -o test-folder # careful: overwrite all files in test-folder
    $ uglifyjs-folder test-folder --config-file "./uglify.json"
    where uglify.json contains
    {
      "keep_fnames": true
    }

## Contributing

Pull requests are appreciated.

## Release History

- 25/Jun/2023

  - Upgraded terser to 5.18.1

- 29/Dec/2022

  - Upgraded terser to 5.16.1

- 31/Oct/2022

  - Fixed the line ending during npm publish. Fixes #34

- 21/Aug/2022

  - Upgraded terser to 5.14.2

- 02/Apr/2022

  - Upgraded terser to 5.12.1
  - Upgraded the development dependencies to the latest version
  - Removed the testing on node v10 from travis ci
  - Fixes #32

- 21/Jun/2021

  - Upgraded terser to 5.7.0
  - Modified the package API from synchronous to async/await
    The cli interface remained the same.

- 23/Jul/2020
  - Released 2.0.0 with the terser minifier.
  - Removed uglify-js and uglify-es from the dependencies.
  - Upgraded all the dependencies to the latest version.
  - Adds snapshots testing to the existing testing suite
  - Adds the --log-level option
- 20/Apr/2020 - Updated code to use promises for the mkdrip call.
- 18/Apr/2020 - Updated the version for the mkdirp package #22
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

Copyright (c) 2014 - 2020 Mihai Ionut Vilcu
Licensed under the MIT license.
