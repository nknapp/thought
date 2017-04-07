# thought 

[![NPM version](https://badge.fury.io/js/thought.svg)](http://badge.fury.io/js/thought)
[![Travis Build Status](https://travis-ci.org/nknapp/thought.svg?branch=master)](https://travis-ci.org/nknapp/thought)
[![Coverage Status](https://img.shields.io/coveralls/nknapp/thought.svg)](https://coveralls.io/r/nknapp/thought)
[![Greenkeeper badge](https://badges.greenkeeper.io/nknapp/thought.svg)](https://greenkeeper.io/)

> A customizable documentation generator for github projects

Every npm-package should have a README-file that contains a short **description** of what it is and what it does, an 
explanation of how to **install** it, one or more usage **examples** and an API-reference 
for all functions, parameters and options.

Thought helps you create such a README without a lot of hassle.

**Easy startup**: Thought uses [handlebars](https://npmjs.com/package/handlebars) with a default set of templates, partials and helpers to create a
README.md- and a CONTRIBUTING.md-file. The input of the template is mainly the `package.json`-file of your project.
Just run `thought run -a` in your project folder.

**Examples that actually work**: The file `examples/example.js` is included into the README by default. You can use `require('../')` to 
reference your package and thus build examples that are executable and testable. When you run `thought run -a`, the
`../` will be replaced by the name of your package. The example *will* be run and the output will be included as well.

**Fully customizable**: You can change every template, partials and helper if you need to. And since you are writing 
Handlebars-templates, you can use [helpers](docs/helpers.md) like `{{npm 'lodash`\}}
to create a link to a package's npm-page and `{{dirTree '.thought' 'snippets/**'}}` to generate directory-trees.

**Plugins**: You can write plugins that bundle your customizations. You can write a `thought-plugin-my-name-base`
that contains all the customizations that you need in your module. Or you can bundle certain functionalities, like
the [thought-plugin-jsdoc](https://npmjs.com/package/thought-plugin-jsdoc) and share them on npm.


# Basic Usage

The most basic way to use Thought is to go into your directory of your `package.json` and type

```bash
npm -g install thought
thought run -a
```

Thought will then create the files `README.md` and `CONTRIBUTING.md` with reasonable default texts for Open-Source
projects in JavaScript that are hosted on http://npmjs.com. 

### Examples

Thought can be used just as-is or in a more sophisticated fashion. The more work you put in, the better 
the documentation that comes out. The following example show the different levels of details:

* [The first example](docs/example-project-1-simple.md) shows the generated documentation for
  a very simple, newly generated npm-package.
* [The second example-project](docs/example-project-2-example-license-jsdoc-badges.md) 
  demonstrates the following features:
  * an example program in the README
  * a link to a LICENSE-file
  * a JSDoc-Reference of the main file
  * badges for npm, travis, coveralls and greenkeeper
* [The third example-project](docs/example-project-3-templates-partials-helpers-preprocessor.md) shows how to
  * override contents with custom content (using custom partials and custom templates)
  * create new files by adding templates
  * add custom helpers that can be called from within templates and partials
  * add a custom preprocessor to modify the input data (i.e. the `package.json` and
    the configuration`)
* [The fourth example-project](docs/example-project-4-writing-plugins.md) demonstrates
  how to bundle customizations into a plugin that can be reused and published on npm.

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
it can easily happen that you push those changes without running Thought first. 

You can prevent this from happening by using `husky` and a `prepush` script

```json
// Edit package.json
{
  "scripts": {
   "prepush": "thought up-to-date"
  }
}
```

The command `thought up-to-date` runs Thought without writing any files, but it checks if any of the 
files that would have been written, would have been changed by the write. If this is the case, it exits with a
non-zero exit-code and prints an error message.

*Attention: This might not work if the output of examples includes variable parts such as the current timestamp or local wheather conditions*




                                                 
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



## Builtin Handlebars-helpers

The documentation for the builtin-helpers can be found [here](docs/helpers.md)


## License

`thought` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).