var path = require('path')
var cp = require('child_process')
var _ = require('lodash')
var debug = require('debug')('thought:helpers')
var Promise = require('bluebird')
var glob = Promise.promisify(require('glob'))
var findPackage = require('find-package')
var Handlebars = require('handlebars')
var qfs = require('m-io/fs')
var util = require('util')
var Q = require('q')

module.exports = {

  /**
   * Display an object as indented JSON-String.
   * This is mainly for testing purposes when adapting templates
   * @param {object} obj the object
   * @returns {string} JSON.stringify()
   */
  json: function (obj) {
    return '```json\n' + JSON.stringify(obj, null, 2) + '\n```\n'
  },

  /**
   * Include a file into a markdown code-block
   * @param filename
   * @param language the programming language used for the code-block
   * @returns {string}
   */
  include: function (filename, language) {
    return qfs.read(filename).then(function (contents) {
      return '```' +
        (_.isString(language) ? language : path.extname(filename).substr(1)) +
        '\n' +
        contents +
        '\n```\n'
    })
  },

  /**
   * Directly include a file.
   * @param filename
   */
  includeRaw: function (filename) {
    return qfs.read(filename)
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
   * @param {object} options.hash
   * @param {boolean} options.hash.snippet If set to true, only the lines between
   *    &lt;snip> and &lt;/snip> will be included
   * @api public
   */
  example: function (filename, options) {
    return qfs.read(filename)
      .then(function (contents) {
        // Relative path to the current module (e.g. "../"). This path must be replaced
        // by the module name in the
        var modulePath = path.relative(path.dirname(filename), '.')
        debug('example modulepath', modulePath)
        var requireModuleRegex = new RegExp(regex`require\('${modulePath}/?(.*?)'\)`, 'g')
        if (options && options.hash && options.hash.snippet) {
          contents = contents.match(/---<snip>---.*\n([\S\s]*?)\n.*---<\/snip>---/)[1]
        }

        return util.format('```%s\n%s\n```',
          path.extname(filename).substr(1),
          contents.trim().replace(requireModuleRegex, function (match, suffix) {
            return `require('${require(process.cwd() + '/package').name}${suffix ? '/' + suffix : ''}')`
          })
        )
      })
  },

  /**
   * Return true if a file exists
   * @param {string} filename the path to the file
   * @return {boolean} true, if the file or diectory exists
   * @api public
   */
  exists: function (filename) {
    return qfs.exists(filename)
  },

  /**
   * Execute a command and include the output in a fenced code-block.
   *
   * @param {string} command the command, passed to `child-process#execSync()`
   * @param {object} options optional arguments and Handlebars internal args.
   * @param {string} options.hash.lang the language tag that should be attached to the fence
   *    (like `js` or `bash`). If this is set to `raw`, the output is included as-is, without fences.
   * @param {string} options.hash.cwd the current working directory of the example process
   * @returns {string} the output of `execSync`, enclosed in fences.
   * @api public
   */
  exec: function (command, options) {
    var start
    var end
    var lang = options.hash && options.hash.lang
    switch (lang) {
      case 'raw':
        start = end = ''
        break
      case 'inline':
        start = end = '`'
        break
      default:
        var fenceLanguage = _.isString(lang) ? lang : ''
        start = '```' + fenceLanguage + '\n'
        end = '\n```'
    }
    var output = cp.execSync(command, {
      encoding: 'utf8',
      cwd: options.hash && options.hash.cwd
    })
    return start + output.trim() + end
  },

  /**
   * Return a drawing of a directory tree (using [archy](https://www.npmjs.com/package/archy))
   * @param {string} globPattern a pattern describing all files and directories to include into the tree-view.
   * @param {string=} baseDir the base directory from which the `globPattern` is applied.
   * @returns {string} a display of the directory tree of the selected files and directories.
   * @api public
   */
  dirTree: function (baseDir, globPattern, options) {
    // Is basedir is not a string, it is probably the handlebars "options" object
    if (!_.isString(globPattern)) {
      globPattern = '**'
    }

    const label = options && options.data && options.data.label
    return glob(globPattern, {cwd: baseDir, mark: true})
      .then((files) => {
        debug('dirTree glob result', files)
        if (files.length === 0) {
          throw new Error('Cannot find a single file for \'' + globPattern + '\' in \'' + baseDir + '\'')
        }
        files.sort()
        // Split paths into components
        const pathComponents = files.map((file) => {
          // a/b/c  or a/b/dir/
          return file.split(path.sep)
          // a, b, c  or  a, b, dir, ''
            .map((component, index, all) => component + (index < all.length - 1 ? '/' : ''))
            // a/, b/, c  or  a/, b/, dir/, ''
            .filter(component => component) // Filter empty parts
        })
        const treeObject = treeFromPathComponents(pathComponents, label)
        const tree = require('archy')(treeObject)
        return '<pre><code>\n' + tree.trim() + '\n</code></pre>'
      })
  },

  /**
   * Render an object hierarchy of the form
   *
   * ```
   * {
   *   prop1: 'value',
   *   prop2: 'value',
   *   ...,
   *   children: [
   *     {
   *        prop1: 'value',
   *        propt2: 'value',
   *        ...,
   *        children: ...
   *     }
   *   ]
   * }
   * ```
   * @param object
   * @param options
   * @param {function} options.fn computes the label for a node based on the node itself
   * @returns {string}
   */
  renderTree: function (object, options) {
    var tree = require('archy')(transformTree(object, options.fn))
    return '<pre><code>\n' + tree + '</code></pre>'
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
    const data = Handlebars.createFrame(options.data)
    data.url = githubUrl(filePath)
    data.package = findPackage(path.resolve(filePath), false)
    return options.fn(this, {data: data})
  },

  github: function (filePath) {
    return githubUrl(filePath)
  },

  /**
   * Returns the path to the github repository (below github.com) based on the $.repository.url.
   * @param options
   * @returns {string=} the repository path within github.com (or null)
   */
  githubRepo: githubRepo,

  /**
   * Create a link to the npm-package of a package
   * @param packageName the name of the package
   */
  npm: function (packageName) {
    return '[' + packageName + '](https://npmjs.com/package/' + packageName + ')'
  },

  /**
   * This helper creates valid html-ids from header name. It attempts to
   * follow the same rules that github uses to convert header names (h1, h2) into the
   * hash-part of the URL referencing this header.
   *
   * ```js
   * htmlId('abc') === 'abc'
   * htmlId('abc cde') === 'abc-cde' // Replace spaces by '-'
   * htmlId('a$b&c%d') === 'abcd'  // Remove all characters execpt alpahnumericals and minus
   * htmlId('mäxchen' === 'mäxchen' // Do not remove german umlauts
   * htmlId('ハッピークリスマス') === 'ハッピークリスマス' // Do not remove japanase word characters
   * htmlId('ABCDE') === 'abcde'   // Convert to lowercase
   * ```
   */
  'htmlId': function (value) {
    // see http://stackoverflow.com/questions/19001140/amend-regular-expression-to-allow-german-umlauts-french-accents-and-other-valid
    // and https://github.com/mathiasbynens/unicode-data/blob/17a920119b8015c6f7fe922ee7ab9fe29bef4394/4.0.1/blocks/Katakana-regex.js
    // There are probably a lot of characters missing. Please make a PR, if you want to include more ranges in the valid characters.
    // Make sure to add a test-case
    var validChars = /[^A-Za-z0-9-_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u30A0-\u30FF]/g
    return value
      .replace(/ /g, '-')
      .replace(validChars, '')
      .toLowerCase()
  },

  /**
   * Check the .travis.yml and the appveyor.yml files for the string 'coveralls'
   * and return true if any of them exists and contains the string.
   * We expect coveralls to be configured then
   */
  'hasCoveralls': function hasCoveralls () {
    var travis = qfs.read('.travis.yml')
    var appveyor = qfs.read('appveyor.yml')
    return Q.allSettled([travis, appveyor]).then(function (files) {
      var i
      for (i = 0; i < files.length; i++) {
        if (files[i].state === 'fulfilled' && files[i].value.indexOf('coveralls') >= 0) {
          return true
        }
      }
      return false
    })
  },

  'hasGreenkeeper': function hasGreenkeeper (options) {
    var slug = githubRepo(options)
    return require('request-promise')(`https://badges.greenkeeper.io/${slug}.svg`)
      .then(function (response) {
        return require('cheerio')(response).find('text').last().text() !== 'not found'
      })
      .catch(function (err) {
        if (err.statusCode === 404) {
          return false
        }
        throw err
      })
  }

}

/**
 * Transform a tree-structure of the form
 * ```
 * {
 *   prop1: 'value',
 *   prop2: 'value',
 *   ...,
 *   children: [
 *     {
 *        prop1: 'value',
 *        propt2: 'value',
 *        ...,
 *        children: ...
 *     }
 *   ]
 * }
 * ```
 * Into an [archy](https://www.npmjs.com/package/archy)-compatible format, by passing each node to a block-helper function.
 * The result of the function should be a string which is then used as label for the node.
 *
 * @param {object} object the tree data
 * @param fn the block-helper function (options.fn) of Handlebars (http://handlebarsjs.com/block_helpers.html)
 */
function transformTree (object, fn) {
  var label = fn(object).trim()
  if (object.children) {
    return {
      label: label,
      nodes: object.children.map(function (child) {
        return transformTree(child, fn)
      })
    }
  } else {
    return label
  }
}

/**
 * Transform an array of path components into an [archy](https://www.npmjs.com/package/archy)-compatible tree structure.
 *
 * ```
 * [ [ 'abc', 'cde', 'efg' ], [ 'abc','cde','abc'], ['abc','zyx'] ]
 * ```
 *
 * becomes
 *
 * ```
 * {
 *   label: 'abc',
 *   nodes: [
        {
          label: 'cde',
          nodes: [
            'efg',
            'abc'
          ]
        },
        'zyx'
 *   ]
 * }
 * ```
 *
 * Nodes with a single subnode are collapsed and the resulting node gets the label `node/subnode`.
 *
 * @param {string[][]} files an array of filenames, split by `path.sep`
 * @param {string} label the label for the current tree node
 * @returns {object} a tree structure as needed by [archy](https://www.npmjs.com/package/archy)
 */
function treeFromPathComponents (files, label) {
  debug('treeFromPathComponents', files, label)
  if (files.length === 0) {
    return label
  }
  var result = {
    label: label,
    nodes: _(files)
      .groupBy('0')
      .map(function (group, key) {
        var values = group
          .map(function (item) {
            return item.slice(1)
          })
          .filter(function (item) {
            return item.length > 0
          })
        return treeFromPathComponents(values, key)
      }).value()
  }

  // Condense path if directory only has one entry
  if (result.nodes.length === 1 && _.isPlainObject(result.nodes[0])) {
    return {
      label: (result.label || '') + result.nodes[0].label,
      nodes: result.nodes[0].nodes
    }
  } else {
    return result
  }
}

function githubUrl (filePath) {
  // Build url to correct version and file in github
  var packageJson = findPackage(path.resolve(filePath), true)
  var url = packageJson && packageJson.repository && packageJson.repository.url
  if (url && url.match(/github.com/)) {
    var version = packageJson.version
    // path within the package
    var relativePath = path.relative(path.dirname(packageJson.paths.absolute), filePath)
    return url.replace(/^git\+/, '').replace(/\.git$/, '') + '/blob/v' + version + '/' + relativePath
  }
}

function githubRepo (options) {
  try {
    var url = options.data.root.package.repository.url
    var match = url.match(/.*?(:\/\/|@)github\.com[/:](.*?)(#.*?)?$/)
    if (match) {
      return match[2].replace(/\.git$/, '')
    } else {
      return null
    }
  } catch (e) {
    // No repositor-url exists
    return null
  }
}

function regex (strings, ...args) {
  return String.raw(strings, ...args.map(_.escapeRegExp))
}
