/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const Scenario = require('./lib/scenarios')
const cpMock = require('./lib/child-process-mock')
const init = require('../lib/init')
const simpleGit = require('simple-git/promise')

const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))

const fs = require('fs-extra')

const expect = chai.expect

describe('The init option', function() {
  let npmInstallMockCalls
  this.timeout(30000)

  beforeEach(function() {
    npmInstallMockCalls = []
    // Make "npm install" faster by not really executing it
    cpMock.mockSpawn(
      cmd => cmd.match(/npm/),
      function(cmd, args, options) {
        npmInstallMockCalls.push({ cmd, args, options })
        setTimeout(() => this.emit('exit', 0), 10)
      }
    )
  })

  afterEach(() => cpMock.clearMocks())

  it('should add scripts and devDependency to package.json', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init1')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)

      return (
        git
          .init()
          .then(() => git.add('package.json'))
          .then(() => git.commit('Initial checkin'))
          .then(() => fs.writeFile('.gitignore', 'node_modules'))
          .then(() => init())
          .then(() => git.log())
          // Check only which files have been added to the index
          .then(log =>
            expect(log.latest.message, 'package.json must have been committed').to.match(
              /Added scripts to run thought on version-bumps/
            )
          )
          .then(() => fs.readFile('package.json', 'utf-8'))
          .then(pkgJson =>
            expect(JSON.parse(pkgJson), 'Checking package.json').to.deep.equals({
              author: '',
              description: 'A simple description',
              devDependencies: {
                'fs-walker': '^1.0.0',
                thought: '^' + require('../package.json').version
              },
              license: 'ISC',
              main: 'index.js',
              name: 'simple-project',
              repository: {
                type: 'git',
                url: 'https://github.com/unit-test/simple-project.git'
              },
              scripts: {
                test: 'echo "Error: no test specified" && exit 1',
                thought: 'thought run -a',
                version: 'npm run thought'
              },
              version: '1.0.0'
            })
          )
          .then(() => {
            expect(npmInstallMockCalls).to.deep.equal([
              {
                cmd: 'npm',
                args: ['install', '--save-dev', 'thought'],
                options: { stdio: 'inherit' }
              }
            ])
          })
      )
    })
  })

  it('should add scripts and devDependency to package.json (even if no scripts-property exists', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init1')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)

      return (
        git
          .init()
          .then(() => fs.readFile('package.json', 'utf-8'))
          .then(JSON.parse)
          .then(pkgJson => {
            delete pkgJson.scripts
            return fs.writeFile('package.json', JSON.stringify(pkgJson))
          })
          .then(() => git.add('package.json'))
          .then(() => git.commit('Initial checkin'))
          .then(() => fs.writeFile('.gitignore', 'node_modules'))
          .then(() => init())
          .then(() => git.log())
          // Check only which files have been added to the index
          .then(log =>
            expect(log.latest.message, 'package.json must have been committed').to.match(
              /Added scripts to run thought on version-bumps/
            )
          )
          .then(() => fs.readFile('package.json', 'utf-8'))
          .then(pkgJson =>
            expect(JSON.parse(pkgJson), 'Checking package.json').to.deep.equals({
              author: '',
              description: 'A simple description',
              devDependencies: {
                'fs-walker': '^1.0.0',
                thought: '^' + require('../package.json').version
              },
              license: 'ISC',
              main: 'index.js',
              name: 'simple-project',
              repository: {
                type: 'git',
                url: 'https://github.com/unit-test/simple-project.git'
              },
              scripts: {
                thought: 'thought run -a',
                version: 'npm run thought'
              },
              version: '1.0.0'
            })
          )
          .then(() => {
            expect(npmInstallMockCalls).to.deep.equal([
              {
                cmd: 'npm',
                args: ['install', '--save-dev', 'thought'],
                options: { stdio: 'inherit' }
              }
            ])
          })
      )
    })
  })

  it('should throw an exception, if the package.json-file has uncommitted changes', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)
      return git.init().then(() => expect(init()).to.be.rejectedWith(/package.json has changes/))
    })
  })

  it('should throw an exception, if Thought is already registered in a script', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)

      return git
        .init()
        .then(() => fs.readFile('package.json', 'utf-8'))

        .then(JSON.parse)
        .then(pkgJson => {
          pkgJson.scripts.thought = 'thought run -a'
          return fs.writeFile('package.json', JSON.stringify(pkgJson))
        })
        .then(() => git.add('package.json'))
        .then(() => git.commit('Initial checkin'))
        .then(() => expect(init()).to.be.rejectedWith(/scripts are already in your package.json/))
    })
  })

  it('should prepend the version script, if it already exists', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/thought-init2')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)

      return git
        .init()
        .then(() => fs.readFile('package.json', 'utf-8'))

        .then(JSON.parse)
        .then(pkgJson => {
          pkgJson.scripts.version = 'run something'
          return fs.writeFile('package.json', JSON.stringify(pkgJson))
        })
        .then(() => git.add('package.json'))
        .then(() => git.commit('Initial checkin'))
        .then(() => init())
        .then(() => fs.readFile('package.json', 'utf-8'))
        .then(JSON.parse)
        .then(pkgJson => expect(pkgJson.scripts.version).to.equal('npm run thought && run something'))
    })
  })
})
