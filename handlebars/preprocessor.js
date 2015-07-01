var qfs = require("q-io/fs");
var apidocs = require("multilang-apidocs")
var _ = require('lodash')

// Not used at the moment
module.exports = function (config) {
  console.log(config);
  return _.merge({}, config, {
    bin: config.package.bin && Object.keys(config.package.bin).map(function (command) {
      var filename = config.package.bin[command];
      return qfs.read(filename).then(function (contents) {
        apidocs(contents, {
          filename: filename,
          filter: function (comment) {
            console.log(comment);
            return true;
          }
        })
      })
    })
  });
}
