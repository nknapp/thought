/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
const expect = chai.expect
const { resolvePackageRoot } = require('../lib/utils/resolve-package-root')
const { osIndependentPath } = require('./lib/osIndependentPath')

describe('The "resolve-package-root" utility', function () {
  let statSync
  const fs = require('fs-extra')

  beforeEach(function () {
    statSync = fs.statSync
  })

  afterEach(function () {
    fs.statSync = statSync
  })

  it('finds a package.json file and provide the relative path of the given file', function () {
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/test.txt')).to.eventually.deep.equal({
      packageRoot: osIndependentPath('test/fixtures/mini-project'),
      relativeFile: osIndependentPath('a/b/test.txt'),
      packageJson: { name: 'mini-project', version: '1.0.0' }
    })
  })

  it('is not be bothered by directory named "package.json"', function () {
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/package.json/test.txt')).to.eventually.deep.equal({
      packageRoot: osIndependentPath('test/fixtures/mini-project'),
      relativeFile: osIndependentPath('a/b/package.json/test.txt'),
      packageJson: { name: 'mini-project', version: '1.0.0' }
    })
  })

  it('should return a rejected promise on unexpected exceptions', function () {
    fs.statSync = function () {
      throw new Error('Test-Error')
    }
    return expect(resolvePackageRoot('test/fixtures/mini-project/a/b/package.json/test.txt')).to.be.rejectedWith(
      'Test-Error'
    )
  })
})
