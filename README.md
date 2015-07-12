# thought

> A customizable documentation generator for github projects

*Thought is still in development. It might be worth looking at it already, but I'm still trying to 
document my own projects with it, so the default templates will change as I go along. It's not ready
for production use at the moment.*

## Overview / Motivation

The goal of Thought is making the documentation just as easy as thinking about it.

Are you sometimes annoyed about documentation that does represent the current state of the project? 
Like example-snippets that don't work or have a different output when you actually run them?

Most of the time, the problem is, that the documentation lives too far away from the code. 
The API-reference is up-to-date most of the time, because it is actually maintained next 
to the code. But what about the rest?

With Thought, you can assemble documentation from a variety of places. You can include API-docs into
your README, you can include example and actuall *run* them to include the output. You can include
the command line reference by calling the main program with a `--help` parameter.

When your examples throw errors, you will notice that. When you make changes to your code, 
the example output in your documentation will change as well!

Generating a simple `README.md` just requires executing `thought` in your project directories.
Thought will run your `package.json` through a Handlebars template with a list of registered partials in order to 
do that.

Since that is mostly not exactly what you want, it is possible to override each of the partials with your own 
and to create more templates each of which will result in one markdown-file in your repo.

Thought offers a small list of simple helpers to

* parse jsdoc-comments (not only in javascript-files but in many languages) and include them at any location in 
  your documenation files. 
* include any file
* include javascript example files (replacing `require` of the main module by the module name)
* run example files or any program and include the output
 
I have taken a lot of inspiration form [verb](https://github.com/verbose/verb) by Jon Schlinkert, but I wanted 
something simpler. There are other simple README-generators out there that you can't adapt, so the idea of 
using `package.json` to generate a README.md is not new.





# Installation

```
npm install -g thought
```


## Usage


The simplest usage is just to run `thought run` from your project root directory.
In the default configuration, this will generate a `README.md` from the information in the `package.json`.

Consider the following example 

<pre><code>example-project/
├── LICENSE.md
├── examples/
│   └── example.js
├── index.js
└── package.json</code></pre>

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
Usage: thought [options] [command]


  Commands:

    run [options]   Generate documentation from your package.json and some templates.
    init            Register scripts in the curent module's package.json
    check-engines   Check that all engines (such as npm) have versions that ensure Thought to run correctly

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -d, --debug    higher stack-trace-limit, long stack-traces
```

## Calling `thought` from node.

```js
var thought = require('thought')

thought({
  cwd: 'example-project'
})
```

## Using `thought` as version-script for npm

npm supports a `version` script from version 2.13.0 on. This script
is called when invoking [npm version ...](https://docs.npmjs.com/cli/version)
after bumping the version number but prior to commiting the change.

Using `thought init` you can install scripts for `version` and `preversion` in your package.json 
that will run `thought run -a` on every version bump. This will include the updated documenation
in the same commit that contains the version bump. Furthermore, if you (or any other contributor 
of your module) is using npm prior to version 2.13.0. The preversion-script will fail.

This is especially helpful when using the helper `withPackageOf` to include links to files
in your github repository (since these links include the version tag on github).


##  API-reference

## [thought](https://github.com/nknapp/thought/blob/master/index.js#L21)

Execute Thought in the current directory

* Parameters:
  * options: **object**     
  * options.cwd: **string** - the working directory to use as project root    




## License

`thought` is published under the MIT-license. 
See [LICENSE.md](LICENSE.md) for details.

## Contributing 

See [CONTRIBUTING.md](CONTRIBUTING.md) for details about code-style and for developer documentation.