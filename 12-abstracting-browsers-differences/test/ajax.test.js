const assert = require('assert')

const { assertIsNumber, assertIsFunction } = require('../../lib/assertions')
const { stubFn } = require('../../lib/stub')
const fakeXHR = require('../../lib/fakes/xhr.fake')
const tddjs = require('../../lib/tddjs')
const ajax = require('../src/ajax')

function forceStatusAndReadyState ({ url = '/url', xhr, status = 200, readyState = 4 }) {
  const success = stubFn()
  const failure = stubFn()

  ajax.get(url, { success, failure })

  xhr.status = status
  xhr.readyStateChange(readyState)

  return {
    success: success.called,
    failure: failure.called
  }
}

describe('Chapter 12', () => {
  describe('AJAX - unit test', () => {
    describe('get request - method', () => {
      beforeEach(() => {
        this.xhr = Object.create(fakeXHR)
        this.ajaxCreate = ajax.create // backup original
        ajax.create = stubFn(this.xhr) // replace original
        this.isLocal = tddjs.isLocal
      })

      afterEach(() => {
        ajax.create = this.ajaxCreate // restore original
        tddjs.isLocal = this.isLocal
      })

      it('should define the get method', () => {
        assertIsFunction(ajax.get)
      })

      it('should throw an error when url is not provided', () => {
        assert.throws(() => {
          ajax.get()
        }, /TypeError/)
      })

      it('should obtain an XMLHttpRequest object', () => {
        ajax.get('/url')

        assert(ajax.create.called)
      })

      it('should call open method with method name, url and async params', () => {
        const url = '/url'

        ajax.get(url)

        assert.deepStrictEqual(this.xhr.open.args, ['GET', url, true])
      })

      it('should add onreadystatechange handler', () => {
        ajax.get('/url')

        assertIsFunction(this.xhr.onreadystatechange)
      })

      it('should call send', () => {
        ajax.get('/url')

        assert(this.xhr.send.called)
      })

      it('should pass null as argument to send', () => {
        ajax.get('/url')

        assert.strictEqual(this.xhr.send.args[0], null)
      })

      it('should call success handler for local request', () => {
        tddjs.isLocal = stubFn(true)

        const request = forceStatusAndReadyState({ url: 'file.html', xhr: this.xhr, status: 0, readyState: 4 })

        assert(request.success)
      })

      describe('onreadystatechange handler', () => {
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

          ajax.get('/url')

          assert.doesNotThrow(() => {
            this.xhr.onreadystatechange()
          })
        })

        it('should call failure function when is not success', () => {
          const request = forceStatusAndReadyState({ xhr: this.xhr, status: 300 })

          assert(request.failure)
        })

        it('should reset onreadystatechange when complete', () => {
          forceStatusAndReadyState({ xhr: this.xhr })
          assert.strictEqual(this.xhr.onreadystatechange, ajax.noop)
        })
      })
    })
  })

  describe('create - method', () => {
    it('should return an XMLHttpRequest object', () => {
      const xhr = ajax.create()

      assertIsNumber(xhr.readyState)
      assert(tddjs.isHostMethod(xhr, 'open'))
      assert(tddjs.isHostMethod(xhr, 'send'))
      assert(tddjs.isHostMethod(xhr, 'setRequestHeader'))
    })
  })
})
