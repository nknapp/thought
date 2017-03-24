/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */
var cp = require('child_process')

/**
 * Call child_process.execFile with `{ encoding: utf-8 }` and return a promise of `[ stdout, stderr]`
 */
module.exports = function (cmd, args) {
  return new Promise(function (resolve, reject) {
    return cp.execFile(cmd, args, function (err, stdout, stderr) {
      if (err) {
        return reject(err)
      }
      return resolve([stdout, stderr])
    })
  })
}
