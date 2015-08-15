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
var expect = require('chai').expect

describe('thought-helper', function () {
  describe('dirTree', function () {
    it('should return a file-hierarchy as markdown code', function () {
      expect(helpers.dirtree('test/fixtures/dirtree'))
        .to.equal(fs.readFileSync('test/fixtures/dirtree.output.txt', { encoding: 'utf-8'}).trim())

    })

    it('should filter specific entries throw globs', function () {
      expect(helpers.dirtree('test/fixtures/dirtree', '!**/subdirB'))
        .to.equal(fs.readFileSync('test/fixtures/dirtree.output.filtered.txt', { encoding: 'utf-8'}).trim())

    })

    it('should work with more complex globs', function () {
      expect(helpers.dirtree('test/fixtures/dirtree', '!**/+(aFile.txt|bFile.txt)'))
        .to.equal(fs.readFileSync('test/fixtures/dirtree.output.complex.filter.txt', { encoding: 'utf-8'}).trim())

    })

  })
})
