const assert = require('assert')

const { stubFn } = require('../stub')
const Ajax = require('../ajax')

describe('Ajax.poll - unit tests', () => {
  beforeEach(() => {
    this.request = Ajax.request
    Ajax.request = stubFn()
    this.create = Object.create
  })

  afterEach(() => {
    Ajax.request = this.request
    Object.create = this.create
  })

  it('should call start on poller object', () => {
    const poller = { start: stubFn() }

    Object.create = stubFn(poller)

    Ajax.poll('/url')

    assert(poller.start.called)
  })

  it('should set url property on poller object', () => {
    const poller = Ajax.poll('/url')

    assert.strictEqual(poller.url, '/url')
  })

  it('should set the headers on poller object', () => {
    const headers = {
      'Header 1': '1',
      'Header 2': '2'
    }
    const poller = Ajax.poll('/url', {
      headers: Object.assign({}, headers)
    })

    assert.strictEqual(poller.headers['Header 1'], headers['Header 1'])
    assert.strictEqual(poller.headers['Header 2'], headers['Header 2'])
  })

  it('should set the interval on poller object', () => {
    const interval = 500
    const poller = Ajax.poll('/url', { interval })

    assert.strictEqual(poller.interval, interval)
  })

  it('should set the callbacks on poller object', () => {
    const success = stubFn()
    const failure = stubFn()
    const complete = stubFn()

    const poller = Ajax.poll('/url', {
      success,
      failure,
      complete
    })

    assert.strictEqual(poller.success, success)
    assert.strictEqual(poller.failure, failure)
    assert.strictEqual(poller.complete, complete)
  })
})
