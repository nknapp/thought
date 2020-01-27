/*!
 * thought <https://github.com/nknapp/thought>
 *
 * Copyright (c) 2015 Nils Knappmeier.
 * Released under the MIT license.
 */

/* eslint-env mocha */

'use strict'

const fs = require('fs')
const helpers = require('../handlebars/helpers/index.js')
const chai = require('chai')
const deep = require('deep-aplus')(Promise)
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.use(require('dirty-chai'))
const expect = chai.expect
const path = require('path')

const engine = require('customize-engine-handlebars')

function executeInDir(directory) {
  let oldCwd = null

  before(function() {
    oldCwd = process.cwd()
    process.chdir(directory)
  })

  after(function() {
    process.chdir(oldCwd)
  })
}

/**
 * Return an expectation for the result of a handlebars run
 * @param {string} template the handlebars-template
 * @param {object} input the input object
 * @returns {*}
 */
function expectHbs(template, input, filename) {
  filename = filename || 'README.md'
  return expect(
    Promise.resolve()
      .then(() => {
        // Call undocumented interface usually used by "customize"
        const config = {
          preprocessor: a => a,
          partials: {},
          partialWrapper: a => a,
          helpers: helpers,
          hbsOptions: { noEscape: true },
          templates: {},
          data: input
        }
        config.templates[filename + '.hbs'] = {
          path: '/home/' + filename + '.hbs',
          contents: template
        }

        return engine.run(config)
      })
      .then(deep)
      .then(result => {
        return result[filename].trim()
      })
  )
}

/**
 *
 * @param {string} filename
 * @returns {string}
 */
function fixture(filename) {
  const absPath = path.join(__dirname, 'fixtures', filename)
  try {
    const result = fs.readFileSync(absPath, { encoding: 'utf-8' }).trim()
    return result
  } catch (e) {
    if (e.code === 'ENOENT') {
      fs.writeFileSync(absPath, 'Automatically created fixture template')
      return 'Automatically created fixture template'
    }
  }
}

describe('thought-helpers:', function() {
  describe('The "dirTree" helper', function() {
    it('should return a file-hierarchy as markdown code', function() {
      return expectHbs('{{dirTree directory}}', { directory: 'test/fixtures/dir-tree' }).to.eventually.equal(
        fixture('dir-tree.output.txt')
      )
    })

    it('should add a label as name of the root-node, if specified', function() {
      return expectHbs("{{dirTree directory label='rootNode'}}", {
        directory: 'test/fixtures/dir-tree'
      }).to.eventually.equal(fixture('dir-tree.label.txt'))
    })

    it('should filter specific entries through globs', function() {
      return expectHbs(
        '{{dirTree directory glob}}',
        {
          directory: 'test/fixtures/dir-tree',
          glob: '!(subdirB)/**'
        },
        'some-dir/'
      ).to.eventually.equal(fixture('dir-tree.output.filtered.txt'))
    })

    it('should condense paths with a single subdirectory into a single node', function() {
      return expectHbs('{{dirTree directory glob}}', {
        directory: 'test/fixtures/dir-tree',
        glob: '**/aFile.txt'
      }).to.eventually.equal(fixture('dir-tree.output.condensed.txt'))
    })

    it('should work with more complex globs', function() {
      return expectHbs('{{dirTree directory glob}}', {
        directory: 'test/fixtures/dir-tree',
        glob: '**/!(aFile.txt|bFile.txt)'
      }).to.eventually.equal(fixture('dir-tree.output.complex.filter.txt'))
    })

    it('should ignore files specified in the ignore-option', function() {
      return expectHbs('{{dirTree directory glob ignore=ignore}}', {
        directory: 'test/fixtures/dir-tree',
        glob: '**',
        ignore: ['**/aFile.txt', '**/bFile.txt']
      }).to.eventually.equal(fixture('dir-tree.output.ignore.files.txt'))
    })

    it('should show dot-files if the dot-option is set', function() {
      return expectHbs('{{dirTree directory glob dot=true}}', {
        directory: 'test/fixtures/dir-tree',
        glob: 'subdirA/bDir/**'
      }).to.eventually.equal(fixture('dir-tree.output.dot.files.txt'))
    })

    it('should only create links for files matching the glob-pattern', function() {
      return expectHbs("{{dirTree directory glob links='true'}}", {
        directory: 'test/fixtures/dir-tree',
        glob: '**/aFile.txt'
      }).to.eventually.equal(fixture('dir-tree.output.links.matching.files.txt'))
    })

    it('create links relative to the current target file if the "links"-option is set"', function() {
      return expectHbs(
        "{{dirTree directory glob links='true'}}",
        { directory: 'test/fixtures/dir-tree/subdirA/bDir' },
        'src/test.md'
      ).to.eventually.equal(fixture('dir-tree.output.links.relative.txt'))
    })

    it('should throw an error if the glob does not resolve to any files', function() {
      return expectHbs('{{dirTree directory}}', { directory: 'non-existing-dir' }).to.be.rejectedWith(
        "Cannot find a single file for '**' in 'non-existing-dir'"
      )
    })
  })

  describe('The "example" helper', function() {
    executeInDir('test/fixtures/example-helper')

    it('should resolve the current project properly', function() {
      return expectHbs('{{example file}}', { file: 'examples/full.js' }).to.eventually.equal(
        fixture('example-helper/examples/output.full.md')
      )
    })

    it('should return the marked part of the file if `options.hash.snippet` is true', function() {
      return expectHbs('{{example file snippet=true}}', { file: 'examples/snippet.js' }).to.eventually.equal(
        fixture('example-helper/examples/output.snippet.md')
      )
    })

    it('should ignore the snippet markers, if "snippet=true" is not set`', function() {
      return expectHbs('{{example file}}', { file: 'examples/snippet.js' }).to.eventually.equal(
        fixture('example-helper/examples/output.snippet-full.md')
      )
    })
  })

  describe('The "json"-helper', function() {
    it('should display a javascript-object as JSON', function() {
      return expectHbs('{{json .}}', { a: { b: 2 }, c: [1, 2, 'a', 'b'] }).to.eventually.equal(
        fixture('json.output.simple.md')
      )
    })
  })

  describe('The "include"-helper', function() {
    it('should include a file into fences', function() {
      return expectHbs('{{include file}}', { file: 'test/fixtures/include/javascript.js' }).to.eventually.equal(
        fixture('include/output.javascript.md')
      )
    })

    it('should use the file extension as language descriptor', function() {
      return expectHbs('{{include file}}', { file: 'test/fixtures/include/text.txt' }).to.eventually.equal(
        fixture('include/output.text.md')
      )
    })

    it('should prefer the file language descriptor provided as second parameter', function() {
      return expectHbs('{{include file "txt"}}', { file: 'test/fixtures/include/javascript.js' }).to.eventually.equal(
        fixture('include/output.javascript-as-text.md')
      )
    })
  })

  describe('The "includeRaw"-helper', function() {
    it('should include a file without any fences', function() {
      return expectHbs('{{includeRaw file}}', { file: 'test/fixtures/include/javascript.js' }).to.eventually.equal(
        fixture('include/javascript.js')
      )
    })
  })

  describe('The "exec"-helper', function() {
    it('should execute a command and return the output in a fence', function() {
      return expectHbs('{{exec "node test/fixtures/shout.js"}}', {}).to.eventually.equal(
        fixture('exec.output.default.md')
      )
    })

    it('should add language to the fence if the "lang"-option is set', function() {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="js"}}', {}).to.eventually.equal(
        fixture('exec.output.as.js.md')
      )
    })

    it('should not output fences if lang="raw"', function() {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="raw"}}', {}).to.eventually.equal(
        fixture('exec.output.raw.md')
      )
    })

    it('should surround the output with single backticks if lang="inline"', function() {
      return expectHbs('{{exec "node test/fixtures/shout.js" lang="inline"}}', {}).to.eventually.equal(
        fixture('exec.output.inline.md')
      )
    })

    it('should chdir to the directory provided as cwd="..."', function() {
      return expectHbs('{{exec "node shout.js" cwd="test/fixtures"}}', {}).to.eventually.equal(
        fixture('exec.output.cwd.md')
      )
    })
  })

  describe('The "renderTree"-helper', function() {
    it('render a tree', function() {
      return expectHbs('{{#renderTree tree}}--{{prop1}} ({{children.length}})--{{/renderTree}}', {
        tree: tree()
      }).to.eventually.equal(fixture('renderTree.output.md'))
    })

    function tree() {
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
  function versions(expectedString) {
    const thought = require('../package').version
    const customize = require('customize/package').version
    return expectedString.replace(/THOUGHT_VERSION/g, `v${thought}`).replace(/CUSTOMIZE_VERSION/g, `v${customize}`)
  }

  describe('The "withPackageOf"-helper', function() {
    it('should create a url and package.json for file on github (based on the current package version)', function() {
      return expectHbs('{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}', {
        file: 'test/fixtures/shout.js'
      }).to.eventually.equal(versions(fixture('include/withPackageOf.default.md')))
    })

    it('should create a rawUrl for file on github (based on the current package version)', function() {
      return expectHbs('{{#withPackageOf file}}{{@rawUrl}}{{/withPackageOf}}', {
        file: 'test/fixtures/shout.js'
      }).to.eventually.equal(
        versions('https://raw.githubusercontent.com/nknapp/thought/THOUGHT_VERSION/test/fixtures/shout.js')
      )
    })

    it('should create a url and package.json for file on github (with a git-ssh-url)', function() {
      return expectHbs('{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}', {
        file: 'test/fixtures/github-ssh-repo-url/package.json'
      }).to.eventually.equal(versions(fixture('include/withPackageOf.ssh.md')))
    })

    it('should create a rawurl file on github (with a git-ssh-url)', function() {
      return expectHbs('{{#withPackageOf file}}{{@rawUrl}}{{/withPackageOf}}', {
        file: 'test/fixtures/github-ssh-repo-url/package.json'
      }).to.eventually.equal(
        versions('https://raw.githubusercontent.com/nknapp/thought-plugin-jsdoc/v1.0.0/package.json')
      )
    })

    it('should create a rawUrl for files in dependency projects (based on the their current package version)', function() {
      return expectHbs('{{#withPackageOf file}}{{@rawUrl}}{{/withPackageOf}}', {
        file: require.resolve('customize/helpers-io.js')
      }).to.eventually.equal(
        versions('https://raw.githubusercontent.com/bootprint/customize/CUSTOMIZE_VERSION/helpers-io.js')
      )
    })

    it('should not create an url for files without repository-property in the package.json', function() {
      return expectHbs('{{#withPackageOf file}} {{@url}} - {{@package.name}} {{/withPackageOf}}', {
        file: require.resolve('./fixtures/no-git-repo/package.json')
      }).to.eventually.equal(versions(fixture('include/withPackageOf.no-repo.md')))
    })

    it('should not create a rawUrl for files without repository-property in the package.json', function() {
      return expectHbs('{{#withPackageOf file}}{{@rawUrl}}{{/withPackageOf}}', {
        file: require.resolve('./fixtures/no-git-repo/package.json')
      }).to.eventually.equal('')
    })

    it('should create a @relativePath for files in dependency projects', function() {
      return expectHbs('{{#withPackageOf file}}{{@relativePath}}{{/withPackageOf}}', {
        file: require.resolve('customize/helpers-io.js')
      }).to.eventually.equal('helpers-io.js')
    })
  })

  it('should create a @relativePath for projects without repository-property', function() {
    return expectHbs('{{#withPackageOf file}}{{@relativePath}}{{/withPackageOf}}', {
      file: require.resolve('./fixtures/no-git-repo/package.json')
    }).to.eventually.equal('package.json')
  })

  describe('The "github"-helper', function() {
    it('should create a url to file on github (based on the current package version)', function() {
      return expectHbs('{{github file}}', { file: 'test/fixtures/shout.js' }).to.eventually.equal(
        versions(fixture('include/github.default.md'))
      )
    })

    it('should create a url files in dependency projects (based on the their current package version)', function() {
      return expectHbs('{{github file}}', { file: require.resolve('customize/helpers-io.js') }).to.eventually.equal(
        versions(fixture('include/github.dependency.md'))
      )
    })
  })

  describe('The "htmlId"-helper', function() {
    it('should keep valid names intact', function() {
      expect(helpers.htmlId('abc')).to.equal('abc')
    })

    it('should replace spaces by minus', function() {
      expect(helpers.htmlId('abc cde')).to.equal('abc-cde')
    })

    it('should remove invalid characters', function() {
      expect(helpers.htmlId('a$b&c%d')).to.equal('abcd')
    })

    it('should keep umlaut characters', function() {
      expect(helpers.htmlId('mäxchen')).to.equal('mäxchen')
    })

    it('should convert everything to lower-case', function() {
      expect(helpers.htmlId('ABCDE')).to.equal('abcde')
    })

    it('should not remove japanese characters', function() {
      expect(helpers.htmlId('ハッピークリスマス')).to.equal('ハッピークリスマス')
    })
  })

  describe('The "npm"-helper', function() {
    it('should create a link to the npm-page, given the package name', function() {
      return expectHbs('{{npm file}}', { file: 'bootprint-openapi' }).to.eventually.equal(
        '[bootprint-openapi](https://npmjs.com/package/bootprint-openapi)'
      )
    })
  })

  describe('The "hasCoveralls"-helper (positive)', function() {
    executeInDir('test/fixtures/hasCoveralls-helper')

    it('should return true, if coveralls is mentioned in the .travis.yml file', function() {
      return expectHbs('{{#if (hasCoveralls)}}yeah{{else}}nope{{/if}}', {}).to.eventually.equal('yeah')
    })
  })

  describe('The "hasCoveralls"-helper (negative)', function() {
    executeInDir('test/fixtures/hasCoveralls-helper-false')

    it('should return true, if coveralls is not configured', function() {
      return expectHbs('{{#if (hasCoveralls)}}yeah{{else}}nope{{/if}}', {}).to.eventually.equal('nope')
    })
  })

  describe('The "hasCodecov"-helper (positive)', function() {
    executeInDir('test/fixtures/hasCodecov-helper')

    it('should return true, if coveralls is mentioned in the .travis.yml file', function() {
      return expectHbs('{{#if (hasCodecov)}}yeah{{else}}nope{{/if}}', {}).to.eventually.equal('yeah')
    })
  })

  describe('The "hasCodecov"-helper (negative)', function() {
    executeInDir('test/fixtures/hasCodecov-helper-false')

    it('should return true, if coveralls is not configured', function() {
      return expectHbs('{{#if (hasCodecov)}}yeah{{else}}nope{{/if}}', {}).to.eventually.equal('nope')
    })
  })

  describe('The "githubRepo"-helper', function() {
    it(
      'should return the name of organization/repository in a module with a configured ' +
        'repository on github (e.g. Thought itself)',
      function() {
        return expectHbs('{{githubRepo}}', {
          package: {
            name: 'no-github-repo',
            repository: {
              type: 'git',
              url: 'https://github.com/nknapp/thought.git'
            }
          }
        }).to.eventually.equal('nknapp/thought')
      }
    )

    it('should return null in a module with no configured git repo', function() {
      return expectHbs('{{githubRepo}}', {
        package: {
          name: 'no-git-repo'
        }
      }).not.to.eventually.be.ok()
    })

    it('should return null in a module with a repository that is not on github', function() {
      return expectHbs('{{githubRepo}}', {
        package: {
          name: 'no-github-repo',
          repository: {
            type: 'git',
            url: 'https://custom-git.com/somepath.git'
          }
        }
      }).not.to.eventually.be.ok()
    })
  })

  describe('The "hasGreenkeeper"-helper', function() {
    it('should return false, if the githubRepo is not set', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo'
        }
      }).to.eventually.equal('false')
    })

    it('should return false, if the project does not have a github url', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-github-repo',
          repository: {
            type: 'git',
            url: 'https://custom-git.com/somepath.git'
          }
        }
      }).to.eventually.equal('false')
    })

    it('should return false, if the project does not have greenkeeper enabled', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'greenkeeper-disabled',
          repository: {
            type: 'git',
            url: 'https://github.com/group/repo.git'
          }
        }
      }).to.eventually.equal('false')
    })

    it('should throw an error, if greenKeeper is enabled in the config, but not github url is found', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo',
          repository: {
            type: 'git',
            url: 'https://gitlab.com/group/repo.git'
          }
        },
        config: {
          badges: {
            greenkeeper: true
          }
        }
      }).to.be.rejectedWith(/no github-repo/)
    })

    it('should return true, if the badge is enabled in the config', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'no-git-repo',
          repository: {
            type: 'git',
            url: 'https://github.com/group/repo.git'
          }
        },
        config: {
          badges: {
            greenkeeper: true
          }
        }
      }).to.eventually.equal('true')
    })

    it('should return true, if the badge is enabled in the config', function() {
      return expectHbs('{{hasGreenkeeper}}', {
        package: {
          name: 'enabledRepo',
          repository: {
            type: 'git',
            url: 'https://github.com/group/repo.git'
          }
        },
        config: {
          badges: {
            greenkeeper: false
          }
        }
      }).to.eventually.equal('false')
    })
  })

  describe('The "arr" helper', function() {
    it('should return an array of its arguments', function() {
      return expectHbs("{{#each (arr 'a' 'b' 'c')}}v:{{.}} {{/each}}", {}).to.eventually.equal('v:a v:b v:c')
    })
  })

  describe('The "repoWebUrl" helper', function() {
    it('should return a github-web-url for a github-ssh-url', function() {
      return expect(helpers.repoWebUrl('git+ssh://git@github.com/nknapp/thought-plugin-jsdoc.git')).to.equal(
        'https://github.com/nknapp/thought-plugin-jsdoc'
      )
    })

    it('should return null for unknown urls for a github-ssh-url', function() {
      return expect(helpers.repoWebUrl('git+ssh://git@example.com/nknapp/thought-plugin-jsdoc.git')).to.equal(null)
    })
  })
})
