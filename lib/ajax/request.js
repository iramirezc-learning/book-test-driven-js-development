const tddjs = require('../tddjs')

/**
 * Ajax.request
 */
module.exports = function (Ajax) {
  function _isSuccess (transport) {
    const { status } = transport

    return (status >= 200 && status < 300) || status === 304 || (tddjs.isLocal() && !status)
  }

  function _isFunction (fn) {
    return typeof fn === 'function'
  }

  function _requestComplete (transport, options) {
    if (_isSuccess(transport)) {
      _isFunction(options.success) && options.success(transport)
    } else {
      _isFunction(options.failure) && options.failure(transport)
    }

    _isFunction(options.complete) && options.complete(transport)
  }

  function _setData (options) {
    if (options.data) {
      options.data = tddjs.urlParams(options.data)

      if (options.method === 'GET') {
        const hasParams = options.url.includes('?')

        options.url += hasParams ? '&' : '?'
        options.url += options.data
        options.data = null
      }
    } else {
      options.data = null
    }
  }

  function _setDefaultHeader (transport, headers, header, value) {
    if (!headers[header]) {
      transport.setRequestHeader(header, value)
    }
  }

  function _setRequestHeaders (transport, options) {
    tddjs.each(options.headers, (key, val) => {
      transport.setRequestHeader(key, val)
    })

    if (options.method === 'POST' && options.data) {
      _setDefaultHeader(transport, options.headers, 'Content-Type', 'application/x-www-form-urlencoded')
      _setDefaultHeader(transport, options.headers, 'Content-Length', options.data.length)
    }

    _setDefaultHeader(transport, options.headers, 'X-Requested-With', 'XMLHttpRequest')
  }

  return function (url, options) {
    if (typeof url !== 'string') {
      throw new TypeError('url should be a string')
    }

    const transport = Ajax.create()
    const _options = tddjs.extend({}, options)

    _options.url = url
    _options.headers = tddjs.extend({}, _options.headers)

    _setData(_options)

    transport.open(_options.method || 'GET', _options.url, true)

    // NOTE: When using setRequestHeader(),
    // you must call it after calling open(),
    // but before calling send().
    _setRequestHeaders(transport, _options)

    transport.onreadystatechange = function () {
      if (transport.readyState === 4) {
        _requestComplete(transport, _options)
        transport.onreadystatechange = Ajax.noop
      }
    }

    transport.send(_options.data)
  }
}
