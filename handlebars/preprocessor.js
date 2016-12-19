var qfs = require('m-io/fs')
var _ = require('lodash')
var path = require('path')
// var Q = require('q')
var deep = require('q-deep')
var debug = require('debug')('thought:preprocessor')

/**
 * This function modifies the Handlebars input data prior to
 * executing the template.
 * @param {object} data the data object of the configuration
 * @returns {*}
 */
module.exports = function (data) {
  data = _.cloneDeep(data)
  var exampleDir = data.package.directories && data.package.directories.example
  if (exampleDir) {
    // Resolve
    data.directories = qfs.list(exampleDir)
      .then(function (list) {
        return list.map(function (filename) {
          return {
            path: path.join(exampleDir, filename),
            filename: filename
          }
        })
      })
  }

  // Detect license file and read contents
  debug('workingdir', data.workingDir)
  data.licenseFile = qfs.list(data.workingDir)
    .then(function (files) {
      debug('project files', files)
      var licenseFiles = files.filter(function (filename) {
        return filename.lastIndexOf('LICENSE', 0) === 0
      })
      if (licenseFiles.length > 0) {
        return {
          filename: licenseFiles[0],
          contents: qfs.read(path.join(data.workingDir, licenseFiles[0])),
          fences: path.extname(licenseFiles[0]) !== '.md'
        }
      }
      return null
    })

  return deep(data).tap(debug)
}
