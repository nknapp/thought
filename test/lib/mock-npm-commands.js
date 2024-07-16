const cpMock = require('./child-process-mock')

// Make "npm install" faster by not really executing it
cpMock.mockSpawn(
  cmd => cmd.match(/npm/),
  function (cmd, args, options) {
    setTimeout(() => this.emit('exit', 0), 10)
  }
)
