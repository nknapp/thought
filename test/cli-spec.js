/* eslint-env mocha */

const Scenario = require('./lib/scenarios')
const chai = require('chai')
const expect = chai.expect
const exec = require('../lib/utils/exeq')
const cp = require('child_process')

describe('The cli script', function() {
  this.timeout(30000)
  const scenario = new Scenario('simple-project')

  it('should report missing hooks in package.json', function() {
    return scenario
      .prepareAndRun(() => runMockThought('run'))
      .then(result => {
        expect(result.stderr).to.equal('')
        expect(result.stdout).to.match(/Not registered in package.json yet/)
        expect(result.code).to.equal(0)
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
      })
  })

  it('should run without errors with debugging enabled', function() {
    return scenario
      .prepareAndRun(() => runMockThought('-d', 'run'))
      .then(result => {
        expect(result.code).to.equal(0)
        expect(result.stderr).to.equal('')
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
      })
  })

  it('should initialize npm scripts with the "init" command', function() {
    return scenario.prepareAndRun(() => {
      return exec('git', ['init'])
        .then(() => exec('git', ['add', '-A']))
        .then(() => exec('git', ['commit', '-m', 'Initial checkin']))
        .then(() => runMockThought('init'))
        .then(result => {
          expect(result.stdout, 'Run without errors the first time').to.match(/running inside module 'simple-project'/)
          expect(result.stderr).to.equal('')
          expect(result.code, 'Exit code of first "thought init"').to.equal(0)
        })
        .then(() => runMockThought('run'))
        .then(result => {
          expect(result.stdout, 'Do not show warning about missing npm-scripts').not.to.match(
            /Not registered in package\.json yet/
          )
          expect(result.stderr).to.equal('')
          expect(result.code, 'Exit code of first "thought run"').to.equal(0)
        })
        .then(() => {
          return runMockThought('init')
        })
        .then(result => {
          expect(result.stderr, 'Show errors if scripts are already there').to.match(
            /I think scripts are already in your package.json/
          )
          expect(result.code, 'Exit code of first "thought init"').to.equal(1)
        })
    })
  })

  it('should perform the up-to-date check in a simple project', function() {
    return scenario.prepareAndRun(() =>
      runMockThought('up-to-date')
        .then(result => {
          expect(result.code).to.equal(1)
          expect(result.stdout).to.match(/running inside module 'simple-project'/)
          expect(result.stderr).to.match(/Source files have changed/)
        })
        .then(() => runMockThought('run'))
        .then(result => {
          expect(result.code).to.equal(0)
          expect(result.stdout).to.match(/running inside module 'simple-project'/)
          expect(result.stderr).to.equal('')
        })
        .then(() => runMockThought('up-to-date'))
        .then(result => {
          expect(result.code).to.equal(0)
          expect(result.stdout).to.match(/running inside module 'simple-project'/)
          expect(result.stderr).to.equal('')
        })
    )
  })
})

/**
 * Run thought as mock-process (in this process, but as if it was in its own process)
 * @param {...string} args the cli-arguments for thought
 * @returns {Promise}
 */
function runMockThought(...args) {
  return new Promise((resolve, reject) => {
    return cp.execFile(
      process.argv0,
      ['-r', require.resolve('./lib/mock-npm-commands'), require.resolve('../bin/thought')].concat(args),
      (error, stdout, stderr) => {
        const code = error ? error.code : 0
        resolve({ code, stderr, stdout })
      }
    )
  })
}
