/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

var fs = require('fs')
var handlebars = require('promised-handlebars')(require('handlebars'))
const helpers = require('../handlebars/helpers.js')
handlebars.registerHelper(helpers)
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
var path = require('path')
var httpMocks = require('./lib/http-mocks')

function executeInDir (directory) {
  var oldCwd = null

  before(function () {
    oldCwd = process.cwd()
    process.chdir(directory)
  })

  after(function () {
    process.chdir(oldCwd)
  })
}

/**
 * Return an expectation for the result of a handlebars run
 * @param {string} template the handlebars-template
 * @param {object} input the input object
 * @param {string=} workingDirectory the working directory to execute the test in
 * @returns {*}
 */
function expectHbs (template, input) {
  return expect(
    Promise.resolve()
      .then(() => {
        return handlebars.compile(template, {noEscape: true})(input)
      })
      .then((result) => result.trim())
  )
}

/**
 *
 * @param {string} filename
 * @returns {string}
 */
function fixture (filename) {
  const absPath = path.join(__dirname, 'fixtures', filename)
  try {
    const result = fs.readFileSync(absPath, {encoding: 'utf-8'}).trim()
    return result
  } catch (e) {
    if (e.code === 'ENOENT') {
      fs.writeFileSync(absPath, 'Automatically created fixture template')
      return 'Automatically created fixture template'
    }
  }
}

describe('thought-helpers:', function () {
  describe('The "dirTree" helper', function () {
    it('should return a file-hierarchy as markdown code', function () {
      return expectHbs('{{dirTree directory}}', {directory: 'test/fixtures/dir-tree'})
        .to.eventually.equal(fixture('dir-tree.output.txt'))
    })

    it('should filter specific entries throw globs', function () {
      return expectHbs('{{dirTree directory glob}}', {directory: 'test/fixtures/dir-tree', glob: '!(subdirB)/**'})
        .to.eventually.equal(fixture('dir-tree.output.filtered.txt'))
    })

    it('should condense paths with a single subdirectory into a single node', function () {
      return expectHbs('{{dirTree directory glob}}', {directory: 'test/fixtures/dir-tree', glob: '**/aFile.txt'})
        .to.eventually.equal(fixture('dir-tree.output.condensed.txt'))
    })

    it('should work with more complex globs', function () {
      return expectHbs('{{dirTree directory glob}}', {
        directory: 'test/fixtures/dir-tree',
        glob: '**/!(aFile.txt|bFile.txt)'
      })
        .to.eventually.equal(fixture('dir-tree.output.complex.filter.txt'))
    })

    it('should throw an error if the glob does not resolve to any files', function () {
      return expectHbs('{{dirTree directory}}', {directory: 'non-existing-dir'})
        .to.be.rejectedWith('Cannot find a single file for \'**\' in \'non-existing-dir\'')
    })
  })

  describe('The "example" helper', function () {
    executeInDir('test/fixtures/example-helper')

    it('should resolve the current project properly', function () {
      return expectHbs(
        '{{example file}}',
        {file: 'examples/full.js'}
      )
        .to.eventually.equal(fixture('example-helper/examples/output.full.md'))
    })

    it('should return the marked part of the file if `options.hash.snippet` is true', function () {
      return expectHbs(
        '{{example file snippet=true}}',
        {file: 'examples/snippet.js'}
      )
        .to.eventually.equal(fixture('example-helper/examples/output.snippet.md'))
    })

    it('should ignore the snippet markers, if "snippet=true" is not set`', function () {
      return expectHbs(
        '{{example file}}',
        {file: 'examples/snippet.js'}
      )
        .to.eventually.equal(fixture('example-helper/examples/output.snippet-full.md'))
    })
  })

  describe('The "json"-helper', function () {
    it('should display a javascript-object as JSON', function () {
      return expectHbs('{{json .}}', {a: {b: 2}, c: [1, 2, 'a', 'b']})
        .to.eventually.equal(fixture('json.output.simple.md'))
    })
  })

  describe('The "include"-helper', function () {
    it('should include a file into fences', function () {
      return expectHbs('{{include file}}', {file: 'test/fixtures/include/javascript.js'})
        .to.eventually.equal(fixture('include/output.javascript.md'))
    })

    it('should use the file extension as language descriptor', function () {
      return expectHbs('{{include file}}', {file: 'test/fixtures/include/text.txt'})
        .to.eventually.equal(fixture('include/output.text.md'))
    })

    it('should prefer the file language descriptor provided as second parameter', function () {
      return expectHbs('{{include file "txt"}}', {file: 'test/fixtures/include/javascript.js'})
        .to.eventually.equal(fixture('include/output.javascript-as-text.md'))
    })
  })

  describe('The "includeRaw"-helper', function () {
    it('should include a file without any fences', function () {
      return expectHbs('{{includeRaw file}}', {file: 'test/fixtures/include/javascript.js'})
        .to.eventually.equal(fixture('include/javascript.js'))
    })
  })

  describe('The "exec"-helper', function () {
    it('should execute a command and return the output in a fence', function () {
      return expectHbs('{{exec "node test/fixtures/shout.js"}}', {})
        .to.eventually.equal(fixture('exec.output.default.md'))
    })

    it('should add language to the fence if the "lang"-option is set', function () {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="js"}}', {})
        .to.eventually.equal(fixture('exec.output.as.js.md'))
    })

    it('should not output fences if lang="raw"', function () {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="raw"}}', {})
        .to.eventually.equal(fixture('exec.output.raw.md'))
    })

    it('should surround the output with single backticks if lang="inline"', function () {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="inline"}}', {})
        .to.eventually.equal(fixture('exec.output.inline.md'))
    })

    it('should chdir to the directory provided as cwd="..."', function () {
      return expectHbs('{{exec "node shout.js" cwd="test/fixtures"}}', {})
        .to.eventually.equal(fixture('exec.output.cwd.md'))
    })
  })

  describe('The "renderTree"-helper', function () {
    it('render a tree', function () {
      return expectHbs('{{#renderTree tree}}--{{prop1}} ({{children.length}})--{{/renderTree}}', {tree: tree()})
        .to.eventually.equal(fixture('renderTree.output.md'))
    })

    function tree () {
      return {
        prop1: 'parent',
        children: [
          {
            prop1: 'child',
            children: []
          },
          {
            prop1: 'emptyChild'
          }

        ]
      }
    }
  })

  /**
   * Replace some versions by versions currently in package.json
   * @param expectedString
   */
  function versions (expectedString) {
    var thought = require('../package').version
    var customize = require('customize/package').version
    return expectedString
      .replace(/THOUGHT_VERSION/g, `v${thought}`)
      .replace(/CUSTOMIZE_VERSION/g, `v${customize}`)
  }

  describe('The "withPackageOf"-helper', function () {
    it('should create a url and package.json for file on github (based on the current package version)', function () {
      return expectHbs(
        '{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}',
        {file: 'test/fixtures/shout.js'}
      )
        .to.eventually.equal(versions(fixture('include/withPackageOf.default.md')))
    })

    it('should create a url and package.json for files in dependency projects (based on the their current package version)', function () {
      return expectHbs(
        '{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}',
        {file: require.resolve('customize/helpers-io.js')}
      )
        .to.eventually.equal(versions(fixture('include/withPackageOf.dependency.md')))
    })

    it('should not create an url for files without repository-property in the pacakge.json', function () {
      return expectHbs(
        '{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}',
        {file: require.resolve('./fixtures/no-git-repo/package.json')}
      )
        .to.eventually.equal(versions(fixture('include/withPackageOf.no-repo.md')))
    })
  })

  describe('The "github"-helper', function () {
    it('should create a url to file on github (based on the current package version)', function () {
      return expectHbs(
        '{{github file}}',
        {file: 'test/fixtures/shout.js'}
      )
        .to.eventually.equal(versions(fixture('include/github.default.md')))
    })

    it('should create a url files in dependency projects (based on the their current package version)', function () {
      return expectHbs(
        '{{github file}}',
        {file: require.resolve('customize/helpers-io.js')}
      )
        .to.eventually.equal(versions(fixture('include/github.dependency.md')))
    })
  })

  describe('The "htmlId"-helper', function () {
    it('should keep valid names intact', function () {
      expect(helpers.htmlId('abc')).to.equal('abc')
    })

    it('should replace spaces by minus', function () {
      expect(helpers.htmlId('abc cde')).to.equal('abc-cde')
    })

    it('should remove invalid characters', function () {
      expect(helpers.htmlId('a$b&c%d')).to.equal('abcd')
    })

    it('should keep umlaut characters', function () {
      expect(helpers.htmlId('mäxchen')).to.equal('mäxchen')
    })

    it('should convert everything to lower-case', function () {
      expect(helpers.htmlId('ABCDE')).to.equal('abcde')
    })

    it('should not remove japanese characters', function () {
      expect(helpers.htmlId('ハッピークリスマス')).to.equal('ハッピークリスマス')
    })
  })

  describe('The "npm"-helper', function () {
    it('should create a link to the npm-page, given the package name', function () {
      return expectHbs(
        '{{npm file}}',
        {file: 'bootprint-openapi'}
      )
        .to.eventually.equal('[bootprint-openapi](https://npmjs.com/package/bootprint-openapi)')
    })
  })

  describe('The "hasCoveralls"-helper (positive)', function () {
    executeInDir('test/fixtures/hasCoveralls-helper')

    it('should return true, if coveralls is mentioned in the .travis.yml file', function () {
      return expectHbs(
        '{{#if (hasCoveralls)}}yeah{{else}}nope{{/if}}',
        {}
      )
        .to.eventually.equal('yeah')
    })
  })

  describe('The "hasCoveralls"-helper (negative)', function () {
    executeInDir('test/fixtures/hasCoveralls-helper-false')

    it('should return true, if coveralls is not configured', function () {
      return expectHbs(
        '{{#if (hasCoveralls)}}yeah{{else}}nope{{/if}}',
        {}
      )
        .to.eventually.equal('nope')
    })
  })

  describe('The "githubRepo"-helper', function () {
    it('should return the name of organization/repository in a module with a configured repository on github (e.g. Thought itself)', function () {
      return expectHbs('{{githubRepo}}', {
        'package': {
          'name': 'no-github-repo',
          'repository': {
            'type': 'git',
            'url': 'https://github.com/nknapp/thought.git'
          }
        }
      })
        .to.eventually.equal('nknapp/thought')
    })

    it('should return null in a module with no configured git repo', function () {
      return expectHbs('{{githubRepo}}', {
        package: {
          name: 'no-git-repo'
        }
      })
        .not.to.eventually.be.ok()
    })

    it('should return null in a module with a repository that is not on github', function () {
      return expectHbs('{{githubRepo}}', {
        'package': {
          'name': 'no-github-repo',
          'repository': {
            'type': 'git',
            'url': 'https://custom-git.com/somepath.git'
          }
        }
      })
        .not.to.eventually.be.ok()
    })
  })

  describe('The "hasGreenkeeper"-helper', function () {
    afterEach(httpMocks.cleanup)

    it('should return false, if the githubRepo is not set', function () {
      httpMocks.greenkeeperError('/null.svg', 404)

      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo'
        }
      })
        .not.to.eventually.be.false()
    })

    it('should return false, project does not have a github url', function () {
      httpMocks.greenkeeperError('/null.svg', 404)

      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo',
          'repository': {
            'type': 'git',
            'url': 'https://custom-git.com/somepath.git'
          }
        }
      })
        .not.to.eventually.be.false()
    })

    it('should return false, if the project does not have greenkeeper enabled', function () {
      httpMocks.greenkeeperDisabled('/group/repo.svg')

      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo',
          'repository': {
            'type': 'git',
            'url': 'https://github.com/group/repo.git'
          }
        }
      })
        .not.to.eventually.be.false()
    })

    it('should throw an error, if the greenkeeper-badge returns an error other than 404', function () {
      httpMocks.greenkeeperError('/group/repo.svg', 500)

      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo',
          'repository': {
            'type': 'git',
            'url': 'https://github.com/group/repo.git'
          }
        }
      })
        .to.be.rejectedWith('')
    })
  })
})
