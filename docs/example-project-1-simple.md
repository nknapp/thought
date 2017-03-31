# Simple project 

Let's say, you have just created a new npm-module, but you have not created a README yet. 
This is how your project looks like:

<pre><code>
example-project-1-simple
├── <a href="../examples/example-project-1-simple/index.js">index.js</a>
└── <a href="../examples/example-project-1-simple/package.json">package.json</a>
</code></pre>

### package.json  

```json
{
  "name": "example-project-1-simple",
  "version": "1.0.0",
  "description": "An example to show what thought generates on with the vanilla template.",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "MIT"
}

```


### index.js

```js
/**
 * Multiplies two numbers
 * @param {number} a the first number
 * @param {number} b the second number
 * @return {number} the product of `a` and `b`
 * @module example-project
 * @public
 */
module.exports = function multiply (a, b) {
  return a * b
}

```


## Result

Thought will create a [README.md](examples/example-project-1-simple/README.md)-file and a
[CONTRIBUTING.md](examples/example-project-1-simple/CONTRIBUTING.md)-file.

After running `thought run -a`, the project will look like this. Click on the tree to see the file contents:

<pre><code>
example-project-1-simple
├── <a href="../examples/example-project-1-simple/CONTRIBUTING.md">CONTRIBUTING.md</a>
├── <a href="../examples/example-project-1-simple/README.md">README.md</a>
├── <a href="../examples/example-project-1-simple/index.js">index.js</a>
└── <a href="../examples/example-project-1-simple/package.json">package.json</a>
</code></pre>

## Tutorial & Examples:

* [Simple Usage](example-project-1-simple.md)
* [Examples, License, JSDoc, Badges](example-project-2-example-license-jsdoc-badges.md)
* [Templates, Partials, Helpers, Preprocessor](example-project-3-templates-partials-helpers-preprocessor.md)
* [Writing plugins](example-project-4-writing-plugins.md)

[Back to the README](../README.md)