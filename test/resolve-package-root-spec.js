/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
var expect = chai.expect
var {resolvePackageRoot} = require('../lib/utils/resolve-package-root')

describe('The "resolve-package-root" utility', function () {
  var statSync
  var fs = require('fs')

  beforeEach(function () {
    statSync = fs.statSync
  })

  afterEach(function () {
    fs.statSync = statSync
  })

  it('find a package.json file and provide the relative path of the given file', function () {
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/test.txt')).to.eventually.deep.equal({
      packageRoot: 'test/fixtures/mini-project',
      relativeFile: 'a/b/test.txt',
      packageJson: {'name': 'mini-project', 'version': '1.0.0'}
    })
  })

  it('find not be bothered by directory named "package.json"', function () {
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/package.json/test.txt')).to.eventually.deep.equal({
      packageRoot: 'test/fixtures/mini-project',
      relativeFile: 'a/b/package.json/test.txt',
      packageJson: {'name': 'mini-project', 'version': '1.0.0'}
    })
  })

  it('should return a rejected promise on unexpected exceptions', function () {
    fs.statSync = function () {
      throw new Error('Test-Error')
    }
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/package.json/test.txt')).to.be.rejectedWith('Test-Error')
  })
})
