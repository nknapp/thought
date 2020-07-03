# Templates, Partials, Helpers and the Preprocessor

All templates and partials can be overridden by customized versions (it is currently
not possible to remove a template completely).
You can find the default configuration in the [handlebars/](handlebars/) directory. 

## Partials and Templates

The following **partials** exist by default:

<pre><code>
├── <a href="../handlebars/partials/api.md.hbs">api.md.hbs</a>
├─┬ badge/
│ ├── <a href="../handlebars/partials/badge/appveyor.md.hbs">appveyor.md.hbs</a>
│ ├── <a href="../handlebars/partials/badge/codecov.md.hbs">codecov.md.hbs</a>
│ ├── <a href="../handlebars/partials/badge/coveralls.md.hbs">coveralls.md.hbs</a>
│ ├── <a href="../handlebars/partials/badge/greenkeeper.md.hbs">greenkeeper.md.hbs</a>
│ ├── <a href="../handlebars/partials/badge/npm.md.hbs">npm.md.hbs</a>
│ └── <a href="../handlebars/partials/badge/travis.md.hbs">travis.md.hbs</a>
├── <a href="../handlebars/partials/badges.md.hbs">badges.md.hbs</a>
├── <a href="../handlebars/partials/changelog.md.hbs">changelog.md.hbs</a>
├── <a href="../handlebars/partials/howitworks.md.hbs">howitworks.md.hbs</a>
├── <a href="../handlebars/partials/installation.md.hbs">installation.md.hbs</a>
├── <a href="../handlebars/partials/license.md.hbs">license.md.hbs</a>
├── <a href="../handlebars/partials/overview.md.hbs">overview.md.hbs</a>
└── <a href="../handlebars/partials/usage.md.hbs">usage.md.hbs</a>
</code></pre>

The partials can be used by calling for example by adding `{{> api.md}}` (without
the `.hbs` extension) to a template or another partial.

You can create a directory `.thought/partials` in the your project root, that has the same structure.
If you create a file `.thought/partials/contributing.md.hbs`, it will replace the default
`contributing.md.hbs` partial.

The same applies for **templates**. The default set of templates is 

<pre><code>
└── <a href="../handlebars/templates/README.md.hbs">README.md.hbs</a>
</code></pre>

For every file in the `templates/` directory, a file is created in your project root (removing
the `.hbs` extension). 

### Generate replacement files via CLI

You can use the command

```
thought eject partial contributing.md.hbs 
```

to automatically create the file `.thought/partials/contributing.md.hbs` with the default contents. If you are not sure
which partials and templates you can specify in the command-line, run

```
thought eject
```

without any further parameters. It will display a list of files that exist by default and are not yet overridden in your
project.


 

## Handlebars-Helpers

Thought comes with a default set of Handlebars-helpers that can be called
from within templates and partials.
Have a look at the [API docs of the builtin-helpers](helpers.md). All helpers that are
[built into Handlebars](http://handlebarsjs.com/builtin_helpers.html) are also available.

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

Thought uses the [promised-handlebars](https://github.com/nknapp/promised-handlebars)-package
to allow helpers that return promises. So, in your helpers, you will never receive a promise as parameter or
as context data, but if you return promises, they will be resolved seamlessly.

### Customizing the preprocessor

Thought uses `preprocessor.js` function to extend the `package.json` before passing it to the handlebars
engine. You can create a file named `.thought/preprocessor.js` in your project to supply your own
preprocessor. If you do that, you should run the old preprocessor by calling `this.parent(data)` from within
your custom function. Some partials and template rely on the data created there.

Beware that the default preprocessor returns a promise.

Here is an example-project that uses all the possibilities described above:


<pre><code>
├─┬ <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought">.thought/</a>
│ ├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/helpers.js">helpers.js</a>
│ ├─┬ <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/partials">partials/</a>
│ │ └── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/partials/overview.md.hbs">overview.md.hbs</a>
│ ├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/preprocessor.js">preprocessor.js</a>
│ └─┬ <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/templates">templates/</a>
│   ├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/templates/CONTRIBUTING.md.hbs">CONTRIBUTING.md.hbs</a>
│   └── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/.thought/templates/NEW_FILE.md.hbs">NEW_FILE.md.hbs</a>
├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/CONTRIBUTING.md">CONTRIBUTING.md</a>
├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/NEW_FILE.md">NEW_FILE.md</a>
├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/README.md">README.md</a>
├── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/index.js">index.js</a>
└── <a href="../examples/example-project-3-templates-partials-helpers-preprocessor/package.json">package.json</a>
</code></pre>

## Tutorial & Examples:

* [Simple Usage](example-project-1-simple.md)
* [Examples, License, JSDoc, Badges](example-project-2-example-license-jsdoc-badges.md)
* [Templates, Partials, Helpers, Preprocessor](example-project-3-templates-partials-helpers-preprocessor.md)
* [Writing plugins](example-project-4-writing-plugins.md)

[Back to the README](../README.md)