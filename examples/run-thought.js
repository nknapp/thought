/**
 * This script generates the documentation for all example-projects.
 */

var qfs = require('m-io/fs')
var exeq = require('../lib/utils/exeq')
var deep = require('deep-aplus')(Promise)
process.chdir(__dirname)

// Run thought in all example projects
qfs.list(__dirname)
  .then(list => list.filter(dir => dir.match(/^example-project.*$/)))
  .then(list => list.map(dir => {
    return exeq('thought', ['run', '-a'], {cwd: dir})
      .then((result) => {
        console.log(`Done with '${dir}'`)
      })
  }))
  .then(promises => deep(promises))
  .then(() => console.log('finished...'))
