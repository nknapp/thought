/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var cp = require('child_process')
var Q = require('q')
var _ = require('lodash')

/**
 * Call child_process.execFile with `{ encoding: utf-8 }` and return a promise of `[ stdout, stderr]`
 */
module.exports = _.partial(Q.denodeify(cp.execFile), _, _, {encoding: 'utf-8'})
