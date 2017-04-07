/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

const path = require('path')
const fs = require('fs')
const debug = require('debug')

/**
 * Default configuration for .thought. Override this configuration by creating a file `.thought/config.js`
 * @api public
 */
const defaultConfig = {
  plugins: [],
  badges: {
    /**
     * Should there be a greenkeeper badge?
     * `undefined` means autodetect (by parsing the badge for the repo-url)
     * @property
     */
    greenkeeper: undefined
  }
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
    debug('creating customize config')
    const configFile = path.resolve('.thought', 'config.js')
    const config = fs.existsSync(configFile) ? require(configFile) : defaultConfig
    debug('config loaded', config)
    return customize
      .registerEngine('handlebars', require('customize-engine-handlebars'))
      .merge({
        handlebars: {
          partials: path.join(__dirname, 'handlebars', 'partials'),
          templates: path.join(__dirname, 'handlebars', 'templates'),
          helpers: require.resolve('./handlebars/helpers/index.js'),
          data: {
            'package': require(path.resolve(workingDir, 'package.json')),
            config: config,
            workingDir: workingDir
          },
          preprocessor: require('./handlebars/preprocessor.js'),
          hbsOptions: {
            noEscape: true
          }
        }
      })
      // Apply any customization from the config-files (such as loading modules)
      .load(function (customize) {
        debug('Loading modules', config)
        return config.plugins.reduce((prev, plugin) => {
          return prev.load(plugin)
        }, customize)
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
