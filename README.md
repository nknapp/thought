# thought 

[![NPM version](https://badge.fury.io/js/thought.svg)](http://badge.fury.io/js/thought)
[![Travis Build Status](https://travis-ci.org/nknapp/thought.svg?branch=master)](https://travis-ci.org/nknapp/thought)
[![Coverage Status](https://img.shields.io/coveralls/nknapp/thought.svg)](https://coveralls.io/r/nknapp/thought)

> A customizable documentation generator for github projects

## Overview / Motivation

<img src="https://raw.githubusercontent.com/nknapp/thought/master/docs/thought-logo.png" alt="alt text" width="100%">

The goal of Thought is making the documentation just as easy as thinking about it.

Are you sometimes annoyed about documentation that does not represent the current state of the project? 
Like example-snippets that don't work or have a different output when you actually run them?

Most of the time, the problem is, that the documentation lives too far away from the code. 
The API-reference is up-to-date most of the time, because it is actually maintained next 
to the code. But what about the rest?

With Thought, you can assemble documentation from a variety of places. You can include API-docs into
your README, you can include example and actually *run* them to include the output. You can include
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

<pre><code>
├── LICENSE.md
├── examples/
├── index.js
└── package.json
</code></pre>

and have a look at the files
[index.js](examples/example-project/index.js),
[examples/example.js](examples/example-project/examples/example.js) and
[examples/example.js](examples/example-project/examples/example.js),
[LICENSE.md](examples/example-project/LICENSE.md),
[package.json](examples/example-project/package.json)

Thought will render information from `package.json`, include the `examples/examples.js`, 
execute the `examples/example.js` file and include the process-output and reference the `LICENSE.md`
into the [README.md](examples/example-project/README.md). It will also generate a default 
[CONTRIBUTING.md](examples/example-project/CONTRIBUTING.md).

*Note: The CONTRIBUTING-text contains some parts that may be subjective (such as including the 
[`standard`](https://github.com/feross/standard) coding style. I am open for different texts or 
ideas for modular approaches. Just file a github issue for discussion.*


### CLI options

Calling `thought --help` will print a command-line reference:

```
Usage: thought [options] [command]


  Commands:

    run [options]   Generate documentation from your package.json and some templates.
    init            Register scripts in the curent module's package.json
    check-engines   Check that all engines (such as npm) have versions that ensure Thought to run correctly
    up-to-date      Perform up-to-date check of the current documentation. Exit with non-zero exit-code when thought must be run again.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -d, --debug    higher stack-trace-limit, long stack-traces
```

### Calling `thought` from node.

```js
var thought = require('thought')

thought({
  cwd: 'example-project'
})
```

### Using `thought` as version-script for npm

npm supports a `version` script from version 2.13.0 on. This script
is called when invoking [npm version ...](https://docs.npmjs.com/cli/version)
after bumping the version number but prior to commiting the change.

Using `thought init` you can install scripts for `version` and `preversion` in your package.json 
that will run `thought run -a` on every version bump. This will include the updated documenation
in the same commit that contains the version bump. Furthermore, if you (or any other contributor 
of your module) is using npm prior to version 2.13.0. The preversion-script will fail.

This is especially helpful when using the helper `withPackageOf` to include links to files
in your github repository (since these links include the version tag on github).

### Using Thought as pre-push hook.

Along with the library [husky](https://npmjs.com/package/husky), Thought can be used as pre-push hook to prevent missing
README updates. When you change things that would otherwise update the documentation (like an example),
it can easily happen that you push those changes without running Thought first. `husky` and the 
`prepush` script

```json
// Edit package.json
{
  "scripts": {
   "prepush": "thought up-to-date"
  }
}
```

prevent this from happening. The command runs though without writing any files, but it checks if any of the 
files that would have been written, would have been changed by the write. If this is the case, it exits with a non-zero
exit-code and prints an error message.

### Overriding templates and partials

All templates and partials can be overridden by customized versions (but it is currently
not possible to remove a template completely).
You can find the default configuration in the [handlebars/](handlebars/) directory. It currently 
has the structure.

<pre><code>
├── helpers.js
├─┬ partials/
│ ├── api.md.hbs
│ ├─┬ badge/
│ │ ├── appveyor.md.hbs
│ │ ├── coveralls.md.hbs
│ │ ├── greenkeeper.md.hbs
│ │ ├── npm.md.hbs
│ │ └── travis.md.hbs
│ ├── badges.md.hbs
│ ├── changelog.md.hbs
│ ├── contributing.md.hbs
│ ├── howitworks.md.hbs
│ ├── installation.md.hbs
│ ├── license.md.hbs
│ ├── overview.md.hbs
│ └── usage.md.hbs
├── preprocessor.js
└─┬ templates/
  ├── CONTRIBUTING.md.hbs
  └── README.md.hbs
</code></pre>

Every file in the `templates/` directory will create a file in your project root (removing 
the `.hbs` extension). The partials are included by calling for example `{{> api.md}}` (also without
the `.hbs` extension) from a template or another partial.

You can now create a directory `.thought` in the your project root, that has the same structure.
If you create a file `.thought/partials/contributing.md.hbs`, it will replace the default
`partials/contributing.md.hbs` file. Same for templates.

#### Handlebars-Helpers

Thought comes with a default set of Handlebars-helpers, that can be called
from within templates and partials.
Have a look at the [API docs of the builtin-helpers](docs/helpers.md). All helpers that are 
[built-into Handlebars](http://handlebarsjs.com/builtin_helpers.html) are also available, of course.

### Customizing the preprocessor

Thought uses `preprocessor.js` function to extend the `package.json` before passing it to the handlebars
engine. You can create a file named `.thought/preprocessor.js` in your project to supply your own 
preprocessor. If you do that, you should run the old preprocessor by calling `this.parent(data)` from within
your custom function. Some partials and template rely on the data created there.

### Customizing helpers

If you want to provide your own helpers (for example to perform some project-specific computations) 
you can create a file named `.thought/helpers.js` in your project. This file should export an object 
of helper-functions like

```js
module.exports = {
  myHelper: function(value) { ... },
  myHelper2: function(value) { ... },
}
```

Those helpers are registered with the handlebars engine in addition to the default helpers. If the name 
equals a default helper, that helper will be replaced by your helper. Currently there is no way to call
the old helper from within the new helper.

Thought implicitly uses the [promised-handlebars](https://github.com/nknapp/promised-handlebars)-package
to allow helpers that return promises. So, in your helpers, you will never receive a promise as parameter or 
as context data, but if you return promises, they will be resolved seamlessly. 

## Plugin modules

The customizations described above can be extracted into reusable modules. A thought-plugin is just a 
[customize](https://npmjs.com/package/customize)-module that is loaded using the [customize.load()](https://github.com/bootprint/customize#module_customize..Customize+load) 
function.

### Authoring modules

Thought uses [customize-engine-handlebars](https://npmjs.com/package/customize-engine-handlebars) under the hood, so the documentation
of this module is a good starting-point, if you want to know how to create override-configurations.
Have a look at  for an example on how to write a module. 

For a real example of a thought-plugin have a look at [thought-plugin-jsdoc](https://npmjs.com/package/thought-plugin-jsdoc).

### Using modules

* Include you favorite plugins in the `devDependencies` of your `package.json`
* Place a file `config.js` into the `.thought`-folder in your project: 

```js
module.exports = {
  plugins: [
    // JsDoc-Support
    require('thought-plugin-jsdoc'),
    // Some other feature plugin
    require('thought-plugin-something-else'),
    // Plugin containing my (nknapp's) personal preferences
    require('thought-plugin-nknapp-preferences')
  ]
}

```


This file loads multiple plugins that are applied to the `customize`-instance one after another.

You can also load plugins from other-plugins. The following example uses plugins that do not yet exist, but the 
application is thinkable:

```js
module.exports = function (customize) {

  return customize
    // jsdoc-support
    .load(require('thought-plugin-jsdoc'))
    // include open-open-source disclaimer in CONTRIBUTING.md
    .load(require('thought-plugin-open-open-source'))
    // include standardjs-disclaimer in CONTRIBUTING.md
    .load(require('thought-plugin-standardjs'))
}

```


This allows you to create building-blocks that can then be assembled to a single plugin which can be included in your
projects...



                                                 
# API reference

<a name="thought"></a>

## thought(options)
Execute Thought in the current directory

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| [options.cwd] | <code>string</code> | the working directory to use as project root |
| [options.addToGit] | <code>boolean</code> | add created files to git |




## License

`thought` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).