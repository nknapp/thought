# Examples, License, JSDoc, Badges

If you want people to use your module, you probably want to add some more documentation

* At least one usage example
* An API documentation
* Badges that show how greate your module does (tests passing, coverage etc).
* A license file

If you add those files, your module might look like this

<pre><code>
example-project-2-example-license-jsdoc-badges/
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought">.thought/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/.thought/config.js">config.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/.travis.yml">.travis.yml</a>
├─┬ <a href="../examples/example-project-2-example-license-jsdoc-badges/examples">examples/</a>
│ └── <a href="../examples/example-project-2-example-license-jsdoc-badges/examples/example.js">example.js</a>
├── <a href="../examples/example-project-2-example-license-jsdoc-badges/index.js">index.js</a>
└── <a href="../examples/example-project-2-example-license-jsdoc-badges/package.json">package.json</a>
</code></pre>

```js
var multiply = require('../')

var x = 3
var y = 4
var xy = multiply(x, y)

console.log(xy)

```


You can put this file in the project directory under `examples/example.js`, so the whole project now looks like this:


If you run `thought run -a` in this directory, Thought will include the example-code into the README.
You might have noticed, that the example uses `require('../')` to reference the current module. This means
you can execute and test the example, but you probably don't want it in the README like this.
Thought will replace the `require('../')` by `require('name-of-the-module')` before including it into the
README. It will also execute the example and include the output in the README, which means that it will
never be outdated. The [generated README now looks like this](examples/example-project-stage2/README.md)

### Adding a jsdoc-reference

You probably also want to provide a small API reference so that users don't have to look into the
source-code all the time. You can do that with the plugin `thought-plugin-jsdoc`. It will load the jsdoc from the file that TODO


Let's create a small module to demonstrate the use of Thought.
We create a directory `example-project` and run `npm -y init` to create a [package.json](examples/example-project/package.json).

After that, we create an `index.js` with a function that multiplies two numbers. We also
add jsdoc-comments that document the function:



TODO: Text is still missing

* [Example project](../examples/example-project-2-example-license-jsdoc-badges/)

## Tutorials:

* [Simple Usage](example-project-1-simple.md)
* [Examples, License, JSDoc, Badges](example-project-2-example-license-jsdoc-badges.md)
* [Templates, Partials, Helpers, Preprocessor](example-project-3-templates-partials-helpers-preprocessor.md)
* [Writing plugins](example-project-4-writing-plugins.md)