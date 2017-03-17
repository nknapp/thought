/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
var fs = require('fs')

xdescribe('the thought dev-server', function () {
  var child = null
  this.timeout(10000)
  before(function () {
    child = require('child_process').fork(require.resolve('../lib/dev-server'), {
      cwd: 'test/fixtures/scenarios/simple-project/input'
    })
  })

  it('should run thought and return the result (if a "run"-message is sent")', function (done) {
    child.send({
      cmd: 'run'
    })
    child.on('message', (message) => {
      expect(message).to.deep.equal({
        'message': {
          'cmd': 'run'
        },
        'result': {
          'handlebars': {
            'CONTRIBUTING.md': fs.readFileSync('test/fixtures/scenarios/simple-project/expected/CONTRIBUTING.md',
              { encoding: 'utf-8'}),
            'README.md': fs.readFileSync('test/fixtures/scenarios/simple-project/expected/README.md',
              { encoding: 'utf-8'})
          }
        }
      })
      done()
    })
  })
})
