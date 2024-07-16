// Output the path of this script relative to the cwd (for the exec-helper-test
console.log(require('path').relative(process.cwd(), __filename).toUpperCase())
