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
    .then(function (stdio) {
      if (semver.lt(stdio[0], '2.13.0')) {
        throw new Error('npm<2.13.0 will not execute the `version`-script in your package.json.\n' +
          'Please upgrade to at least 2.13.0.')
      } else {
        // eslint-disable-next-line no-console
        console.log('npm@' + stdio[0].trim() + ': OK')
      }
    })
}
