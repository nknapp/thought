# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

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