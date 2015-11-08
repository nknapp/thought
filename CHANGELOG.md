# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## v0.5.3 - 2015-11-08

### Fix

* Accept all unstable version of `customize`.

## v0.5.2 - 2015-10-05

### Fix 

* Apply workaround for [issue in the `write()`-method of `q-io/fs`](https://github.com/kriskowal/q-io/issues/149) 

## v0.5.1 - 2015-09-28

### Fix

* Typo while loading `helpers.js`. Custom helpers did not load.

## v0.5.0 - 2015-08-17

### Add

* The `example` helper now has an additional hash-argument `snippet`. It this is set to `true`,
  only contents within the lines containing `---<snip>---` and `---</snip>---` is 
  included.
  
* The `exec` helper now has the special lang-value `inline` which wraps the process output
  with single backquotes instead of fences.

## v0.4.1 and v0.4.2 - 2015-08-15

### Fix

* Docs and formatting

## v0.4.0 - 2015-08-15

### Fix

* Documentation cleanup, more documentation about customizing the documentation templates.

## Change

* The files to override helpers and the preprocessor are now
    `.thought/helpers.js` and `.thought/preprocessor.js` to consolidate
     with the structure of the `handlebars/`-directory in Thought.

## v0.3.0 - 2015-08-15

### Change

* Generate CONTRIBUTING.md instead of including guidelines into README 
  (https://github.com/blog/1184-contributing-guidelines)

### Fix

* `htmlId` helper now always returns lowercase


## v0.2.1 - 2015-08-06

### Fix

* If the `jsdoc`-helper did not create any docs, the whole output file was not written.

## v0.2.0 - 2015-08-04
### Change

* `rendertree` is now a block-helper, the label of each node is determined by the block-contents
* `example`-helper now also converts `require('../file')` into `require('package-name/file')
* `include`-helper: Determines fence-type from file-extension if not explicitly provided
* In order to run thought, `thought run` must be called.

... and many more changes

### Add

* Additional helper `jsdoc` to generate documentation for javscript-files. `multilang-apidocs` is by 
  far not as powerful as `jsdoc-to-markdown`
* `npm`-helper to link to the npm-page of a page

## v0.0.1 - 2015-07-02
### Initial version