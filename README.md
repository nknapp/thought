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

Consider the following example 

```
example-project/
├── LICENSE.md
├── examples/
|   └── example.js
├── index.js
└── package.json
```

and have a look at the files
[index.js](examples/example-project/index.js),
[examples/example.js](examples/example-project/examples/example.js) and
[examples/example.js](examples/example-project/examples/example.js),
[LICENSE.md](examples/example-project/LICENSE.md),
[package.json](examples/example-project/package.json)

Thought will render information from `package.json`, include the `exampeles/examples.js`, 
execute the `examples/example.js` file and include the process-output and reference the `LICENSE.md`.

The resulting `README.md` can be viewed [here](examples/example-project/README.md)


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

## thought

Execute Thought in the current directory

* Parameters:
  * options: **object**     
  * options.cwd: **string** - the working directory to use as project root    




## License

`thought` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Contributing 

See [CONTRIBUTING.md](CONTRIBUTING.md) for details about code-style and for developer documentation.