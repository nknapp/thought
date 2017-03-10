var customize = require('customize')

var thought = customize().load(require('../customize.js')('.'))

function handleMessage (message) {
  switch (message.cmd) {
    case 'run': {
      console.log('Running thought')
      return thought.run()
    }
  }
}

process.on('message', (message) => {
  handleMessage(message)
    .then((result) => {
      process.send({ message: message, result: result })
    }, (err) => {
      console.error('error', err)
      process.send({ error: err })
    })
})
