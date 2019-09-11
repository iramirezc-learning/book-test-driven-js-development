const tddjs = require('../tddjs')

/**
 * Ajax.get
 */
module.exports = function (Ajax) {
  return function (url, options) {
    const _options = tddjs.extend({}, options)
    _options.method = 'GET'
    Ajax.request(url, _options)
  }
}
