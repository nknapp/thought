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
    expectFailure: name.lastIndexOf('failure-', 0) === 0,
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

/**
 * Travers all files and subdirs of a base directory and
 * call the callback for each of them
 * @param baseDir the base directory
 * @param relativeDir the current directory within the base directory (only for recursive calls)
 * @param callback the callback / visitor
 */
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
    describe(`In the scenario "${scenario.name}",`, function () {
      var oldCwd = process.cwd()

      before(function () {
        return qfs.removeTree(scenario.actual)
          .then(() => copy(scenario.input, scenario.actual))
          .then(() => process.chdir(scenario.actual))
      })

      after(function () {
        process.chdir(oldCwd)
      })

      if (scenario.expectFailure) {
        it('running Thought should produce an error', function () {
          // This scenario must be rejected
          return expect(thought()).to.be.rejected
        })
      } else {
        // This scenario must pass
        before(function () {
          return thought()
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
