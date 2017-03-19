var nock = require('nock')

module.exports = {
  /**
   * Setup mock response for a greenkeeper-badge that shows that a package *has* greenkeeper
   * @param {string} urlPath the path-component of the badge-url for the project (e.g. 'nknapp/thought.svg`)
   */
  greenkeeperEnabled: function (urlPath) {
    nock(`https://badges.greenkeeper.io/`)
      .get(urlPath)
      .reply(200, `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><mask id="a"><rect width="128" height="20" rx="3" fill="#fff"/></mask><g mask="url(#a)"><path fill="#555" d="M0 0h77v20H0z"/><path fill="#4c1" d="M77 0h51v20H77z"/><path fill="url(#b)" d="M0 0h128v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="38.5" y="15" fill="#010101" fill-opacity=".3">Greenkeeper</text><text x="38.5" y="14">Greenkeeper</text><text x="101.5" y="15" fill="#010101" fill-opacity=".3">enabled</text><text x="101.5" y="14">enabled</text></g></svg>`)
  },

  /**
   * Setup mock response for a greenkeeper-badge that shows that a package *does not have* greenkeeper
   * @param {string} urlPath the path-component of the badge-url for the project (e.g. 'nknapp/thought.svg`)
   */
  greenkeeperDisabled: function (urlPath) {
    nock(`https://badges.greenkeeper.io/`)
      .get(urlPath)
      .reply(200, `<svg xmlns="http://www.w3.org/2000/svg" width="138" height="20"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><mask id="a"><rect width="138" height="20" rx="3" fill="#fff"/></mask><g mask="url(#a)"><path fill="#555" d="M0 0h77v20H0z"/><path fill="#9f9f9f" d="M77 0h61v20H77z"/><path fill="url(#b)" d="M0 0h138v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11"><text x="38.5" y="15" fill="#010101" fill-opacity=".3">Greenkeeper</text><text x="38.5" y="14">Greenkeeper</text><text x="106.5" y="15" fill="#010101" fill-opacity=".3">not found</text><text x="106.5" y="14">not found</text></g></svg>`)
  },

  /**
   * Setup a greenkeeper error (for invalid paths)
   * @param {string} urlPath the path-component of the badge-url for the project (e.g. 'nknapp/thought.svg`)
   * @param {number} statusCode the status-code of the error (e.g. 404)
   */
  greenkeeperError: function (urlPath, statusCode) {
    nock(`https://badges.greenkeeper.io/`)
      .get(urlPath)
      .reply(statusCode, `{"statusCode":${statusCode},"error":"Not Found"}`)
  },

  /**
   * Runs https://github.com/node-nock/nock#cleanall to clean all nock settings
   */
  cleanup: function () {
    nock.cleanAll()
  }
}
