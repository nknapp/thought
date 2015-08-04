# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).


## Upcoming
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