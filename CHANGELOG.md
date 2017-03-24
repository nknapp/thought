# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

<a name="current-release"></a>
# Version 1.0.1 (Fri, 24 Mar 2017 12:23:35 GMT)

* [2963a51](https://github.com/nknapp/thought/commit/2963a51) Fix link to handlebars-directory in README - Nils Knappmeier

# Version 1.0.0 (Fri, 24 Mar 2017 10:47:13 GMT)

* [1c68d98](https://github.com/nknapp/thought/commit/1c68d98) More documentation (especially API-docs of the helpers) - Nils Knappmeier
* [84446b4](https://github.com/nknapp/thought/commit/84446b4) Support for loading plugins - Nils Knappmeier
* [dac01c6](https://github.com/nknapp/thought/commit/dac01c6) "hasGreenkeeper" now returns "false" for projects without repo-url - Nils Knappmeier


# Version 0.11.0 (Sun, 19 Mar 2017 16:41:52 GMT)

* [0f2b229](https://github.com/nknapp/thought/commit/0f2b229) Update depedency-versions - Nils Knappmeier
* [00452b4](https://github.com/nknapp/thought/commit/00452b4) BREAKING: Change "htmlId"-helper to match the GitHub way of creating url-hashes - Nils Knappmeier
* [5ad6c17](https://github.com/nknapp/thought/commit/5ad6c17) Add tests for all helpers - Nils Knappmeier
* [8f2cc3b](https://github.com/nknapp/thought/commit/8f2cc3b) BREAKING: Do not resolve "directories"-property in preprocessor - Nils Knappmeier
* [d7e0f94](https://github.com/nknapp/thought/commit/d7e0f94) Add tests for "addToGit" and projects with examples - Nils Knappmeier
* [2c12bf1](https://github.com/nknapp/thought/commit/2c12bf1) BREAKING: Remove jsdoc-helper, apidoc-helper + a lot of chore - Nils Knappmeier
* [2909051](https://github.com/nknapp/thought/commit/2909051) BREAKING: Remove support for old node versions + Support for greenkeeper - Nils Knappmeier
* [afb708f](https://github.com/nknapp/thought/commit/afb708f) Simple framework for integration-tests - Nils Knappmeier



# Version 0.10.0 (Fri, 13 Jan 2017 13:38:25 GMT)

* [05cfa0e](https://github.com/nknapp/thought/commit/05cfa0e) Add parameter 'up-to-date-hook' for checking generated files (#4) - Nils Knappmeier

# Version 0.9.4 (Tue, 20 Dec 2016 00:19:44 GMT)

* [6fc2471](https://github.com/nknapp/thought/commit/6fc2471) Use new customize-version from github - Nils Knappmeier


# Version 0.9.3 (Tue, 20 Dec 2016 00:03:45 GMT)

* [a5ce38b](https://github.com/nknapp/thought/commit/a5ce38b) Update m-io version for handling of missing "templates" directory - Nils Knappmeier

# Version 0.9.2 (Mon, 19 Dec 2016 23:52:15 GMT)

* [f2dd765](https://github.com/nknapp/thought/commit/f2dd765) More replacements of q-io by m-io - Nils Knappmeier

# Version 0.9.1 (Mon, 19 Dec 2016 23:05:19 GMT)

* [d360f70](https://github.com/nknapp/thought/commit/d360f70) Use "m-io/fs" instead of "q-io/fs" - Nils Knappmeier

# Version 0.9.0 (Mon, 19 Dec 2016 22:19:10 GMT)

* [c76f64c](https://github.com/nknapp/thought/commit/c76f64c) Use "trace-and-clarify-if-possible" - Nils Knappmeier
* [2ecdeba](https://github.com/nknapp/thought/commit/2ecdeba) Upgrade package dependencies - Nils Knappmeier
* [1467cf9](https://github.com/nknapp/thought/commit/1467cf9) Reduce size by replacing jsdoc-to-markdown with jsdoc-parse and dmd - Nils Knappmeier

# Version 0.8.1 (Tue, 12 Jul 2016 20:54:47 GMT)

* [b3cbd2b](https://github.com/nknapp/thought/commit/b3cbd2b) Use "thoughtful-release" to update the changelog on version bumps - Nils Knappmeier

# Version 0.8.0 (Tue, 12 Jul 2016 20:46:16 GMT)

* [1c8a344](https://github.com/nknapp/thought/commit/1c8a344) Minor JSDoc comments added - Nils Knappmeier
* [8465f12](https://github.com/nknapp/thought/commit/8465f12) Add White-space control to badge-partials - Nils Knappmeier
* [c02604f](https://github.com/nknapp/thought/commit/c02604f) Appveyor badge must be there only if 'appveyor.yml' is present - Nils Knappmeier
* [d761a92](https://github.com/nknapp/thought/commit/d761a92) Badges are now in separate partials. Badge for Appveyor - Nils Knappmeier

# Version 0.7.0 (Wed, 27 Jan 2016 19:22:15 GMT)

* [f6d322b](https://github.com/nknapp/thought/commit/f6d322b) Add release anchor to CHANGELOG.md - Nils Knappmeier
* [fd46555](https://github.com/nknapp/thought/commit/fd46555) Fix for travis and Coveralls badges - Nils Knappmeier
* [4857c6e](https://github.com/nknapp/thought/commit/4857c6e) Added "github" helper to create links to github files. - Nils Knappmeier
* [781f63e](https://github.com/nknapp/thought/commit/781f63e) Use "customize-write-files" to save the resulting files to disk. - Nils Knappmeier
* [8ad63d2](https://github.com/nknapp/thought/commit/8ad63d2) Remove "API"-header if no main-file is configured - Nils Knappmeier
* [327adcb](https://github.com/nknapp/thought/commit/327adcb) Only show "npm install..." if package is not marked as private. - Nils Knappmeier
* [f9b117e](https://github.com/nknapp/thought/commit/f9b117e) Show badges based on conditions - Nils Knappmeier
* [1bbdc8f](https://github.com/nknapp/thought/commit/1bbdc8f) Remove redundant badge - Nils Knappmeier
* [af24469](https://github.com/nknapp/thought/commit/af24469) {{withPackageOf}}: Remove leading "git+" from dependency repository urls - Nils Knappmeier



## v0.6.1 - 2015-11-29

### Doc

* Remove development notice in README.md

## v0.6.0 - 2015-11-29

### Change

* Renamed helper "dirtree" to "dirTree"
* dirTree-helper is no async
* Using [archy](https://www.npmjs.com/package/archy) for tree-rendering

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
