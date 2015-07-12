/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var path = require('path')

/**
 *
 * Create a spec that can be loaded with `customize` using the `load()` function.
 *
 * @param {String} workingDir the working directory of thought
 * @returns {Function} the Customize-Spec
 */
module.exports = function createSpec (workingDir) {
  return function thoughtSpec (customize) {
    return customize
      .registerEngine('handlebars', require('customize-engine-handlebars'))
      .merge({
        handlebars: {
          partials: path.join(__dirname, 'handlebars', 'partials'),
          templates: path.join(__dirname, 'handlebars', 'templates'),
          helpers: require.resolve('./handlebars/helpers.js'),
          data: {
            'package': require(path.resolve(workingDir, 'package.json')),
            'workingDir': workingDir
          },
          preprocessor: require('./handlebars/preprocessor.js')
        }
      })
      .merge({
        handlebars: {
          partials: path.join(workingDir, '.thought', 'partials'),
          templates: path.join(workingDir, '.thought', 'templates'),
          helpers: path.resolve(workingDir, '.thought', 'hb-helpers,js'),
          preprocessor: path.resolve(workingDir, '.thought', 'hb-preprocessor.js')
        }
      })
      // .tap(console.log)

  }
}
