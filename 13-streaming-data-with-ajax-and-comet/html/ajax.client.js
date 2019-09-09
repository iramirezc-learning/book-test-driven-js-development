/* globals tddjs */

/**
 * This is the client implementation of the Ajax library from Chapter 12
 */

const Ajax = {};

(function () {
  /**
   * Ajax.noop
   */
  Ajax.noop = function () { /* noop */ }

  /**
   * Ajax.create
   */
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

  /* Do not continue if there is not Ajax.create function */
  if (!Ajax.create) return null

  /**
   * Ajax.request
   */
  Ajax.request = (function () {
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
  })()

  /**
   * Ajax.get
   */
  Ajax.get = function (url, options) {
    const _options = tddjs.extend({}, options)
    _options.method = 'GET'
    Ajax.request(url, _options)
  }

  /**
   * Ajax.post
   */
  Ajax.post = function (url, options) {
    const _options = tddjs.extend({}, options)
    _options.method = 'POST'
    Ajax.request(url, _options)
  }

  /**
   * Ajax.poller
   */
  Ajax.poller = {
    start () {
      const poller = this

      if (!poller.url) {
        throw new TypeError('Must specify URL to poll.')
      }

      let interval = 1000

      if (typeof poller.interval === 'number') {
        interval = poller.interval
      }

      // used as cache buster too
      const requestStart = new Date().getTime()

      let queryParams = `ts=${requestStart}`

      if (poller.url.includes('?')) {
        queryParams = `&${queryParams}`
      } else {
        queryParams = `?${queryParams}`
      }

      Ajax.request(`${poller.url}${queryParams}`, {
        headers: poller.headers,
        success: poller.success,
        failure: poller.failure,
        complete: function () {
          const elapsed = new Date().getTime() - requestStart

          const remaining = interval - elapsed

          setTimeout(function () {
            poller.start()
          }, Math.max(0, remaining))

          if (typeof poller.complete === 'function') {
            poller.complete()
          }
        }
      })
    }
  }

  /**
   * Ajax.poll
   */
  Ajax.poll = function (url, options) {
    const poller = Object.create(Ajax.poller)
    const _options = options || {}

    poller.url = url
    poller.method = _options.method
    poller.headers = _options.headers
    poller.interval = _options.interval
    poller.success = _options.success
    poller.failure = _options.failure
    poller.complete = _options.complete
    poller.start()

    return poller
  }
})()

window.Ajax = Ajax
