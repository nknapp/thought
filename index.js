/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var customize = require('customize')
var debug = require('debug')('thought:run')
var write = require('customize-write-files')

module.exports = thought

/**
 * Execute Thought in the current directory
 * @param {object} options
 * @param {string} [options.cwd] the working directory to use as project root (**deprecated** because it does not always
 *  work as expected)
 * @param {boolean} [options.addToGit] add created files to git
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
      if (options.addToGit) {
        // Add computed files to the git index.
        return new Promise((resolve, reject) => {
          var git = require('simple-git')()
          debug('Adding ' + filenames.join(', ') + ' to git index')
          //  Wait for git-add to finish, but return the filenames.
          git.add(filenames, (err) => err ? reject(err) : resolve(filenames))
        })
      }
      return filenames
    })
}
