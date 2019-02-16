/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var Scenario = require('./lib/scenarios')
var cpMock = require('./lib/child-process-mock')
var init = require('../lib/init')
var bluebird = require('bluebird')
var simpleGit = require('simple-git')

var chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))

var fs = require('fs-extra')

var expect = chai.expect

describe('The "init" option', function () {
  this.timeout(30000)

  beforeEach(function () {
    // Make "npm install" faster by not really executing it
    cpMock.mockSpawn(
      (cmd) => cmd.match(/npm/),
      function (cmd, args, options) {
        setTimeout(() => this.emit('exit', 0), 10)
      }
    )
  })

  afterEach(() => cpMock.clearMocks())

  it('should add scripts and devDependency to package.json', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init1')
    return scenario.prepareAndRun(() => {
      var git = bluebird.promisifyAll(simpleGit(scenario.actual))

      return git.initAsync()
        .then(() => git.addAsync('package.json'))
        .then(() => git.commitAsync('Initial checkin'))
        .then(() => fs.writeFile('.gitignore', 'node_modules'))
        .then(() => init())
        .then(() => git.logAsync())
        // Check only which files have been added to the index
        .then(log => expect(log.latest.message, 'package.json must have been committed').to.match(/Added scripts to run thought on version-bumps/))
        .then(() => fs.readFile('package.json','utf-8'))
        .then(pkgJson => expect(JSON.parse(pkgJson), 'Checking package.json').to.deep.equals({
          'author': '',
          'description': 'A simple description',
          'devDependencies': {
            'fs-walker': '^1.0.0',
            'thought': '^' + require('../package.json').version
          },
          'license': 'ISC',
          'main': 'index.js',
          'name': 'simple-project',
          'repository': {
            'type': 'git',
            'url': 'https://github.com/unit-test/simple-project.git'
          },
          'scripts': {
            'test': 'echo "Error: no test specified" && exit 1',
            'thought': 'thought run -a',
            'version': 'npm run thought'
          },
          'version': '1.0.0'
        }))
        .then(() => expect(fs.existsSync('node_modules/thought'), 'Thought dependency must be installed').to.be.true())
    })
  })

  it('should add scripts and devDependency to package.json (even if no scripts-property exists', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init1')
    return scenario.prepareAndRun(() => {
      var git = bluebird.promisifyAll(simpleGit(scenario.actual))

      return git.initAsync()
        .then(() => fs.readFile('package.json','utf-8'))
        .then(JSON.parse)
        .then((pkgJson) => {
          delete pkgJson.scripts
          return fs.writeFile('package.json', JSON.stringify(pkgJson))
        })
        .then(() => git.addAsync('package.json'))
        .then(() => git.commitAsync('Initial checkin'))
        .then(() => fs.writeFile('.gitignore', 'node_modules'))
        .then(() => init())
        .then(() => git.logAsync())
        // Check only which files have been added to the index
        .then(log => expect(log.latest.message, 'package.json must have been committed').to.match(/Added scripts to run thought on version-bumps/))
        .then(() => fs.readFile('package.json','utf-8'))
        .then(pkgJson => expect(JSON.parse(pkgJson), 'Checking package.json').to.deep.equals({
          'author': '',
          'description': 'A simple description',
          'devDependencies': {
            'fs-walker': '^1.0.0',
            'thought': '^' + require('../package.json').version
          },
          'license': 'ISC',
          'main': 'index.js',
          'name': 'simple-project',
          'repository': {
            'type': 'git',
            'url': 'https://github.com/unit-test/simple-project.git'
          },
          'scripts': {
            'thought': 'thought run -a',
            'version': 'npm run thought'
          },
          'version': '1.0.0'
        }))
        .then(() => expect(fs.existsSync('node_modules/thought'), 'Thought dependency must be installed').to.be.ok())
    })
  })

  it('should throw an exception, if the package.json-file has uncommitted changes', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      var git = bluebird.promisifyAll(simpleGit(scenario.actual))
      return git.initAsync()
        .then(() => expect(init()).to.be.rejectedWith(/package.json has changes/))
    })
  })

  it('should throw an exception, if Thought is already registered in a script', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      var git = bluebird.promisifyAll(simpleGit(scenario.actual))

      return git.initAsync()
        .then(() => fs.readFile('package.json','utf-8'))

        .then(JSON.parse)
        .then((pkgJson) => {
          pkgJson.scripts.thought = 'thought run -a'
          return fs.writeFile('package.json', JSON.stringify(pkgJson))
        })
        .then(() => git.addAsync('package.json'))
        .then(() => git.commitAsync('Initial checkin'))
        .then(() => expect(init()).to.be.rejectedWith(/scripts are already in your package.json/))
    })
  })

  it('should prepend the version script, if it already exists', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      var git = bluebird.promisifyAll(simpleGit(scenario.actual))

      return git.initAsync()
        .then(() => fs.readFile('package.json','utf-8'))

        .then(JSON.parse)
        .then((pkgJson) => {
          pkgJson.scripts.version = 'run something'
          return fs.writeFile('package.json', JSON.stringify(pkgJson))
        })
        .then(() => git.addAsync('package.json'))
        .then(() => git.commitAsync('Initial checkin'))
        .then(() => init())
        .then(() => fs.readFile('package.json','utf-8'))
        .then(JSON.parse)
        .then((pkgJson) => expect(pkgJson.scripts.version).to.equal('npm run thought && run something'))
    })
  })
})
