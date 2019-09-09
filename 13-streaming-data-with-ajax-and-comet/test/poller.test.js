const assert = require('assert')
const sinon = require('sinon')

const { assertIsObject, assertIsFunction, assertIsFalse } = require('../../lib/assertions')
const { stubFn } = require('../../lib/stub')
const fakeXHR = require('../../lib/fakes/xhr.fake')
const ajax = require('../../12-abstracting-browsers-differences/src/ajax')

describe('Chapter 13', () => {
  describe('setTimeout - example tests', () => {
    beforeEach(() => {
      this.setTimeout = global.setTimeout
    })

    afterEach(() => {
      global.setTimeout = this.setTimeout
    })

    it('should call setTimeout', () => {
      global.setTimeout = stubFn()

      setTimeout(() => {
        console.log('do something...')
      }, 1000)

      assert(global.setTimeout.called)
    })
  })

  describe('Poller - unit test', () => {
    beforeEach(() => {
      this.ajaxCreate = ajax.create
      this.xhr = Object.create(fakeXHR)
      ajax.create = stubFn(this.xhr)
    })

    afterEach(() => {
      ajax.create = this.ajaxCreate
    })

    it('should should be an object', () => {
      assertIsObject(ajax.poller)
    })

    it('should define a `start` method', () => {
      assertIsFunction(ajax.poller.start)
    })

    describe('start - method', () => {
      let clock

      beforeEach(() => {
        clock = sinon.useFakeTimers()
        this.poller = Object.create(ajax.poller)
        this.poller.url = '/url'
      })

      afterEach(() => {
        clock.restore()
      })

      it('should throw an exception when url is no defined', () => {
        delete this.poller.url
        assert.throws(() => {
          this.poller.start()
        }, /TypeError/)
      })

      it('should make the XHR request with the url', () => {
        const expectedArgs = ['GET', '/url', true]

        this.poller.start()

        assert(this.xhr.open.called)
        assert.deepStrictEqual(this.xhr.open.args, expectedArgs)
        assert(this.xhr.send.called)
      })

      it('should schedule new request when complete', () => {
        this.poller.start() // first time send is called

        assert(this.xhr.send.called)

        this.xhr.complete() // simulate completion
        this.xhr.send = stubFn() // new stub for a second call to send

        clock.tick(1001)

        assert(this.xhr.send.called)
      })

      it('should not make new request until 1000ms passed', () => {
        this.poller.start()
        this.xhr.complete()
        this.xhr.send = stubFn()

        clock.tick(999)
        assertIsFalse(this.xhr.send.called)
      })

      it('should configure request interval', () => {
        this.poller.interval = 350
        this.poller.start()
        this.xhr.complete()
        this.xhr.send = stubFn()

        clock.tick(349)
        assertIsFalse(this.xhr.send.called)
        clock.tick(1)
        assert(this.xhr.send.called)
      })

      it('should pass headers to request', () => {
        const expectedHeaders = {
          'Header 1': '1',
          'Header 2': '2'
        }
        this.poller.headers = Object.assign({}, expectedHeaders)
        this.poller.start()

        assert.strictEqual(this.xhr.headers['Header 1'], expectedHeaders['Header 1'])
        assert.strictEqual(this.xhr.headers['Header 2'], expectedHeaders['Header 2'])
      })

      it('should pass success callback', () => {
        this.poller.success = stubFn()
        this.poller.start()
        this.xhr.complete()

        assert(this.poller.success.called)
      })

      it('should pass failure callback', () => {
        this.poller.failure = stubFn()
        this.poller.start()
        this.xhr.complete(400)

        assert(this.poller.failure.called)
      })

      it('should pass complete callback', () => {
        this.poller.complete = stubFn()
        this.poller.start()
        this.xhr.complete(400)

        assert(this.poller.complete.called)
      })
    })
  })

  describe('Ajax.poll - unit test', () => {
    beforeEach(() => {
      this.request = ajax.request
      ajax.request = stubFn()
      this.create = Object.create
    })

    afterEach(() => {
      ajax.request = this.request
      Object.create = this.create
    })

    it('should call start on poller object', () => {
      const poller = { start: stubFn() }

      Object.create = stubFn(poller)

      ajax.poll('/url')

      assert(poller.start.called)
    })

    it('should set url property on poller object', () => {
      const poller = ajax.poll('/url')

      assert.strictEqual(poller.url, '/url')
    })

    it('should set the headers on poller object', () => {
      const headers = {
        'Header 1': '1',
        'Header 2': '2'
      }
      const poller = ajax.poll('/url', {
        headers: Object.assign({}, headers)
      })

      assert.strictEqual(poller.headers['Header 1'], headers['Header 1'])
      assert.strictEqual(poller.headers['Header 2'], headers['Header 2'])
    })

    it('should set the interval on poller object', () => {
      const interval = 500
      const poller = ajax.poll('/url', { interval })

      assert.strictEqual(poller.interval, interval)
    })

    it('should set the callbacks on poller object', () => {
      const success = stubFn()
      const failure = stubFn()
      const complete = stubFn()

      const poller = ajax.poll('/url', {
        success,
        failure,
        complete
      })

      assert.strictEqual(poller.success, success)
      assert.strictEqual(poller.failure, failure)
      assert.strictEqual(poller.complete, complete)
    })
  })
})
