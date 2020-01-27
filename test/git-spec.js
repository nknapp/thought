/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var Scenario = require('./lib/scenarios')
var thought = require('../')
var simpleGit = require('simple-git/promise')

var chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
var expect = chai.expect

describe('The "addToGit" option', function () {
  this.timeout(10000)
  it('should add the generated files to the git-index', function () {
    var scenario = new Scenario('simple-project').withTmpDir('test-output/addToGit')
    return scenario.prepareAndRun(() => {
      var git = simpleGit(scenario.actual)

      return git.init()
        .then(() => thought({ addToGit: true }))
        .then(() => git.status())
        // Check only which files have been added to the index
        .then((status) => {
          return status.files
            .filter(fileEntry => fileEntry.index === 'A')
            .map(fileEntry => fileEntry.path)
            .sort()
        })
        .then((files) => expect(files).to.deep.equal(['README.md']))
    })
  })
})
