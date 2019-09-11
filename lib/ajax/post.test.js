const assert = require('assert')

const { stubFn } = require('../stub')
const Ajax = require('../ajax')

describe('Ajax.post - unit tests', () => {
  beforeEach(() => {
    this.ajaxRequest = Ajax.request // backup original
  })

  afterEach(() => {
    Ajax.request = this.ajaxRequest // restore original
  })

  it('should call request with POST method', () => {
    Ajax.request = stubFn()
    Ajax.post('/url')
    assert.strictEqual(Ajax.request.args[1].method, 'POST')
  })
})
