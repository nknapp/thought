# Writing plugins

The customizations described in the last section can be extracted into reusable modules. A thought-plugin is just a
[customize](https://npmjs.com/package/customize)-module that is loaded using the [customize.load()](https://github.com/bootprint/customize#module_customize..Customize+load)
function.

## Use-cases

There are two possible use-cases why you can 

* **You want to create some functionality that could be interesting for a lot of projects.**
  The generation of API-documentation is such an example. It depends heavily on the used language
  so it should not be in Thought-core, but it is still a part of functionality that many people might need.
* **You want to create a personal configuration that you can reuse across all your own projects.**
  Instead of adding `.thought/partials/contributing.md` and other customized texts to *all* your projects, you
  can create a plugin with those changes that you load in each project.
  You can also load other plugins in your plugin, so if you need a `thought-plugin-jsdoc` in all your project,
  just include it in your personal-preference plugin.

## Authoring plugins

Thought uses [customize-engine-handlebars](https://npmjs.com/package/customize-engine-handlebars) under the hood. The documentation
of this module is a good starting-point, if you want to know how to create override-configurations.

The following example is a showcase for a plugin that applies several modifications:  

<pre><code>
example-plugin/
├── <a href="../examples/example-plugin/index.js">index.js</a>
├── <a href="../examples/example-plugin/package.json">package.json</a>
├─┬ <a href="../examples/example-plugin/partials">partials/</a>
│ └── <a href="../examples/example-plugin/partials/contributing.md.hbs">contributing.md.hbs</a>
└─┬ <a href="../examples/example-plugin/templates">templates/</a>
  └── <a href="../examples/example-plugin/templates/LICENSE.md.hbs">LICENSE.md.hbs</a>
</code></pre>

Have look at the comments in the files. ([index.js](examples/example-plugin/index.js)) is tying everything 
together. Look below for the example project using this plugin.

A realworld-example of a thought-plugin is [thought-plugin-jsdoc](https://npmjs.com/package/thought-plugin-jsdoc).

## Using plugins

In order to use a plugin, you have to 

* add it to the `devDependencies` of your `package.json`
* place a file `config.js` into the `.thought`-folder in your project
  and a `require()`-call to the plugins-array:

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

A whole example of how to use a plugin is this one:

<pre><code>
example-project-4-writing-plugins/
├─┬ <a href="../examples/example-project-4-writing-plugins/.thought">.thought/</a>
│ └── <a href="../examples/example-project-4-writing-plugins/.thought/config.js">config.js</a>
├── <a href="../examples/example-project-4-writing-plugins/CONTRIBUTING.md">CONTRIBUTING.md</a>
├── <a href="../examples/example-project-4-writing-plugins/LICENSE.md">LICENSE.md</a>
├── <a href="../examples/example-project-4-writing-plugins/README.md">README.md</a>
├── <a href="../examples/example-project-4-writing-plugins/index.js">index.js</a>
└── <a href="../examples/example-project-4-writing-plugins/package.json">package.json</a>
</code></pre>

The plugin is loaded in the file `config.js`

```js
module.exports = {
  plugins: [
    require('../../example-plugin/index')
  ]
}

```


In this case, the plugin is loaded from a relative path, because the plugin is the example mentioned above. Both are part
of the Thought project.


## Tutorial & Examples:

* [Simple Usage](example-project-1-simple.md)
* [Examples, License, JSDoc, Badges](example-project-2-example-license-jsdoc-badges.md)
* [Templates, Partials, Helpers, Preprocessor](example-project-3-templates-partials-helpers-preprocessor.md)
* [Writing plugins](example-project-4-writing-plugins.md)

[Back to the README](../README.md)