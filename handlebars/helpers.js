var apidocs = require('multilang-apidocs')
var fs = require('fs')
var path = require('path')
var cp = require('child_process')
var _ = require('lodash')
var debug = require('debug')('thought:helpers')
var minimatch = require('minimatch')
var glob = require('glob')
var findPackage = require('find-package')
var Handlebars = require('handlebars')
var jsdox = require("jsdox");
var jsdocPath = require.resolve('jsdoc/jsdoc.js')

module.exports = {
  /**
   * Use JsDoc and JsDox to create markdown output of jsdoc-comments.
   * This only works for javascript-files
   * @param {string} globPattern a glob-pattern to find the files
   * @param {string} headerPrefix a string such as '##' that is use as prefix for lines starting with '#' to reduced the header-size
   */
  jsdoc: function (globPattern,headerPrefix) {
    var files = glob.sync(globPattern)
    var jsdocOutput = JSON.parse(cp.execFileSync(jsdocPath, ['-X'].concat(files), {encoding: 'utf-8'}))
    var analyzed = jsdox.analyze(jsdocOutput,{});
    return jsdox.generateMD(analyzed).replace(/^#/mg,headerPrefix + '#');
  },

  /**
   * Display an object as indented JSON-String.
   * This is mainly for testing purposes when adapting templates
   * @param {object} obj the object
   * @returns {string} JSON.stringify()
   */
  json: function(obj) {
    return "```json\n"+JSON.stringify(obj,null,2)+"\n```\n";
  },

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
      return comments.map(_.property('markdown')).join('\n')
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
   * Includes an example file into the template, replacing `require()` calls to the current
   * module by `require('module-name')` (only single-quotes are replaced)
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
   * @param {string} options.hash.lang the language tag that should be attached to the fence
   *    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences.
   * @param {string} options.hash.cwd the current working directory of the example process
   * @returns {string} the output of `execSync`, enclosed in fences.
   * @api public
   */
  exec: function (command, options) {
    var start = ''
    var end = ''
    if (options.hash.lang !== 'raw') {
      var fenceLanguage = _.isString(options.hash.lang) ? options.hash.lang : ''
      start = '```' + fenceLanguage + '\n'
      end = '\n```'
    }
    var output = cp.execSync(command, {
      encoding: 'utf8',
      cwd: options.hash.cwd
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
    var tree = createDirectoryTree(dirPath, [], glob ? minimatch.filter(glob) : _.constant(true))
    return '<pre><code>' + renderTree(tree, [], _.property('name')) + '</code></pre>'
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
  renderTree: function (object, options) {
    return '<pre><code>' + renderTree(object, [], options.fn) + '</code></pre>'
  },

  /**
   * Block helper that executes the block in the current context but sets to special variables:
   *
   * * The github-url of the given file in the current package version is stored into `@url`
   * * The `package.json` of the file's module is stored into `@package`
   * @param filePath file that is used to find that package.json
   * @param options block-helper options
   */
  withPackageOf: function (filePath, options) {
    var packageJson = findPackage(path.resolve(filePath), true)
    var url = packageJson && packageJson.repository && packageJson.repository.url
    var version = packageJson.version
    // path within the package
    var relativePath = path.relative(path.dirname(packageJson.paths.absolute), filePath)

    if (options.data) {
      data = Handlebars.createFrame(options.data || {})
      // Build url to correct version and file in github
      if (url && url.match(/github.com/)) {
        data.url = url.replace(/\.git$/, '') + '/blob/v' + version + '/' + relativePath
      }
      data['package'] = packageJson
    }
    return options.fn(this, { data: data})
  }
}

/**
 * @param object the rendered data
 * @param isLast an array of boolean values, showing whether the current element on each level is the last element in the list
 * @param fn the block-helper function (options.fn) of Handlebars (http://handlebarsjs.com/block_helpers.html)
 */
function renderTree (object, isLast, fn) {
  // Prefix for the first line of each node
  var prefix = isLast.map(function (isLastVal, index, array) {
    return index < array.length - 1
      // All but lowest level
      ? (isLastVal ? '    ' : '\u2502   ')
      // lowest level)
      : (isLastVal ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 ')
  }).join('')

  // Prefix for each additional line of each node (i.e. if the node contains `\n`)
  var additionalLinesPrefix = isLast.map(function (isLastVal) {
    return isLastVal ? '    ' : '\u2502   '
  }).join('')

  var trim = fn(object).trim()
  var node = trim.replace(/(\r\n?|\n)/g, '$1' + additionalLinesPrefix)
  if (!object.children || object.children.length === 0) {
    return prefix + node
  }
  return prefix + node + '\n' + object.children
      .map(function (entry, index, array) {
        return renderTree(
          entry,
          // Add the isLast-entry for the current level (if this is the last index in the current children-list
          isLast.concat([index >= array.length - 1]),
          fn
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
