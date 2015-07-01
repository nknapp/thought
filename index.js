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
var debug = require('debug')('thought:index')

/**
 * Execute Thought in the current directory
 * @param {object} options
 * @param {string} options.cwd the working directory to use as project root
 * @api public
 */
module.exports = function thought (options) {
  options = options || {}

  customize()
    // Load `customize`-spec
    .load(require('./customize.js')(options.cwd || '.'))
    .run()
    .then(function (result) {
      debug('customize-result', result)
      return Q.all(Object.keys(result.handlebars).map(function (filename) {
        qfs.write(filename, result.handlebars[filename])
        return filename
      }))
    })
    .done(function (filenames) {
      console.log('The following files were updated: ' + filenames.join(', '))
    })

}
