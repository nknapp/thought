/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
/* global before */
// /* global xdescribe */
// /* global xit */

'use strict'

var fs = require('fs')
var qfs = require('m-io/fs')
var deep = require('deep-aplus')(Promise)
var copy = require('recursive-copy')

var path = require('path')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
var thought = require('../')

var basedir = path.resolve('test', 'fixtures', 'scenarios')
var scenarios = fs.readdirSync(basedir).map((name) => {
  return {
    name: name,
    input: path.join(basedir, name, 'input'),
    expected: path.join(basedir, name, 'expected'),
    actual: path.join(basedir, name, 'actual'),
    readExpected: function readExpected (relativePath) {
      return qfs.read(path.join(this.expected, relativePath))
    },
    readActual: function readActual (relativePath) {
      return qfs.read(path.join(this.actual, relativePath))
    }
  }
})

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

function walk (baseDir, relativeDir, callback) {
  var dirEntries = fs.readdirSync(path.join(baseDir, relativeDir))
  dirEntries.forEach(function (fileOrDir) {
    const relativePath = path.join(relativeDir, fileOrDir)
    const fullPath = path.join(baseDir, relativePath)
    var stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      walk(baseDir, relativePath, callback)
    } else if (stats.isFile()) {
      callback({ relativePath })
    }
  })
}

describe('the integation test: ', function () {
  this.timeout(10000)
  scenarios.forEach((scenario) => {
    describe(`In the scenario name "${scenario.name}",`, function () {
      before(function () {
        return qfs.removeTree(scenario.actual)
          .then(() => copy(scenario.input, scenario.actual))
          .then(() => thought({ cwd: scenario.actual }))
      })

      it('should have the same files as in the output', function () {
        var filter = (name, stats) => stats.isFile()
        var expected = listTreeRelative(scenario.expected, filter)
        var actual = listTreeRelative(scenario.actual, filter)
        return deep({ expected, actual })
          .then(function (result) {
            console.log(result)
            expect(result.actual).to.deep.equal(result.expected)
          })
      })

      walk(scenario.expected, '', function (file) {
        it(`the file "${file.relativePath}" should match`, function () {
          var expectedContents = scenario.readExpected(file.relativePath)
          var actualContents = scenario.readActual(file.relativePath)
          return deep({expectedContents, actualContents})
            .then((result) => expect(result.actualContents).to.equal(result.expectedContents)
            )
        })
      })
    })
  })
})

