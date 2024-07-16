// Output the path of this script relative to the cwd (for the exec-helper-test
const path = require('path').posix;
const myRelativePath = path.relative(process.cwd(), __filename);
console.log(myRelativePath.toUpperCase())
