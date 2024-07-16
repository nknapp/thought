module.exports = function (customize) {
  return (
    customize
      // jsdoc-support
      .load(require('thought-plugin-jsdoc'))
      // include open-open-source disclaimer in CONTRIBUTING.md
      .load(require('thought-plugin-open-open-source'))
      // include standardjs-disclaimer in CONTRIBUTING.md
      .load(require('thought-plugin-standardjs'))
  )
}
