var fs = require('fs')
var path = require('path')

var qfs = require('m-io/fs')
var copy = require('recursive-copy')

var basedir = path.resolve('test', 'fixtures', 'scenarios')

/**
 * Helpe for executing thought in different repos.
 */
class Scenario {
  constructor (name) {
    this.name = name
    this.expectFailure = name.lastIndexOf('failure-', 0) === 0
    this.input = path.join(basedir, name, 'input')
    this.expected = path.join(basedir, name, 'expected')
    this.actual = path.join(basedir, name, 'actual')
  }

  /**
   * Prepare setup of the scenario
   */
  prepare () {
    return qfs.removeTree(this.actual)
      .then(() => copy(this.input, this.actual))
      .then(() => this)
  }

  /**
   * Run the function in the "actual"-directory
   *
   * @param {():Promise} fn the tester function
   */
  run (fn) {
    var oldCwd = process.cwd()

    try {
      process.chdir(this.actual)
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error(this.actual + ' does not exist. Have you called ".prepare()"')
      }
    }
    return Promise.resolve()
      .then(() => fn())
      .then(
        (result) => {
          process.chdir(oldCwd)
          return result
        },
        (err) => {
          process.chdir(oldCwd)
          throw err
        }
      )
  }

  /**
   * Short hand for .prepare() and then .run()
   * @param {():Promise} fn the callback function
   * @returns {Promise}
   */
  prepareAndRun (fn) {
    return this.prepare().then(() => this.run(fn))
  }

  /**
   * Create a new instance of this scenario with a different "actual" directory
   * @param newTmpDir
   */
  withTmpDir (newTmpDir) {
    if (!newTmpDir.match(/test-output|actual/)) {
      throw new Error(`${newTmpDir} must be inside test-output or the 'actual' directory of a scenario.`)
      // because  I don't want to risk deleting important files
    }
    const result = new Scenario(this.name)
    result.actual = path.resolve(newTmpDir)
    return result
  }

  /**
   * Read a file from the "actual"-folder
   * @param {string} relativePath the path within the folder
   */
  readActual (relativePath) {
    return fs.readFileSync(path.join(this.actual, relativePath), 'utf-8')
  }

  /**
   * Read a file from the "expected"-folder
   * @param {string} relativePath the path within the folder
   */
  readExpected (relativePath) {
    return fs.readFileSync(path.join(this.expected, relativePath), 'utf-8')
  }
}

Scenario.all = function () {
  return fs.readdirSync(basedir).map((name) => {
    return new Scenario(name)
  })
}

module.exports = Scenario
