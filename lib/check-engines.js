/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var exec = require('./utils/exeq')
var semver = require('semver')

module.exports = function () {
  return exec('npm', ['--version'])
    .spread(function (stdout, stderr) {
      if (semver.lt(stdout.trim(), '2.13.0')) {
        throw new Error('npm<2.13.0 will not execute the `version`-script in your package.json.\n' +
          'Please upgrade to at least 2.13.0.')
      } else {
        console.log('npm@' + stdout.trim() + ': OK')
      }
    })
}
