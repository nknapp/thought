const path = require('path')

module.exports = function plugin (customize) {
  return customize.merge({
    handlebars: {
      partials: path.resolve(__dirname, 'partials'),
      templates: path.resolve(__dirname, 'templates'),
      helpers: {
        npm: function (name) {
          return `[${name.toUpperCase()}](https://npmjs.com/package/${name})`
        }
      }
    }
  })
}
