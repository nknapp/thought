/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var fs = require('fs')
var qfs = require('m-io/fs')
var deep = require('deep-aplus')(Promise)
var path = require('path')
var chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
var expect = chai.expect
var thought = require('../')
var Scenario = require('./lib/scenarios')

function listTreeRelative (baseDir, filter) {
  return qfs.listTree(baseDir, filter)
    .then((result) => {
      const relativeFiles = result.map((_path) => {
        return path.relative(baseDir, _path)
      })
      relativeFiles.sort()
      return relativeFiles
    })
}

/**
 * Travers all files and subdirs of a base directory and
 * call the callback for each of them
 * @param baseDir the base directory
 * @param relativeDir the current directory within the base directory (only for recursive calls)
 * @param visitor the callback / visitor
 */
function walk (baseDir, relativeDir, visitor) {
  var dirEntries = fs.readdirSync(path.join(baseDir, relativeDir))
  dirEntries.forEach(function (fileOrDir) {
    const relativePath = path.join(relativeDir, fileOrDir)
    const fullPath = path.join(baseDir, relativePath)
    var stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      walk(baseDir, relativePath, visitor)
    } else if (stats.isFile()) {
      visitor({ relativePath })
    }
  })
}

describe('the integration test: ', function () {
  this.timeout(10000)
  Scenario.all().forEach((scenario) => {
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

        it('the generated files in "actual" should be should match in "expected"', function () {
          var filter = (name, stats) => stats.isFile()
          var expected = listTreeRelative(scenario.expected, filter)
          var actual = listTreeRelative(scenario.actual, filter)
          return deep({ expected, actual })
            .then(function (result) {
              expect(result.actual).to.deep.equal(result.expected)
            })
        })

        walk(scenario.expected, '', function (file) {
          it(`the file "${file.relativePath}" should match`, function () {
            var expectedContents = scenario.readExpected(file.relativePath)
            var actualContents = scenario.readActual(file.relativePath)
            return deep({ expectedContents, actualContents })
              .then((result) => expect(result.actualContents).to.equal(result.expectedContents)
              )
          })
        })
      }
    })
  })
})
