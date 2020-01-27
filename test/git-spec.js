/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const Scenario = require('./lib/scenarios')
const thought = require('../')
const simpleGit = require('simple-git/promise')

const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
const expect = chai.expect

describe('The "addToGit" option', function() {
  this.timeout(10000)
  it('should add the generated files to the git-index', function() {
    const scenario = new Scenario('simple-project').withTmpDir('test-output/addToGit')
    return scenario.prepareAndRun(() => {
      const git = simpleGit(scenario.actual)

      return (
        git
          .init()
          .then(() => thought({ addToGit: true }))
          .then(() => git.status())
          // Check only which files have been added to the index
          .then(status => {
            return status.files
              .filter(fileEntry => fileEntry.index === 'A')
              .map(fileEntry => fileEntry.path)
              .sort()
          })
          .then(files => expect(files).to.deep.equal(['README.md']))
      )
    })
  })
})
