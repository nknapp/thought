var qfs = require('m-io/fs')

/**
 * Remove "tmpDir", copy "scenario" recursively to "tmpDir",
 * chdir() to "tmpDir", execute "tester" and go back to the
 * previouse cwd.
 *
 * @param {string} scenario a directory containing the scenario (test-project)
 * @param {string} tmpDir the directory where the tests are executed
 * @param {function():Promise} tester a function executing the tests
 */
module.exports = function (scenario, tmpDir, tester) {
  var oldCwd = process.cwd()

  if (!tmpDir.match(/testOutput|actual/)) {
    throw new Error(`${tmpDir} must be inside testOutput or the 'actual' directory of a scenario.`)
    //  I don't want to risk deleting important files
  }

  return qfs.removeTree(tmpDir)
    .then(() => copy(scenario.input, scenario.actual))
    .then(() => process.chdir(scenario.actual))
    .then(() => tester())
    .then(() => process.chdir(oldCwd), (err) => {
      process.chdir(oldCwd)
      throw err
    })
}
