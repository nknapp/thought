module.exports = {
  /**
   * One of @substack's favorite use cases.
   * @param {string} text a text to be shouted
   * @returns {string} the text in uppercases
   */
  shout: function (text) {
    return text && text.toUpperCase()
  },

  /**
   * A promise can be returned by a helper.
   * The example really does not make sense, but it's useful when reading files,
   * making HTTP-requests or accessing databases.
   * @param {string} text
   * @returns {Promise<string>} a promise for the text
   */
  delay: function (text) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(text), 10))
  }
}
