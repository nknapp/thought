/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* global describe */
// /* global it */
// /* global xdescribe */
// /* global xit */
/* global expect */

'use strict'

var fs = require('fs')
var helpers = require('../handlebars/helpers.js')

describe('thought-helper', function () {
  describe('dirTree', function () {
    it('should return a file-hierarchy as markdown code', function () {
      expect(helpers.dirtree('spec/fixtures/dirtree'))
        .toBe(fs.readFileSync('spec/fixtures/dirtree.output.txt', { encoding: 'utf-8'}))

    })

    it('should filter specific entries throw globs', function () {
      expect(helpers.dirtree('spec/fixtures/dirtree','!**/subdirB'))
        .toBe(fs.readFileSync('spec/fixtures/dirtree.output.filtered.txt', { encoding: 'utf-8'}))

    })

  })
})
