/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var customize = require('customize')
var Q = require('q')
var qfs = require('q-io/fs')
var fs = require('fs')
var debug = require('debug')('thought:run')
var write = require('customize-write-files')

module.exports = thought

/**
 * Execute Thought in the current directory
 * @param {object} options
 * @param {string} options.cwd the working directory to use as project root
 * @api public
 */
function thought (options) {
  options = options || {}
  debug('options', options)
  return customize()
    // Load `customize`-spec
    .load(require('./customize.js')(options.cwd || '.'))
    .run()
    .then(write(options.cwd || '.'))
    .then(function (filenames) {
      if (options['addToGit']) {
        // Add computed files to the git index.
        var git = require('simple-git')()
        var deferred = Q.defer()
        debug('Adding ' + filenames.join(', ') + ' to git index')
        git.add(filenames, deferred.makeNodeResolver())
        //  Wait for git-add to finish, but return the filenames.
        return deferred.promise.then(function () {
          return filenames
        })
      }
      return filenames
    })
}
