const path = require('path')

/**
 * Return a new instance of customize with merged configuration
 * @param {Customize} customize
 */
module.exports = function examplePlugin (customize) {
  return customize
  // Include thought-plugin-jsdoc whenever this plugin is used
    .load(require('thought-plugin-jsdoc'))
    .merge({
      handlebars: {
        helpers: {
          // Register a custom helper
          shout: (text) => String(text).toUpperCase()
        },
        // Register partials from the 'partials/'-directory of the plugin-module
        partials: path.resolve(__dirname, 'partials'),
        // Register templates from the 'partials/'-directory of the plugin-module
        templates: path.resolve(__dirname, 'templates'),
        // Register a preprocessor that modifies the package-data
        preprocessor: function (data) {
          return this.parent(data)
            .then(resolvedData => {
              resolvedData.package.description += ' (modified by example-plugin)'
              return resolvedData
            })
        }
      }
    })
}

module.exports.package = require('./package.json')
