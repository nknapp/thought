/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
// var path = require('path')
var qfs = require('m-io/fs')
// var _ = require('lodash')
var debug = require('debug')('thought:init')
var exec = require('./utils/exeq')
var thoughtPackageJson = require('../package.json')

module.exports = function () {
  var packageJson
  return qfs.read('package.json')
    .then(function (contents) {
      packageJson = JSON.parse(contents)
      if (packageJson.scripts && packageJson.scripts.thought) {
        throw new Error('I think scripts are already in your package.json (\'scripts.thought\' exists)')
      }
    })
    .then(function () {
      return checkPackageJsonInGit()
    })
    .then(function () {
      packageJson.scripts = packageJson.scripts || {}
      packageJson.scripts.thought = 'thought run -a'
      if (packageJson.scripts.version) {
        packageJson.scripts.version = 'npm run thought && ' + packageJson.scripts.version
      } else {
        packageJson.scripts.version = 'npm run thought'
      }
      packageJson.devDependencies.thought = `^${thoughtPackageJson.version}`
      return qfs.write('package.json', JSON.stringify(packageJson, null, 2))
    })
    .then(function () {
      return exec('npm', ['install', '--save-dev', 'thought'])
    })
    .then(function () {
      return exec('git', ['commit', 'package.json', '-m', '[Thought] Added scripts to run thought on version-bumps'])
    })
    .spread(function (stderr, stdout) {
      debug('git commit package.json...', 'stdout', stdout, 'stderr', stderr)
      // eslint-disable-next-line no-console
      console.log('\nI have committed a new package.json. Please verify the changes made to the file!')
    })
}

/**
 * Ensure that package.json is checked in and unmodified
 * @return {Promise<boolean>} true, if everything is fine
 */

function checkPackageJsonInGit () {
  return exec('git', ['status', '--porcelain', 'package.json'])
    .then(function ([stdout, stderr]) {
      debug('git status --porcelain package.json', 'stdout', stdout, 'stderr', stderr)
      if (stdout.indexOf('package.json') >= 0) {
        throw new Error('package.json has changes!\n' +
          'I would like to add scripts to your package.json, but ' +
          'there are changes that have not been commited yet.\n' +
          'I don\'t want to damage anything, so I\'m not doing anyhting right now. ' +
          'Please commit your package.json')
      }
    })
}
