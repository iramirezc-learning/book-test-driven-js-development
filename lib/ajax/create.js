const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const tddjs = require('../tddjs')

/**
 * Ajax.create
 */
module.exports = function (Ajax) {
  let xhr
  let _create = null

  const options = [
    function () {
      return new ActiveXObject('Microsoft.XMLHTTP') // eslint-disable-line
    },
    function () {
      return new XMLHttpRequest() // eslint-disable-line
    }
  ]

  for (let i = 0, l = options.length; i < l; i++) {
    try {
      xhr = options[i]()

      if (tddjs.isHostMethod(xhr, 'open') &&
        tddjs.isHostMethod(xhr, 'send') &&
        tddjs.isHostMethod(xhr, 'setRequestHeader')) {
        _create = options[i]
        break
      }
    } catch (e) { }
  }

  return _create
}
