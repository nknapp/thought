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

var customize = require('customize')
var Q = require('q')
var qfs = require('q-io/fs')
var program = require('commander')

program
  .version(require('../package').version)
  .description('Generate documentation from your package.json and some templates.')
  .parse(process.argv)

require('../')(program)
