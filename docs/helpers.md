## Helpers API

The following helpers are built-in for use in templates and partials

<a name="helpers"></a>

## helpers
Default Handlebars-helpers for Thought

**Kind**: global variable  

* [helpers](#helpers)
    * [.dirTree(baseDir, [globPattern], options)](#helpers.dirTree) ⇒ <code>string</code>
    * [.json(obj)](#helpers.json) ⇒ <code>string</code>
    * [.include(filename, language)](#helpers.include) ⇒ <code>string</code>
    * [.includeRaw(filename)](#helpers.includeRaw)
    * [.example(filename)](#helpers.example)
    * [.exists(filename)](#helpers.exists) ⇒ <code>boolean</code>
    * [.exec(command, options)](#helpers.exec) ⇒ <code>string</code>
    * [.renderTree(object, options)](#helpers.renderTree) ⇒ <code>string</code>
    * [.withPackageOf(filePath, options)](#helpers.withPackageOf)
    * [.npm(packageName)](#helpers.npm)
    * [.htmlId(value)](#helpers.htmlId) ⇒ <code>string</code>
    * [.hasCoveralls()](#helpers.hasCoveralls) ⇒ <code>boolean</code>
    * [.hasGreenkeeper(options)](#helpers.hasGreenkeeper)
    * [.github(filePath)](#helpers.github) ⇒ <code>string</code>
    * [.repoWebUrl(gitUrl)](#helpers.repoWebUrl)
    * [.githubRepo()](#helpers.githubRepo) ⇒ <code>string</code>
    * [.arr(...args)](#helpers.arr)

<a name="helpers.dirTree"></a>

### helpers.dirTree(baseDir, [globPattern], options) ⇒ <code>string</code>
Return a drawing of a directory tree (using [archy](https://www.npmjs.com/package/archy))

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>string</code> - a display of the directory tree of the selected files and directories.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| baseDir | <code>string</code> | the base directory from which the `globPattern` is applied |
| [globPattern] | <code>string</code> | a pattern describing all files and directories to include into the tree-view. (default: '**') |
| options | <code>object</code> | passsed in by Handlebars |
| options.hash | <code>object</code> | parameters passed in as `key=value` |
| options.hash.links | <code>boolean</code> | should a link be created for each file matching the glob? |
| options.hash.dot | <code>boolean</code> | should dot-files be displayed implicitely. This sets the 'dot' option  in the 'glob'-module |
| options.hash.ignore | <code>string</code> \| <code>Array.&lt;string&gt;</code> | Glob pattern of files to ignore. This sets the 'ignore' option  in the 'glob'-module. |
| options.hash.label | <code>string</code> | a label for the root node of the tree |

<a name="helpers.json"></a>

### helpers.json(obj) ⇒ <code>string</code>
Display an object as indented JSON-String.

This is mainly for testing purposes when adapting templates

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>string</code> - JSON.stringify()  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | the object |

<a name="helpers.include"></a>

### helpers.include(filename, language) ⇒ <code>string</code>
Include a file into a markdown code-block

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Description |
| --- | --- |
| filename |  |
| language | the programming language used for the code-block |

<a name="helpers.includeRaw"></a>

### helpers.includeRaw(filename)
Directly include a file without markdown fences.

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param |
| --- |
| filename | 

<a name="helpers.example"></a>

### helpers.example(filename)
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

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | the name of the example file |
| options.hash | <code>object</code> |  |
| options.hash.snippet | <code>boolean</code> | If set to true, only the lines between    &lt;snip> and &lt;/snip> will be included |

<a name="helpers.exists"></a>

### helpers.exists(filename) ⇒ <code>boolean</code>
Return true if a file exists

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>boolean</code> - true, if the file or diectory exists  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filename | <code>string</code> | the path to the file |

<a name="helpers.exec"></a>

### helpers.exec(command, options) ⇒ <code>string</code>
Execute a command and include the output in a fenced code-block.

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>string</code> - the output of `execSync`, enclosed in fences.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | the command, passed to `child-process#execSync()` |
| options | <code>object</code> | optional arguments and Handlebars internal args. |
| options.hash.lang | <code>string</code> | the language tag that should be attached to the fence    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences. |
| options.hash.cwd | <code>string</code> | the current working directory of the example process |

<a name="helpers.renderTree"></a>

### helpers.renderTree(object, options) ⇒ <code>string</code>
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

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| object |  |  |
| options |  |  |
| options.fn | <code>function</code> | computes the label for a node based on the node itself |

<a name="helpers.withPackageOf"></a>

### helpers.withPackageOf(filePath, options)
Set special variable for accessing information from the context of a file (possibly in a dependency)

This block helper executes the block in the current context but sets special variables:

* `@url`: The github-url of the given file in the current package version is stored into
* `@package`: The `package.json` of the file's module is stored into
* `@relativePath`: The relative path of the file within the repository

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | file that is used to find that package.json |
| options | <code>object</code> | options passed in by Handlebars |

<a name="helpers.npm"></a>

### helpers.npm(packageName)
Create a link to the npm-page of a package

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| packageName | <code>string</code> | the name of the package |

<a name="helpers.htmlId"></a>

### helpers.htmlId(value) ⇒ <code>string</code>
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

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>string</code> - a string value  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | the input value of the URL (e.g. the header name) |

<a name="helpers.hasCoveralls"></a>

### helpers.hasCoveralls() ⇒ <code>boolean</code>
Check, if [coveralls.io](https://coveralls.io) is configured in this package

Check the .travis.yml and the appveyor.yml files for the string 'coveralls'
and return true if any of them exists and contains the string.
We expect coveralls to be configured then.

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>boolean</code> - true, if coveralls is configured  
**Access**: public  
<a name="helpers.hasGreenkeeper"></a>

### helpers.hasGreenkeeper(options)
Check, if [Greenkeeper](https://greenkeeper.io) is enabled for this repository

This is done by analyzing the greenkeeper.io-[badge](https://badges.greenkeeper.io/nknapp/thought.svg)

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options passed in by Handlebars |

<a name="helpers.github"></a>

### helpers.github(filePath) ⇒ <code>string</code>
Resolve the display-URL of a file on github.

This works for files in the current package and in dependencies, as long as the repository-url is
set correctly in package.json

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Returns**: <code>string</code> - the URL  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | the path to the file |

<a name="helpers.repoWebUrl"></a>

### helpers.repoWebUrl(gitUrl)
Returns the http-url for viewing a git-repository in the browser given a repo-url from the package.json
Currently, only github urls are supported

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| gitUrl | <code>string</code> | the git url from the repository.url-property of package.json |

<a name="helpers.githubRepo"></a>

### helpers.githubRepo() ⇒ <code>string</code>
Returns the current repository group and name (e.g. `nknapp/thought` for this project)

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  
<a name="helpers.arr"></a>

### helpers.arr(...args)
Returns an array of the passed arguments (excluding the `options`-parameter).
This helper can be used like `{{dirTree 'dir' ignore=(arr 'file1' 'file2')}}`
to provide array-arguments to other helpers.

**Kind**: static method of [<code>helpers</code>](#helpers)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>\*</code> | a list of arguments |


 
