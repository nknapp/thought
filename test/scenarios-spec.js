/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const fs = require('fs-extra')
const pify = require('pify')
const glob = pify(require('glob'))
const deep = require('deep-aplus')(Promise)
const path = require('path')
const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const thought = require('../')
const Scenario = require('./lib/scenarios')

/**
 * Travers all files and subdirs of a base directory and
 * call the callback for each of them
 * @param baseDir the base directory
 * @param relativeDir the current directory within the base directory (only for recursive calls)
 * @param visitor the callback / visitor
 */
function walk(baseDir, relativeDir, visitor) {
  const dirEntries = fs.readdirSync(path.join(baseDir, relativeDir))
  dirEntries.forEach(function (fileOrDir) {
    const relativePath = path.join(relativeDir, fileOrDir)
    const fullPath = path.join(baseDir, relativePath)
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      walk(baseDir, relativePath, visitor)
    } else if (stats.isFile()) {
      visitor({ relativePath })
    }
  })
}

describe('the integration test: ', function () {
  this.timeout(10000)

  beforeEach(() => {
    Error.stackTraceLimit = 10
  })

  Scenario.all().forEach(scenario => {
    describe(`In the scenario "${scenario.name}",`, function () {
      if (scenario.expectFailure) {
        it('running Thought should produce an error', function () {
          // This scenario must be rejected
          return expect(scenario.run(() => thought())).to.be.rejected
        })
      } else {
        // This scenario must pass
        before(function () {
          return scenario.prepareAndRun(() => thought())
        })

        it('the generated files in "actual" should be should match in "expected"', async function () {
          const [expected, actual] = await Promise.all([
            glob('**/*', { root: scenario.expected, nodir: true, dot: true }),
            glob('**/*', { root: scenario.actual, nodir: true, dot: true })
          ])
          expect(actual).to.deep.equal(expected)
        })

        walk(scenario.expected, '', function (file) {
          it(`the file "${file.relativePath}" should match`, function () {
            const expectedContents = scenario.readExpected(file.relativePath)
            const actualContents = scenario.readActual(file.relativePath)
            return deep({ expectedContents, actualContents }).then(result =>
              expect(result.actualContents).to.equal(result.expectedContents)
            )
          })
        })
      }
    })
  })
})
