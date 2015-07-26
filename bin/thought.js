#!/usr/bin/env node
/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/**
 * @thought-usage
 *
 * Run this program in your project root folder to generate the documentation.
 * It will run your package.json throught templates
 *
 */
'use strict'

var program = require('commander')
var thought = require('../')
var findPackage = require('find-package')
var path = require('path')

Error.stackTraceLimit = 0

program
  .version(require('../package').version)
  .option('-d, --debug', 'higher stack-trace-limit, long stack-traces', function (option) {
    Error.stackTraceLimit = 30
    require('trace')
    require('clarify')
  })

program
  .command('run')
  .option('-a, --add-to-git', 'git-add the modified files')
  .description('Generate documentation from your package.json and some templates.')
  .action(function (options) {
    changeDir()
    var packageJson = findPackage()
    if (!(packageJson.scripts && packageJson.scripts.thought)) {
      console.log('\nNot registered in package.json yet!\n' +
        'I can add a `scripts`-property to your package.json to ensure that ' +
        'documentation is generated automatically on version bumps.\n' +
        'If you want that, run `thought init`\n')
    }
    thought({
      addToGit: options.addToGit,
      debug: program.debug
    }).done(function (filenames) {
      console.log('The following files were updated: ' + filenames.join(', '))
    })
  })

program
  .command('init')
  .description("Register scripts in the curent module's package.json")
  .action(function () {
    changeDir()
    require('../lib/check-engines.js')()
      .then(require('../lib/init.js'))
      .done(function () {
        console.log('OK')
      })
  })

program
  .command('check-engines')
  .description('Check that all engines (such as npm) have versions that ensure Thought to run correctly')
  .action(function () {
    require('../lib/check-engines.js')()
      .done(function () {
        console.log('OK')
      })
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}

// ----------------------------------------
// chdir to local module root
// ----------------------------------------
function changeDir () {
  var packageJson = findPackage(process.cwd(), true)
  if (!packageJson) {
    throw new Error('package.json not found!\n' +
      'Please run me from within a node module.\n' +
      'My working directory is "' + process.cwd() + '".')
  }

  var moduleRoot = path.dirname(packageJson.paths.absolute)
  process.chdir(moduleRoot)
  console.log("I'm running inside module '" + packageJson.name + "' in '" + moduleRoot)
}
