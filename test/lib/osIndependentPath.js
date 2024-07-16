const path = require('path')

module.exports = {
  osIndependentPath(somePath) {
    return somePath.replace(/\//g, path.sep)
  }
}
