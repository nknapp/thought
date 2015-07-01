var apidocs = require('multilang-apidocs')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var _ = require('lodash')
var debug = require('debug')('thought:helpers')
var minimatch = require('minimatch')

module.exports = {
  apidocs: function (filename) {
    var comments = apidocs(fs.readFileSync(filename, 'utf-8'), {
      filename: filename
    })
    // console.log(comments.filteredComments)
    return comments.join('\n')
  },

  /**
   * Include a file into a markdown code-block
   * @param filename
   * @param language the programming language used for the code-block
   * @returns {string}
   */
  include: function (filename, language) {
    return '```' +
      (_.isString(language) ? language : '') +
      '\n' +
      fs.readFileSync(filename, 'utf-8') +
      '\n```\n'
  },

  /**
   * Directly include a file.
   * @param filename
   */
  includeRaw: function (filename) {
    return fs.readFileSync(filename, 'utf-8')
  },

  /**
   * Includes an example file into the template, replacing
   * the `require('../')` by `require('module-name')` (only single-quotes are replaced)
   * @param filename
   */
  example: function (filename) {
    // Relative path to the current module (e.g. "../"). This path must be replaced
    // by the module name in the
    var modulePath = path.relative(path.dirname(filename), '.') + '/'
    debug('example modulepath', modulePath)

    var requireModuleRegex = _.escapeRegExp("require('" + modulePath + "')")

    return '```' + path.extname(filename).substr(1) + '\n' +
      fs.readFileSync(filename, 'utf-8')
        .replace(new RegExp(requireModuleRegex, 'g'), "require('" + this.package.name + "')")
        .trim() +
      '\n```'
  },

  exec: function (command, language) {
    var start = ''
    var end = ''
    if (language !== 'raw') {
      var fenceLanguage = _.isString(language) ? language : ''
      start = '```' + fenceLanguage + '\n'
      end = '\n```'
    }
    var output = cp.execSync(command, {
      encoding: 'utf8'
    })
    return start + output.trim() + end
  },

  /**
   * Return a drawing of a directory tree
   * @param dirPath the base directory
   * @param glob an optional glob-expression to filter the files included in the tree.
   * @returns {string}
   */
  dirtree: function (dirPath, glob) {
    debug('glob', glob)
    return '```\n' +
      createDirectoryTree(dirPath, [], glob ? minimatch.filter(glob) : _.constant(true)) +
      '\n```'
  }
}

/**
 *
 * @param somePath
 * @param state an array of boolean values, showing whether the current element on each level is the last element in the list
 * @returns {*}
 */
function createDirectoryTree (somePath, isLast, filter) {
  debug('filter', filter)
  var prefix = isLast.map(function (isLastVal, index, array) {
    return index < array.length - 1
      ? (isLastVal ? '    ' : '|   ')
      : (isLastVal ? '└── ' : '├── ')
  }).join('')

  var filelink = path.basename(somePath)

  if (fs.statSync(somePath).isFile()) {
    if (filter && !filter(somePath)) {
      debug('Omitting ' + somePath + ' based on glob')
      return ''
    }
    return prefix + filelink
  }
  return prefix + filelink + '/\n' + fs.readdirSync(somePath)
      .map(function (entry) {
        return path.join(somePath, entry)
      })
      .filter(filter)
      .map(function (entry, index, array) {
        return createDirectoryTree(
          entry,
          isLast.concat([index >= array.length - 1]),
          filter
        )
      }).join('\n')

}
