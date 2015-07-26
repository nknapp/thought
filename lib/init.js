/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var path = require('path')
var qfs = require('q-io/fs')
// var _ = require('lodash')
var debug = require('debug')('thought:init')
var exec = require('./utils/exeq')

module.exports = function () {
  var packageJson = require(path.resolve('package.json'))
  if (packageJson.scripts && packageJson.scripts.thought) {
    console.log("I think scripts are already in your package.json ('scripts.thought' exists)")
    return
  }

  return checkPackageJsonInGit()
    .then(function () {
      packageJson.scripts = packageJson.scripts || {}
      packageJson.scripts.thought = 'thought run -a'
      packageJson.scripts.prethoughtcheck = 'npm list --depth=0 -g thought || npm -g install thought'
      packageJson.scripts.thoughtcheck = 'thought check-engines'
      if (packageJson.scripts.version) {
        packageJson.scripts.version = 'npm run thought && ' + packageJson.scripts.version
      } else {
        packageJson.scripts.version = 'npm run thought'
      }

      if (packageJson.scripts.preversion) {
        packageJson.scripts.preversion = 'npm run thoughtcheck && ' + packageJson.scripts.preversion
      } else {
        packageJson.scripts.preversion = 'npm run thoughtcheck'
      }

      return qfs.write('package.json', JSON.stringify(packageJson, null, 2))
    })
    .then(function () {
      return exec('git', ['commit', 'package.json', '-m', '[Thought] Added scripts to run thought on version-bumps'])
    })
    .spread(function (stderr, stdout) {
      debug('git commit package.json...', 'stdout', stdout, 'stderr', stderr)
      console.log('\nI have committed a new package.json. Please verify the changes made to the file!')
    })
}

/**
 * Ensure that package.json is checked in and unmodified
 * @return {Promise<boolean} true, if everything is fine
 */

function checkPackageJsonInGit () {
  return exec('git', ['status', '--porcelain', 'package.json'])
    .spread(function (stdout, stderr) {
      debug('git status --porcelain package.json', 'stdout', stdout, 'stderr', stderr)
      if (stdout.indexOf('package.json') >= 0) {
        throw new Error('package.json has changes!\n' +
          'I would like to add scripts to your package.json, but ' +
          'there are changes that have not been commited yet.\n' +
          "I don't want to damage anything, so I'm not doing anyhting right now. " +
          'Please commit your package.json')
      }
    })
}
