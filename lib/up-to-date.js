/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
'use strict'

var customize = require('customize')
var debug = require('debug')('thought:up-to-date')
var write = require('customize-write-files')

module.exports = uptodateCheck

/**
 * Execute Thought in the current directory
 * @param {object} options
 * @param {string} [options.cwd] the working directory to use as project root
 * @api public
 */
function uptodateCheck (options) {
  options = options || {}
  debug('options', options)
  return customize()
  // Load `customize`-spec
    .load(require('../customize')(options.cwd || '.'))
    .run()
    .then(write.changed(options.cwd || '.'))
    .then(function (changedCheck) {
      // Would a file have been changed by running thought?
      debug('Changed files', changedCheck)
      if (changedCheck.changed) {
        var error = new Error('Source files have changed. Please re-run me.')
        error.changedFiles = changedCheck.files
        throw error
      }
    })
}
