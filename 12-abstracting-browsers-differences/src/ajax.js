const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

const tddjs = require('../../lib/tddjs')

const Ajax = {}

Ajax.create = (function () {
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
})()

Ajax.get = (function () {
  if (!Ajax.create) return null

  function _isSuccess (transport) {
    const { status } = transport

    return (status >= 200 && status < 300) || status === 304 || (tddjs.isLocal() && !status)
  }

  function _isFunction (fn) {
    return typeof fn === 'function'
  }

  function _requestComplete (transport, options) {
    if (_isSuccess(transport)) {
      if (_isFunction(options.success)) {
        options.success(transport)
      }
    } else {
      if (_isFunction(options.failure)) {
        options.failure(transport)
      }
    }
    transport.onreadystatechange = Ajax.noop
  }

  return function (url, options) {
    if (typeof url !== 'string') {
      throw new TypeError('url should be a string')
    }

    const transport = Ajax.create()
    const _options = options || {}

    transport.open('GET', url, true)

    transport.onreadystatechange = function () {
      if (transport.readyState === 4) {
        _requestComplete(transport, _options)
      }
    }

    transport.send(null)
  }
})()

Ajax.noop = function () { /* noop */ }

module.exports = Ajax
