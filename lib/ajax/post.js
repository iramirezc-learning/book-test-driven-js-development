const tddjs = require('../tddjs')

/**
 * Ajax.post
 */
module.exports = function (Ajax) {
  return function (url, options) {
    const _options = tddjs.extend({}, options)
    _options.method = 'POST'
    Ajax.request(url, _options)
  }
}
