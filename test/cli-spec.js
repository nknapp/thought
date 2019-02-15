/* eslint-env mocha */

const Scenario = require('./lib/scenarios')
const chai = require('chai')
const expect = chai.expect
const cli = require('../lib/cli.js')
const exec = require('../lib/utils/exeq')
const cpMock = require('./lib/child-process-mock')

describe('The cli script', function () {
  this.timeout(30000)
  const scenario = new Scenario('simple-project')
  const stackTraceLimit = Error.stackTraceLimit

  beforeEach(function () {
    // Make "npm install" faster by not really executing it
    cpMock.mockSpawn(
      (cmd) => cmd.match(/npm/),
      function (cmd, args, options) {
        setTimeout(() => this.emit('exit', 0), 10)
      }
    )
  })

  afterEach(() => {
    cpMock.clearMocks()
    Error.stackTraceLimit = stackTraceLimit
  })

  it('should report missing hooks in package.json', function () {
    return scenario.prepareAndRun(() => runMockThought('run'))
      .then(result => {
        expect(result.code).to.equal(0)
        expect(result.stdout).to.match(/Not registered in package.json yet/)
        expect(result.stderr).to.equal('')
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
      })
  })

  it('should run without errors with debugging enabled', function () {
    return scenario.prepareAndRun(() => runMockThought('-d', 'run'))
      .then(result => {
        expect(result.code).to.equal(0)
        expect(result.stderr).to.equal('')
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
      })
  })

  it('should check engines with no errors in a simple project', function () {
    return scenario.prepareAndRun(() => runMockThought('check-engines'))
      .then(result => {
        expect(result.stdout).to.equal('OK')
        expect(result.stderr).to.equal('')
        expect(result.code).to.equal(0)
      })
  })

  it('should fail the engine check if the npm-version does not match', function () {
    cpMock.mockExecFile(
      (cmd, args) => cmd.match(/npm/) && args && args[0] === '--version',
      function (cmd, args, options, callback) {
        callback(null, '2.0.0', '')
      }
    )
    return scenario.prepareAndRun(() => runMockThought('check-engines'))
      .then(result => {
        expect(result.code).to.equal(1)
        expect(result.stdout).to.equal('')
        expect(result.stderr).to.match(/will not execute the `version`-script/)
      })
  })

  it('should initialize npm scripts with the "init" command', function () {
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
          expect(result.stdout, 'Do not show warning about missing npm-scripts')
            .not.to.match(/Not registered in package\.json yet/)
          expect(result.stderr).to.equal('')
          expect(result.code, 'Exit code of first "thought run"').to.equal(0)
        })
        .then(() => {
          return runMockThought('init')
        })
        .then(result => {
          expect(result.stderr, 'Show errors if scripts are already there')
            .to.match(/I think scripts are already in your package.json/)
          expect(result.code, 'Exit code of first "thought init"').to.equal(1)
        })
    })
  })

  it('should perform the up-to-date check in a simple project', function () {
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
function runMockThought (...args) {
  return new Promise((resolve, reject) => {
    const argv = ['node', require.resolve('../bin/thought')].concat(args)
    const fakeConsole = {
      stdout: [],
      stderr: [],
      error: function (...message) {
        this.stderr.push(message.join(' '))
      },
      log: function (...message) {
        this.stdout.push(message.join(' '))
      }
    }
    delete require.cache[require.resolve('commander')]
    cli(argv, fakeConsole, (code) => {
      const stdout = fakeConsole.stdout.join('\n')
      const stderr = fakeConsole.stderr.join('\n')
      resolve({ code, stdout, stderr })
    })
  })
}
