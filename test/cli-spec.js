/* eslint-env mocha */

const Scenario = require('./lib/scenarios')
const chai = require('chai')
const expect = chai.expect
const exec = require('../lib/utils/exeq')
const cp = require('child_process')

const fs = require('fs-extra')
const path = require('path')
const { osIndependentPath } = require('./lib/osIndependentPath')

describe('The cli script', function () {
  this.timeout(30000)
  const scenario = new Scenario('simple-project')

  it('should report missing hooks in package.json', function () {
    return scenario
      .prepareAndRun(() => runMockThought('run'))
      .then(result => {
        expect(result.stderr).to.equal('')
        expect(result.stdout).to.match(/Not registered in package.json yet/)
        expect(result.code).to.equal(0)
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
      })
  })

  it('should run without errors with debugging enabled', function () {
    return scenario
      .prepareAndRun(() => runMockThought('-d', 'run'))
      .then(result => {
        expect(result.code).to.equal(0)
        expect(result.stderr).to.equal('')
        expect(scenario.readActual('README.md')).to.equal(scenario.readExpected('README.md'))
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

  describe('the "eject" command', () => {
    const ejectScenario = new Scenario('with-partial-and-template')

    it('should show a list of ejectable files if no parameter is provided', async function () {
      await ejectScenario.prepareAndRun(() =>
        runMockThought('eject').then(result => {
          expect(result.code).to.equal(0)
          expect(result.stdout).to.match(/partial howitworks\.md\.hbs/)
          expect(result.stdout).to.match(/template README\.md\.hbs/)
          expect(result.stdout).not.to.match(/usage\.md\.hbs/)

          expect(result.stderr).to.equal('')
        })
      )
    })

    it('should show only ejectable templates, if the prefix is "template"', async function () {
      await ejectScenario.prepareAndRun(() =>
        runMockThought('eject', 'template').then(result => {
          expect(result.code).to.equal(0)
          expect(result.stdout).not.to.match(/partial howitworks\.md\.hbs/)
          expect(result.stdout).to.match(/template README\.md\.hbs/)
          expect(result.stderr).to.equal('')
        })
      )
    })

    it('should show only ejectable partials, if the prefix is "partials"', async function () {
      await ejectScenario.prepareAndRun(() =>
        runMockThought('eject', 'partial').then(result => {
          expect(result.code).to.equal(0)
          expect(result.stdout).to.match(/partial howitworks\.md\.hbs/)
          expect(result.stdout).not.to.match(/template README\.md\.hbs/)
          expect(result.stderr).to.equal('')
        })
      )
    })

    it('should eject a partial if a filename is specified and the prefix is "partial"', async function () {
      await ejectScenario.prepareAndRun(async () => {
        const result = await runMockThought('eject', 'partial', 'howitworks.md.hbs')

        expect(result.code).to.equal(0)
        expect(result.stdout).to.match(/Ejecting "\.thought.partials.howitworks\.md\.hbs"/)

        const ejectedPath = path.join('.thought', 'partials', 'howitworks.md.hbs')
        const ejectedFileContents = await ejectScenario.readActual(ejectedPath)

        const defaultPath = require.resolve('../handlebars/partials/howitworks.md.hbs')
        const defaultFileContents = await fs.readFile(defaultPath, 'utf-8')

        expect(ejectedFileContents).to.equal(defaultFileContents)
      })
    })

    it('should eject a template if a filename is specified and the prefix is "template"', async function () {
      await ejectScenario.prepareAndRun(async () => {
        const result = await runMockThought('eject', 'template', 'README.md.hbs')

        expect(result.code).to.equal(0)
        expect(result.stdout).to.match(/Ejecting "\.thought.templates.README\.md\.hbs"/)
        expect(result.stderr).to.equal('')

        const ejectedPath = path.join('.thought', 'templates', 'README.md.hbs')
        const ejectedFileContents = await ejectScenario.readActual(ejectedPath)

        const defaultPath = require.resolve('../handlebars/templates/README.md.hbs')
        const defaultFileContents = await fs.readFile(defaultPath, 'utf-8')

        expect(ejectedFileContents).to.equal(defaultFileContents)
      })
    })

    it('should give sensible error messages', async function () {
      await ejectScenario.prepareAndRun(async () => {
        await expectError({ args: ['eject', 'temp'], errorMessage: 'Unknown prefix "temp", try without prefix!' })

        await expectError({
          args: ['eject', 'template', 'RED.md.hbs'],
          errorMessage: 'There is no template "RED.md.hbs"!'
        })
        await expectError({
          args: ['eject', 'template', 'anotherFile.md.hbs'],
          errorMessage: osIndependentPath(
            `File ".thought/templates/anotherFile.md.hbs" already exists in this project!`
          )
        })

        await expectError({
          args: ['eject', 'partial', 'RED.md.hbs'],
          errorMessage: 'There is no partial "RED.md.hbs"!'
        })
        await expectError({
          args: ['eject', 'partial', 'usage.md.hbs'],
          errorMessage: osIndependentPath(`File ".thought/partials/usage.md.hbs" already exists in this project!`)
        })
      })
    })

    async function expectError({ args, errorMessage }) {
      const result = await runMockThought(...args)
      expect(result.stderr).to.contain(errorMessage)
      expect(result.code).to.equal(1)
    }
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
