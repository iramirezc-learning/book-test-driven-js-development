const assert = require('assert')

const { assertIsFunction } = require('../assertions')
const { stubFn } = require('../stub')
const tddjs = require('../tddjs')
const Ajax = require('../ajax')
const fakeXHR = require('../fakes/xhr.fake')

describe('Ajax.request - unit tests', () => {
  function forceStatusAndReadyState ({ url = '/url', xhr, status = 200, readyState = 4 }) {
    const success = stubFn()
    const failure = stubFn()
    const complete = stubFn()

    Ajax.request(url, { success, failure, complete })

    xhr.status = status
    xhr.readyStateChange(readyState)

    return {
      success: success.called,
      failure: failure.called,
      complete: complete.called
    }
  }

  beforeEach(() => {
    this.xhr = Object.create(fakeXHR)
    this.ajaxCreate = Ajax.create // backup original
    Ajax.create = stubFn(this.xhr) // replace original
    this.isLocal = tddjs.isLocal
    this.urlParams = tddjs.urlParams
  })

  afterEach(() => {
    Ajax.create = this.ajaxCreate // restore original
    tddjs.isLocal = this.isLocal
    tddjs.urlParams = this.urlParams
  })

  it('should define the `request` method', () => {
    assertIsFunction(Ajax.request)
  })

  it('should use the specified method', () => {
    Ajax.request('/url', { method: 'POST' })
    assert.strictEqual(this.xhr.open.args[0], 'POST')
  })

  it('should throw an error when url is not provided', () => {
    assert.throws(() => { Ajax.request() }, /TypeError/)
  })

  it('should obtain an XMLHttpRequest object', () => {
    Ajax.request('/url')
    assert(Ajax.create.called)
  })

  it('should call open method with method name, url and async params', () => {
    const url = '/url'

    Ajax.request(url)
    assert.deepStrictEqual(this.xhr.open.args, ['GET', url, true])
  })

  it('should add onreadystatechange handler', () => {
    Ajax.request('/url')
    assertIsFunction(this.xhr.onreadystatechange)
  })

  it('should call send', () => {
    Ajax.request('/url')
    assert(this.xhr.send.called)
  })

  it('should pass null as argument to send', () => {
    Ajax.request('/url')
    assert.strictEqual(this.xhr.send.args[0], null)
  })

  it('should encode params', () => {
    const data = { a: 1, b: 2 }

    tddjs.urlParams = stubFn()
    Ajax.request('/url', { data, method: 'POST' })

    assert.strictEqual(tddjs.urlParams.args[0], data)
  })

  it('should send data with send() for POST', () => {
    const data = { a: 1, b: 2, c: 3 }
    const expected = tddjs.urlParams(data)

    Ajax.request('/url', { data, method: 'POST' })

    assert.strictEqual(this.xhr.send.args[0], expected)
  })

  it('should send data on URL for GET', () => {
    const url = '/url'
    const data = { a: 1, b: 2, c: 3 }
    const expected = `${url}?${tddjs.urlParams(data)}`

    Ajax.request(url, { data, method: 'GET' })

    assert.strictEqual(this.xhr.open.args[1], expected)
  })

  it('should concatenate data on existing params in the URL for GET', () => {
    const url = '/url?a=1&b=2'
    const data = { c: 3, d: 4 }
    const expected = `${url}&${tddjs.urlParams(data)}`

    Ajax.request(url, { data, method: 'GET' })

    assert.strictEqual(this.xhr.open.args[1], expected)
  })

  it('should set `X-Requested-With` as default header', () => {
    const expectedHeaders = {
      'X-Requested-With': 'XMLHttpRequest'
    }
    Ajax.request('/url')

    assert.deepStrictEqual(this.xhr.headers, expectedHeaders)
  })

  it('should set Content-Type & Content-Length headers when method is POST', () => {
    const data = { a: 1, b: 2, c: 3, d: 4 }
    const expectedHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': tddjs.urlParams(data).length
    }

    Ajax.request('/url', { data, method: 'POST' })

    assert.deepStrictEqual(this.xhr.headers, expectedHeaders)
  })

  it('should set the headers correctly', () => {
    const headers = {
      Authorization: 'Basic XXX',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
    Ajax.request('/url', { headers })

    assert.deepStrictEqual(this.xhr.headers, headers)
  })

  describe('onreadystatechange handler', () => {
    it('should call success handler for local request', () => {
      tddjs.isLocal = stubFn(true)

      const request = forceStatusAndReadyState({ url: 'file.html', xhr: this.xhr, status: 0, readyState: 4 })

      assert(request.success)
    })

    it('should call success handler for status 200', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr })

      assert(request.success)
    })

    it('should call success handler for all status code between 200 and 300', () => {
      const requests = []

      for (let status = 200; status < 300; status++) {
        requests.push(forceStatusAndReadyState({ xhr: this.xhr, status }))
      }

      assert(requests.every(req => req.success))
    })

    it('should call success handler for status 304 (Not Modified)', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr, status: 304 })

      assert(request.success)
    })

    it('should not throw when called with no success callback', () => {
      this.xhr.readyState = 4
      this.xhr.status = 200

      Ajax.request('/url')
      assert.doesNotThrow(() => { this.xhr.onreadystatechange() })
    })

    it('should call failure function when request is not success', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr, status: 300 })

      assert.strictEqual(request.success, false)
      assert(request.failure)
    })

    it('should reset onreadystatechange when complete', () => {
      forceStatusAndReadyState({ xhr: this.xhr })
      assert.strictEqual(this.xhr.onreadystatechange, Ajax.noop)
    })
  })

  describe('ready state handler #chapter-13', () => {
    it('should call complete handler for status 200', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr, status: 200, readyState: 4 })

      assert(request.complete)
    })

    it('should call complete handler for status 400', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr, status: 400, readyState: 4 })

      assert(request.complete)
    })

    it('should call complete handler for status 0', () => {
      const request = forceStatusAndReadyState({ xhr: this.xhr, status: 0, readyState: 4 })

      assert(request.complete)
    })
  })
})
