var apidocs = require("multilang-apidocs")
var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var _ = require("lodash");

module.exports = {

  publicApi: function (filename) {
    //console.log("filename", filename)
    var comments = apidocs(fs.readFileSync(filename, "utf-8"), {
      filename: filename
    });
    // console.log(comments.filteredComments);
    return comments.join("\n");
  },
  include: function (filename) {
    console.log(this);
    return "```" + path.extname(filename).substr(1) + "\n" +
    fs.readFileSync(filename, "utf-8") +
    "\n```\n"
  },
  /**
   * Includes an example file into the template, replacing
   * the `require('../')` by `require('module-name')` (only single-quotes are replaced)
   * @param filename
   */
  example: function (filename) {
    // Relative path to the current module (e.g. "../"). This path must be replaced
    // by the module name in the
    var modulePath = path.relative(path.dirname(filename), ".") + "/";

    return "```" + path.extname(filename).substr(1) + "\n" +
      fs.readFileSync(filename, "utf-8")
        .replace("require('" + modulePath + "')", "require('" + "name"   + "')") +
      "\n```\n"
  },

  exec: function (command, language) {
    console.log("lanng",language);
    var start = "```" + (language||'') + "\n",
      end = "\n```\n"
    if (language === "raw") {
      start = end = "";
    }
    var output = cp.execSync(command, {
      encoding: 'utf8'
    });
    return start + output + end;

  }
};
