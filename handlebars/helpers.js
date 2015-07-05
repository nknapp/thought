var apidocs = require('multilang-apidocs')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var _ = require('lodash')
var debug = require('debug')('thought:helpers')
var minimatch = require('minimatch')
var glob = require('glob')

module.exports = {
  /**
   * Include the apidocs from a file. The `multilang-apidocs` package
   * is used to extract the comments from the file.
   * @param {string} a glob-pattern to find the files to analyze
   * @returns {string}
   */
  apidocs: function (globPattern) {
    var files = glob.sync(globPattern)
    debug('apidoc files', files)
    return files.map(function (file) {
      var comments = apidocs(fs.readFileSync(file, 'utf-8'), {
        filename: file
      })
      debug('extracted comments', comments)
      return comments.join('\n')
    }).join('\n')
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
   * Includes an example file into the template, replacing `require()` calls to the current module
   * by `require('module-name')` (only single-quotes are replaced)
   * If your file is `examples/example.js`, you would do
   * ```js
   * var fn = require('../')
   * ```
   * to load your module. That way, you get an executable script.
   * The helper will when include
   * ```js
   * var fn = require('module-name')
   * ```
   * in your docs, which is what a user of the module will do.
   *
   * @param {string} filename the name of the example file
   * @api public
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

  /**
   * Return true if a file exists
   * @param {string} filename the path to the file
   * @return {boolean} true, if the file or diectory exists
   * @api public
   */
  exists: function (filename) {
    return fs.existsSync(filename)
  },

  /**
   * Execute a commad and include the output in a fenced code-block.
   * @param {string} command the command, passed to `child-process#execSync()`
   * @param {string} language the language tag that should be attached to the fence
   *    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences.
   * @returns {string} the output of `execSync`, enclosed in fences.
   * @api public
   */
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
   * @api public
   */
  dirtree: function (dirPath, glob) {
    debug('glob', glob)
    return '```\n' +
      renderTree(createDirectoryTree(dirPath, [], glob ? minimatch.filter(glob) : _.constant(true)), []) +
      '\n```'
  },

  /**
   * Renders a object hierarchy like
   *
   * ```js
   * {
   *    name: 'example-project/',
   *    children: [
   *      {
   *        name: 'LICENSE.md'
   *      },
   *      {
   *        name: 'examples/',
   *        children: [
   *          {
   *            name: 'example.js'
   *          },
   *        ]
   *      },
   *      {
   *        name: 'index.js'
   *      },
   *      {
   *        name: 'package.json'
   *      }
   *    ]
   * }
   * ```
   *
   * into
   *
   * ```
   * example-project/
   * ├── LICENSE.md
   * ├── examples/
   * │   └── example.js
   * ├── index.js
   * └── package.json
   * ```
   *
   * @param object
   */
  renderTree: function (object) {
    return renderTree(object,[]);
  }
}

/**
 * @param object the rendered data
 * @param isLast an array of boolean values, showing whether the current element on each level is the last element in the list
 */
function renderTree (object, isLast) {
  var prefix = isLast.map(function (isLastVal, index, array) {
    return index < array.length - 1
      ? (isLastVal ? '    ' : '\u2502   ')
      : (isLastVal ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ')
  }).join('')

  if (!object.children || object.children.length === 0) {
    return prefix + object.name
  }
  return prefix + object.name + '\n' + object.children
      .map(function (entry, index, array) {
        return renderTree(
          entry,
          // Add the isLast-entry for the current level (if this is the last index in the current children-list
          isLast.concat([index >= array.length - 1])
        )
      }).join('\n')
}

/**
 *
 * @param somePath the root-directory of the tree
 * @param isLast an array of boolean values, showing whether the current element on each level is the last element in the list
 * @param filter a function that returns true for each file that should be displayed
 * @returns an object structure compatible with `renderTree` representing the file tree
 */
function createDirectoryTree (somePath, isLast, filter) {
  debug('filter', filter)

  var filelink = path.basename(somePath)

  if (fs.statSync(somePath).isFile()) {
    if (filter && !filter(somePath)) {
      debug('Omitting ' + somePath + ' based on glob')
      return ''
    }
    return {name: filelink}
  }
  return {
    name: filelink + '/',
    children: fs.readdirSync(somePath)
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
      })
  }

}
