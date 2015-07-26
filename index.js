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
var debug = require('debug')('thought:run')

/**
 * Execute Thought in the current directory
 * @param {object} options
 * @param {string} options.cwd the working directory to use as project root
 * @api public
 */
module.exports = function thought (options) {
  options = options || {}
  debug('options', options)
  return customize()
    // Load `customize`-spec
    .load(require('./customize.js')(options.cwd || '.'))
    .run()
    .then(function (result) {
      debug('customize-result', result)
      return Q.all(Object.keys(result.handlebars).map(function (filename) {
        return qfs.write(filename, result.handlebars[filename])
          .then(function () {
            return filename
          })
      }))
    })
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
