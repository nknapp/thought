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

describe('The "exeq" utility', function () {
  var exec = require('../lib/utils/exeq')
  this.timeout(10000)
  it('should return stdout and stderr', function () {
    return expect(exec(process.argv[0], ['-e', 'console.log("123");console.error("abc")']))
      .to.eventually.deep.equal(['123\n', 'abc\n'])
  })

  it('should throw an error on exit-code > 0', function () {
    return expect(exec(process.argv[0], ['-e', 'throw "Hommingberg"']))
      .to.rejectedWith(/Command failed:.*Hommingberg/)
  })
})
