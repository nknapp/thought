/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

const path = require('path')
const fs = require('fs')

// Default config if the file `.thought/config.js` does not exist
const defaultConfig = {
  plugins: []
}

/**
 *
 * Create a spec that can be loaded with `customize` using the `load()` function.
 *
 * @param {String} workingDir the working directory of thought
 * @returns {Function} the Customize-Spec
 */
module.exports = function createSpec (workingDir) {
  return function thoughtSpec (customize) {
    const configFile = path.resolve('.thought', 'config.js')
    var config = fs.existsSync(configFile) ? require(configFile) : defaultConfig
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
          preprocessor: require('./handlebars/preprocessor.js'),
          hbsOptions: {
            noEscape: true
          }
        }
      })
      // Apply any customization from the config-files (such as loading modules)
      .load(function (customize) {
        const result = config.plugins.reduce((prev, plugin) => {
          return prev.load(plugin)
        }, customize)
        return result
      })
      .merge({
        handlebars: {
          partials: path.join(workingDir, '.thought', 'partials'),
          templates: path.join(workingDir, '.thought', 'templates'),
          helpers: path.resolve(workingDir, '.thought', 'helpers.js'),
          preprocessor: path.resolve(workingDir, '.thought', 'preprocessor.js')
        }
      })
  }
}
