# Examples, License, JSDoc, Badges

If you want people to use your module, you probably want to add some more documentation

* **At least one usage example**: You can do this by adding a file `examples/example.js`
* **API documentation**: You can do this by using the [thought-plugin-jsdoc](https://npmjs.com/package/thought-plugin-jsdoc) in `.thought/config.js`
* **Badges that show how great your module is (tests passing, code-coverage etc.)**
  A [Travis-CI](https://travis-ci.org)-badge will show up, if you have a `.travis.yml`-file.  
  A [Coveralls](https://coveralls.io) is shown 'coveralls' is mentioned in `.travis.yml`.
  A [Greenkeeper](https://greenkeeper.io)-badge can be configured in `.thought/config.js`. Thought will call 
  the Greenkeeper-API if no configuration is set, but this might change in the future. 
* **A file containing the complete License of your project**, for example `LICENSE.md`

If you add all those files, your module might look like this:

<pre><code>
example-project-2-example-license-jsdoc-badges/
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought">.thought/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought/config.js">config.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/.travis.yml">.travis.yml</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/LICENSE.md">LICENSE.md</a>
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/examples">examples/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/examples/example.js">example.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/index.js">index.js</a>
└── <a href="../examples/example-project-2-example-license-jsdoc-badges/package.json">package.json</a>
</code></pre>

## About Example files

The example file for the project looks like this:

```js
var multiply = require('../')

var x = 3
var y = 4
var xy = multiply(x, y)

console.log(xy)

```


Note that the example uses `require('../')` instead of `require('example-project-2-example-license-jsdoc-badges')` 
to reference the current project.

That is the case, because otherwise you could not run the example. If you cannot run it, how do you know it is still working?
Still, you don't want `require('example-project-2-example-license-jsdoc-badges')` in your README, which is why Thought
detected references to the current module and replaces them by the module name.

Thought will also execute the example and include the output in the README, so that your users don't have to download
and run the example themselves.

## Result

The complete project, after running `thought run -a` looks like this, you can click on the links to view the actual files:

<pre><code>
example-project-2-example-license-jsdoc-badges/
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought">.thought/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought/config.js">config.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/.travis.yml">.travis.yml</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/CONTRIBUTING.md">CONTRIBUTING.md</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/LICENSE.md">LICENSE.md</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/README.md">README.md</a>
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/examples">examples/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/examples/example.js">example.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/index.js">index.js</a>
└── <a href="../examples/example-project-2-example-license-jsdoc-badges/package.json">package.json</a>
</code></pre>

## Tutorial & Examples:

* [Simple Usage](example-project-1-simple.md)
* [Examples, License, JSDoc, Badges](example-project-2-example-license-jsdoc-badges.md)
* [Templates, Partials, Helpers, Preprocessor](example-project-3-templates-partials-helpers-preprocessor.md)
* [Writing plugins](example-project-4-writing-plugins.md)

[Back to the README](../README.md)