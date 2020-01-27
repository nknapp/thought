/**
 * This script generates the documentation for all example-projects.
 */

const fs = require('fs-extra')
const exeq = require('../lib/utils/exeq')
const deep = require('deep-aplus')(Promise)
process.chdir(__dirname)

// Run thought in all example projects
fs.readdir(__dirname)
  .then(list => list.filter(dir => dir.match(/^example-project.*$/)))
  .then(list =>
    list.map(dir => {
      return exeq('thought', ['run', '-a'], { cwd: dir }).then(result => {
        console.log(`Done with '${dir}'`)
      })
    })
  )
  .then(promises => deep(promises))
  .then(() => console.log('finished...'))
