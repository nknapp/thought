/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

'use strict'

var path = require("path");

module.exports = function thought(customize) {

  return customize
    .registerEngine("handlebars", require("customize-engine-handlebars"))
    .merge({
      handlebars: {
        partials: "handlebars/partials",
        templates: "handlebars/templates",
        helpers: require("./handlebars/helpers.js"),
        data: {
          'package': require("./package.json")
        }
        //, preprocessor: require("./handlebars/preprocessor.js")
      }
    })
    .merge({
      handlebars: {
        partials: path.join(".thought", "partials"),
        templates: path.join(".thought", "templates"),
      }
    })
    //.tap(console.log)


}
