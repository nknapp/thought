# thought

> A customizable documentation generator for github projects

**This project is not ready yet. It's in development and the documentation is merely a self-test
of the project. Better come back later**


## Overview / Motivation

The goal of Thought is making the documentation just as easy as thinking about it.

Generating a simple `README.md` just requires executing `thought` in your project directories.
Thought will run your `package.json` through a Handlebars template with a list of registered partials in order to 
do that.

Since that is mostly not exactly what you want, it is possible to override each of the partials with your own 
and to create more templates that result in multiple markdown files in your repo.

Thought offers a small list of simple helpers to

* parse jsdoc-comments (not only in javascript-files but in many languages) and include them at any location in 
  your documenation files. 
* include any file
* include javascript example files (replacing `require` of the main module by the module name)
* run example files or any program and include the output
 




# Installation

```
npm install -g thought
```


## Usage


The simplest usage is just to run `thought` from your project root directory.
In the default configuration, this will generate a `README.md` from the information in the `package.json`.

Consider the following example: 

<pre>
[example-project](examples/example-project)/
├── [LICENSE.md](examples/example-project/LICENSE.md)
├── [examples](examples/example-project/examples)/
|   └── [example.js](examples/example-project/examples/example.js)
├── [index.js](examples/example-project/index.js)
└── [package.json](examples/example-project/package.json)
</pre>

#### index.js

```
/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

/**
 * Multiplies two numbers
 * @param {number} a the first number
 * @param {number} b the second number
 * @return {number} the product of `a` and `b`
 * @api public
 */
module.exports = function multiply (a, b) {
  return a * b
}

```


#### example.js

```
var multiply = require('../')

var x = 3
var y = 4
var xy = multiply(x, y)

console.log(xy)

```


#### example.js

```
var multiply = require('../')

var x = 3
var y = 4
var xy = multiply(x, y)

console.log(xy)

```



### CLI options

Calling `thought --help` will print a command-line reference:

```
Usage: thought [options]

  Generate documentation from your package.json and some templates.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Calling `thought` from node.

```js
var thought = require('thought')

thought({
  cwd: 'example-project'
})
```


#  API-reference



## License

`thought` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Contributing 

See [CONTRIBUTING.md] for details about code-style and for developer documentation.