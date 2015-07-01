#!/usr/bin/env node
/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/**
 * @thought-usage
 *
 * Run this program in your project root folder to generate the documentation.
 * It will run your package.json throught templates
 *
 */
'use strict'

var customize = require("customize");
var Q = require("q");
var qfs = require("q-io/fs");
var program = require("commander");

program
  .version(require("../package").version)
  .description("Generate documentation from your package.json and some templates.")
  .parse(process.argv);

customize()
  .load(require("../"))
  .run()
  .then(function (result) {
    console.log(result)
    return Q.all(Object.keys(result.handlebars).map(function (filename) {
      qfs.write(filename, result.handlebars[filename]);
      return filename;
    }));
  })
  .done(function (filenames) {
    console.log("The following files were updated: " + filenames.join(", "));
  });
