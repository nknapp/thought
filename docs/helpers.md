## Helpers API

The following helpers are built-in for use in templates and partials

## Functions

<dl>
<dt><a href="#json">json(obj)</a> ⇒ <code>string</code></dt>
<dd><p>Display an object as indented JSON-String.</p>
<p>This is mainly for testing purposes when adapting templates</p>
</dd>
<dt><a href="#include">include(filename, language)</a> ⇒ <code>string</code></dt>
<dd><p>Include a file into a markdown code-block</p>
</dd>
<dt><a href="#includeRaw">includeRaw(filename)</a></dt>
<dd><p>Directly include a file without markdown fences.</p>
</dd>
<dt><a href="#example">example(filename)</a></dt>
<dd><p>Includes an example file into the template, replacing <code>require()</code> calls to the current
module by <code>require(&#39;module-name&#39;)</code> (only single-quotes are replaced)</p>
<p>If your file is <code>examples/example.js</code>, you would do</p>
<pre><code class="language-javascript">var fn = require(&#39;../&#39;)
</code></pre>
<p>to load your module. That way, you get an executable script.
The helper will when include</p>
<pre><code class="lang-js">var fn = require(&#39;module-name&#39;)
</code></pre>
<p>in your docs, which is what a user of the module will do.</p>
</dd>
<dt><a href="#exists">exists(filename)</a> ⇒ <code>boolean</code></dt>
<dd><p>Return true if a file exists</p>
</dd>
<dt><a href="#exec">exec(command, options)</a> ⇒ <code>string</code></dt>
<dd><p>Execute a command and include the output in a fenced code-block.</p>
</dd>
<dt><a href="#dirTree">dirTree(globPattern, [baseDir], options)</a> ⇒ <code>string</code></dt>
<dd><p>Return a drawing of a directory tree (using <a href="https://www.npmjs.com/package/archy">archy</a>)</p>
</dd>
<dt><a href="#renderTree">renderTree(object, options)</a> ⇒ <code>string</code></dt>
<dd><p>Render an object hierarchy.</p>
<p>The expected input is of the form</p>
<pre><code>{
  prop1: &#39;value&#39;,
  prop2: &#39;value&#39;,
  ...,
  children: [
    {
       prop1: &#39;value&#39;,
       propt2: &#39;value&#39;,
       ...,
       children: ...
    }
  ]
}
</code></pre><p>The tree is transformed and rendered using <a href="https://www.npmjs.com/package/archy">archy</a></p>
</dd>
<dt><a href="#withPackageOf">withPackageOf(filePath, options)</a></dt>
<dd><p>Set special variable for accessing information from the context of a file (possibly in a dependency)</p>
<p>This block helper executes the block in the current context but sets special variables:</p>
<ul>
<li><code>@url</code>: The github-url of the given file in the current package version is stored into</li>
<li><code>@package</code>The <code>package.json</code> of the file&#39;s module is stored into</li>
</ul>
</dd>
<dt><a href="#npm">npm(packageName)</a></dt>
<dd><p>Create a link to the npm-page of a package</p>
</dd>
<dt><a href="#htmlId">htmlId(value)</a> ⇒ <code>string</code></dt>
<dd><p>Convert a name into a valid id (like github does with header names)</p>
<p>This helper creates valid html-ids from header name. It attempts to
follow the same rules that github uses to convert header names (h1, h2) into the
hash-part of the URL referencing this header.</p>
<pre><code class="language-javascript">htmlId(&#39;abc&#39;) === &#39;abc&#39;
htmlId(&#39;abc cde&#39;) === &#39;abc-cde&#39; // Replace spaces by &#39;-&#39;
htmlId(&#39;a$b&amp;c%d&#39;) === &#39;abcd&#39;  // Remove all characters execpt alpahnumericals and minus
htmlId(&#39;mäxchen&#39; === &#39;mäxchen&#39; // Do not remove german umlauts
htmlId(&#39;ハッピークリスマス&#39;) === &#39;ハッピークリスマス&#39; // Do not remove japanase word characters
htmlId(&#39;ABCDE&#39;) === &#39;abcde&#39;   // Convert to lowercase
</code></pre>
</dd>
<dt><a href="#hasCoveralls">hasCoveralls()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check, if <a href="https://coveralls.io">coveralls.io</a> is configured in this package</p>
<p>Check the .travis.yml and the appveyor.yml files for the string &#39;coveralls&#39;
and return true if any of them exists and contains the string.
We expect coveralls to be configured then.</p>
</dd>
<dt><a href="#hasGreenkeeper">hasGreenkeeper(options)</a></dt>
<dd><p>Check, if <a href="https://greenkeeper.io">Greenkeeper</a> is enabled for this repository</p>
<p>This is done by analyzing the greenkeeper.io-<a href="https://badges.greenkeeper.io/nknapp/thought.svg">badge</a></p>
</dd>
<dt><a href="#transformTree">transformTree(object, fn)</a></dt>
<dd><p>Transfrom an object hierarchy into <code>archy</code>&#39;s format</p>
<p>Transform a tree-structure of the form</p>
<pre><code>{
  prop1: &#39;value&#39;,
  prop2: &#39;value&#39;,
  ...,
  children: [
    {
       prop1: &#39;value&#39;,
       propt2: &#39;value&#39;,
       ...,
       children: ...
    }
  ]
}
</code></pre><p>Into an <a href="https://www.npmjs.com/package/archy">archy</a>-compatible format, by passing each node to a block-helper function.
The result of the function should be a string which is then used as label for the node.</p>
</dd>
<dt><a href="#treeFromPathComponents">treeFromPathComponents(files, label)</a> ⇒ <code>object</code></dt>
<dd><p>Transform an array of path components into an <a href="https://www.npmjs.com/package/archy">archy</a>-compatible tree structure.</p>
<pre><code>[ [ &#39;abc&#39;, &#39;cde&#39;, &#39;efg&#39; ], [ &#39;abc&#39;,&#39;cde&#39;,&#39;abc&#39;], [&#39;abc&#39;,&#39;zyx&#39;] ]
</code></pre><p>becomes</p>
<pre><code>{
  label: &#39;abc&#39;,
  nodes: [
        {
          label: &#39;cde&#39;,
          nodes: [
            &#39;efg&#39;,
            &#39;abc&#39;
          ]
        },
        &#39;zyx&#39;
  ]
}
</code></pre><p>Nodes with a single subnode are collapsed and the resulting node gets the label <code>node/subnode</code>.</p>
</dd>
<dt><a href="#github">github(filePath)</a> ⇒ <code>string</code></dt>
<dd><p>Resolve the display-URL of a file on github.</p>
<p>This works for files in the current package and in dependencies, as long as the repository-url is
set correctly in package.json</p>
</dd>
<dt><a href="#githubRepo">githubRepo()</a> ⇒ <code>string</code></dt>
<dd><p>Returns the current repository group and name (e.g. <code>nknapp/thought</code> for this project)</p>
</dd>
</dl>

<a name="json"></a>

## json(obj) ⇒ <code>string</code>
Display an object as indented JSON-String.

This is mainly for testing purposes when adapting templates

**Kind**: global function  
**Returns**: <code>string</code> - JSON.stringify()  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | the object |

<a name="include"></a>

## include(filename, language) ⇒ <code>string</code>
Include a file into a markdown code-block

**Kind**: global function  
**Api**: public  

| Param | Description |
| --- | --- |
| filename |  |
| language | the programming language used for the code-block |

<a name="includeRaw"></a>

## includeRaw(filename)
Directly include a file without markdown fences.

**Kind**: global function  

| Param |
| --- |
| filename | 

<a name="example"></a>

## example(filename)
Includes an example file into the template, replacing `require()` calls to the current
module by `require('module-name')` (only single-quotes are replaced)

If your file is `examples/example.js`, you would do
```js
var fn = require('../')
```
to load your module. That way, you get an executable script.
The helper will when include
```js
var fn = require('module-name')
```
in your docs, which is what a user of the module will do.

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | the name of the example file |
| options.hash | <code>object</code> |  |
| options.hash.snippet | <code>boolean</code> | If set to true, only the lines between    &lt;snip> and &lt;/snip> will be included |

<a name="exists"></a>

## exists(filename) ⇒ <code>boolean</code>
Return true if a file exists

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if the file or diectory exists  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | the path to the file |

<a name="exec"></a>

## exec(command, options) ⇒ <code>string</code>
Execute a command and include the output in a fenced code-block.

**Kind**: global function  
**Returns**: <code>string</code> - the output of `execSync`, enclosed in fences.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | the command, passed to `child-process#execSync()` |
| options | <code>object</code> | optional arguments and Handlebars internal args. |
| options.hash.lang | <code>string</code> | the language tag that should be attached to the fence    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences. |
| options.hash.cwd | <code>string</code> | the current working directory of the example process |

<a name="dirTree"></a>

## dirTree(globPattern, [baseDir], options) ⇒ <code>string</code>
Return a drawing of a directory tree (using [archy](https://www.npmjs.com/package/archy))

**Kind**: global function  
**Returns**: <code>string</code> - a display of the directory tree of the selected files and directories.  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| globPattern | <code>string</code> | a pattern describing all files and directories to include into the tree-view. |
| [baseDir] | <code>string</code> | the base directory from which the `globPattern` is applied. |
| options | <code>object</code> | passsed in by Handlebars |

<a name="renderTree"></a>

## renderTree(object, options) ⇒ <code>string</code>
Render an object hierarchy.

The expected input is of the form

```
{
  prop1: 'value',
  prop2: 'value',
  ...,
  children: [
    {
       prop1: 'value',
       propt2: 'value',
       ...,
       children: ...
    }
  ]
}
```

The tree is transformed and rendered using [archy](https://www.npmjs.com/package/archy)

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| object |  |  |
| options |  |  |
| options.fn | <code>function</code> | computes the label for a node based on the node itself |

<a name="withPackageOf"></a>

## withPackageOf(filePath, options)
Set special variable for accessing information from the context of a file (possibly in a dependency)

This block helper executes the block in the current context but sets special variables:

* `@url`: The github-url of the given file in the current package version is stored into
* `@package`The `package.json` of the file's module is stored into

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | file that is used to find that package.json |
| options | <code>object</code> | options passed in by Handlebars |

<a name="npm"></a>

## npm(packageName)
Create a link to the npm-page of a package

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| packageName | <code>string</code> | the name of the package |

<a name="htmlId"></a>

## htmlId(value) ⇒ <code>string</code>
Convert a name into a valid id (like github does with header names)

This helper creates valid html-ids from header name. It attempts to
follow the same rules that github uses to convert header names (h1, h2) into the
hash-part of the URL referencing this header.

```js
htmlId('abc') === 'abc'
htmlId('abc cde') === 'abc-cde' // Replace spaces by '-'
htmlId('a$b&c%d') === 'abcd'  // Remove all characters execpt alpahnumericals and minus
htmlId('mäxchen' === 'mäxchen' // Do not remove german umlauts
htmlId('ハッピークリスマス') === 'ハッピークリスマス' // Do not remove japanase word characters
htmlId('ABCDE') === 'abcde'   // Convert to lowercase
```

**Kind**: global function  
**Returns**: <code>string</code> - a string value  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the input value of the URL (e.g. the header name) |

<a name="hasCoveralls"></a>

## hasCoveralls() ⇒ <code>boolean</code>
Check, if [coveralls.io](https://coveralls.io) is configured in this package

Check the .travis.yml and the appveyor.yml files for the string 'coveralls'
and return true if any of them exists and contains the string.
We expect coveralls to be configured then.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if coveralls is configured  
**Api**: public  
<a name="hasGreenkeeper"></a>

## hasGreenkeeper(options)
Check, if [Greenkeeper](https://greenkeeper.io) is enabled for this repository

This is done by analyzing the greenkeeper.io-[badge](https://badges.greenkeeper.io/nknapp/thought.svg)

**Kind**: global function  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options passed in by Handlebars |

<a name="transformTree"></a>

## transformTree(object, fn)
Transfrom an object hierarchy into `archy`'s format

Transform a tree-structure of the form
```
{
  prop1: 'value',
  prop2: 'value',
  ...,
  children: [
    {
       prop1: 'value',
       propt2: 'value',
       ...,
       children: ...
    }
  ]
}
```
Into an [archy](https://www.npmjs.com/package/archy)-compatible format, by passing each node to a block-helper function.
The result of the function should be a string which is then used as label for the node.

**Kind**: global function  
**Api**: private  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | the tree data |
| fn |  | the block-helper function (options.fn) of Handlebars (http://handlebarsjs.com/block_helpers.html) |

<a name="treeFromPathComponents"></a>

## treeFromPathComponents(files, label) ⇒ <code>object</code>
Transform an array of path components into an [archy](https://www.npmjs.com/package/archy)-compatible tree structure.

```
[ [ 'abc', 'cde', 'efg' ], [ 'abc','cde','abc'], ['abc','zyx'] ]
```

becomes

```
{
  label: 'abc',
  nodes: [
        {
          label: 'cde',
          nodes: [
            'efg',
            'abc'
          ]
        },
        'zyx'
  ]
}
```

Nodes with a single subnode are collapsed and the resulting node gets the label `node/subnode`.

**Kind**: global function  
**Returns**: <code>object</code> - a tree structure as needed by [archy](https://www.npmjs.com/package/archy)  
**Api**: private  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | an array of filenames, split by `path.sep` |
| label | <code>string</code> | the label for the current tree node |

<a name="github"></a>

## github(filePath) ⇒ <code>string</code>
Resolve the display-URL of a file on github.

This works for files in the current package and in dependencies, as long as the repository-url is
set correctly in package.json

**Kind**: global function  
**Returns**: <code>string</code> - the URL  
**Api**: public  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | the path to the file |

<a name="githubRepo"></a>

## githubRepo() ⇒ <code>string</code>
Returns the current repository group and name (e.g. `nknapp/thought` for this project)

**Kind**: global function  
**Api**: public  

 
