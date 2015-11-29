/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
/* global it */
// /* global xdescribe */
// /* global xit */

'use strict'

var fs = require('fs')
var helpers = require('../handlebars/helpers.js')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect

describe('thought-helper', function () {
  describe("'dirTree'", function () {
    it('should return a file-hierarchy as markdown code', function () {
      expect(helpers.dirTree('test/fixtures/dir-tree'))
        .to.eventually.equal(fs.readFileSync('test/fixtures/dir-tree.output.txt', { encoding: 'utf-8' }).trim())

    })

    it('should filter specific entries throw globs', function () {
      expect(helpers.dirTree('test/fixtures/dir-tree', '!**/subdirB'))
        .to.eventually.equal(fs.readFileSync('test/fixtures/dir-tree.output.filtered.txt', { encoding: 'utf-8' }).trim())

    })

    it('should work with more complex globs', function () {
      expect(helpers.dirTree('test/fixtures/dir-tree', '!**/+(aFile.txt|bFile.txt)'))
        .to.eventually.equal(fs.readFileSync('test/fixtures/dir-tree.output.complex.filter.txt', { encoding: 'utf-8' }).trim())

    })

  })

  describe("'example'", function () {
    it('should resolve the current project properly', function () {
      return expect(helpers.example('test/fixtures/example.js'))
        .to.eventually.contain("require('thought')")
    })

    it('should return the marked part of the file if `options.hash.snippet` is true', function () {
      return expect(helpers.example('test/fixtures/example.js', { hash: { snippet: true } }))
        .to.eventually.equal('```js\nconsole.log(project)\n```')
    })
  })
})
