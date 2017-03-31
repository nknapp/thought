/**
 * A preprocessor can modify the incoming data.
 * @param data
 */
module.exports = function (data) {
  // Call the original preprocessor first (attention: It returns a promise)
  return this.parent(data)
    .then(function (modifiedData) {
      modifiedData.preprocessorText = 'You can probably use helpers to achieve most of the things ' +
        'that a preprocessor is good for, but some day you may need one.'
      console.log(modifiedData)
      return modifiedData
    })
}
