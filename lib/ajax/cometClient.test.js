const assert = require('assert')
const sinon = require('sinon')

const { assertIsObject, assertIsFunction, assertIsFalse } = require('../assertions')
const { stubFn } = require('../stub')
const fakeXHR = require('../fakes/xhr.fake')
const Ajax = require('../ajax')

describe('Ajax.cometClient - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(Ajax.cometClient)
  })

  it('should have a dispatch method', () => {
    assertIsFunction(Ajax.cometClient.dispatch)
  })

  describe('Ajax.cometClient.dispatch', () => {
    beforeEach(() => {
      this.client = Object.create(Ajax.cometClient)
      this.client.observers = { notify: stubFn() }
    })

    it('should notify observers', () => {
      this.client.dispatch({ someEvent: [{ id: 1234 }] })

      const args = this.client.observers.notify.args

      assert(this.client.observers.notify.called)
      assert.strictEqual('someEvent', args[0])
      assert.deepStrictEqual({ id: 1234 }, args[1])
    })

    it('should notify all topics and all events to observers', () => {
      const topicsNotified = []
      const eventsNotified = []
      const expectedTopics = ['someEvent', 'someEvent', 'otherEvent', 'otherEvent']
      const expectedEvents = [{ id: 1234 }, { id: 5678 }, { name: 'test' }, { name: 'tdd' }]

      this.client.observers.notify = (topic, event) => {
        topicsNotified.push(topic)
        eventsNotified.push(event)
      }

      this.client.dispatch({
        someEvent: [{ id: 1234 }, { id: 5678 }],
        otherEvent: [{ name: 'test' }, { name: 'tdd' }]
      })

      assert.deepStrictEqual(topicsNotified, expectedTopics)
      assert.deepStrictEqual(eventsNotified, expectedEvents)
    })

    it('should not throw if no observers', () => {
      this.client.observers = null

      assert.doesNotThrow(() => {
        this.client.dispatch({ someEvent: [{}] })
      })
    })

    it('should not throw if notify is undefined', () => {
      this.client.observers = { notify: undefined }

      assert.doesNotThrow(() => {
        this.client.dispatch({ someEvent: [{}] })
      })
    })

    it('should not throw if data is not provided', () => {
      assert.doesNotThrow(() => {
        this.client.dispatch()
      })
    })

    it('should not throw if event is null', () => {
      assert.doesNotThrow(() => {
        this.client.dispatch({ myEvent: null })
      })
    })
  })

  describe('Ajax.cometClient.observe', () => {
    beforeEach(() => {
      this.client = Object.create(Ajax.cometClient)
    })

    it('should remember observers', () => {
      const observers = [stubFn(), stubFn()]

      this.client.observe('myEvent', observers[0])
      this.client.observe('myEvent', observers[1])

      const data = { myEvent: [{}] }

      this.client.dispatch(data)

      assert(observers[0].called)
      assert.strictEqual(data.myEvent[0], observers[0].args[0])
      assert(observers[1].called)
      assert.strictEqual(data.myEvent[0], observers[1].args[0])
    })

    it('should only call the observer subscribed to the topic myEvent', () => {
      const observers = [stubFn(), stubFn()]

      this.client.observe('myEvent', observers[0])
      this.client.observe('otherEvent', observers[1])

      const data = { myEvent: [{}] }

      this.client.dispatch(data)

      assert(observers[0].called)
      assert.strictEqual(data.myEvent[0], observers[0].args[0])
      assertIsFalse(observers[1].called)
    })

    it('should only call the observer subscribed to the topic otherEvent', () => {
      const observers = [stubFn(), stubFn()]

      this.client.observe('myEvent', observers[0])
      this.client.observe('otherEvent', observers[1])

      const data = { otherEvent: [{}] }

      this.client.dispatch(data)

      assertIsFalse(observers[0].called)
      assert(observers[1].called)
      assert.strictEqual(data.otherEvent[0], observers[1].args[0])
    })
  })

  describe('Ajax.cometClient.connect', () => {
    beforeEach(() => {
      this.client = Object.create(Ajax.cometClient)
      this.client.url = '/url'
      this.ajaxPoll = Ajax.poll
      this.xhr = Object.create(fakeXHR)
      this.ajaxCreate = Ajax.create
      Ajax.create = stubFn(this.xhr)
      this.clock = sinon.useFakeTimers(new Date())
    })

    afterEach(() => {
      Ajax.poll = this.ajaxPoll
      Ajax.create = this.ajaxCreate
      this.clock.restore()
    })

    it('should start polling', () => {
      Ajax.poll = stubFn({})
      this.client.connect()

      assert(Ajax.poll.called)
      assert.strictEqual('/url', Ajax.poll.args[0])
    })

    it('should not connect if connected already', () => {
      Ajax.poll = stubFn({})
      this.client.connect()
      Ajax.poll = stubFn({})
      this.client.connect()

      assertIsFalse(Ajax.poll.called)
    })

    it('should throw error if no url exists', () => {
      const client = Object.create(Ajax.cometClient)

      Ajax.poll = stubFn({})

      assert.throws(() => {
        client.connect()
      }, /TypeError/)
    })

    it('should dispatch data from request', () => {
      const data = {
        topic: [{ id: 1234 }],
        otherTopic: [{ name: 'Me' }]
      }

      this.client.dispatch = stubFn()
      this.client.connect()
      this.xhr.complete(200, JSON.stringify(data))

      assert(this.client.dispatch.called)
      assert.deepStrictEqual(this.client.dispatch.args[0], data)
    })

    it('should not dispatch badly formed data', () => {
      this.client.dispatch = stubFn()
      this.client.connect()
      this.xhr.complete(200, 'OK')

      assertIsFalse(this.client.dispatch.called)
    })

    it('should provide Access Token header', () => {
      this.client.connect()

      assert.strictEqual(this.xhr.headers['X-Access-Token'], '')
    })

    it('should pass token on following request', () => {
      this.client.connect()

      const data = { token: 123456789 }

      this.xhr.complete(200, JSON.stringify(data))
      this.clock.tick(1000)

      const headers = this.xhr.headers

      assert.strictEqual(headers['X-Access-Token'], data.token)
    })

    it('should not send the token to the dispatch function', () => {
      const data = {
        token: 123456789,
        topic: [{ id: 1234 }],
        otherTopic: [{ name: 'Me' }]
      }

      const expectedData = {
        topic: data.topic,
        otherTopic: data.otherTopic
      }

      this.client.dispatch = stubFn()
      this.client.connect()
      this.xhr.complete(200, JSON.stringify(data))

      assert(this.client.dispatch.called)
      assert.deepStrictEqual(this.client.dispatch.args[0], expectedData)
    })

    it('should rewrite the token if server fails to send it', () => {
      const data = {
        token: 123456789
      }

      // first call
      this.client.connect()
      this.xhr.complete(200, JSON.stringify(data))
      this.clock.tick(1000)

      const headers = this.xhr.headers

      assert.strictEqual(headers['X-Access-Token'], data.token)

      // second call
      this.client.connect()
      this.xhr.complete(200, JSON.stringify({}))
      this.clock.tick(1000)

      assert.strictEqual(headers['X-Access-Token'], data.token)
    })
  })

  describe('Ajax.cometClient.notify', () => {
    beforeEach(() => {
      this.client = Object.create(Ajax.cometClient)
      this.client.url = '/url'
      this.ajaxPost = Ajax.post
      Ajax.post = stubFn()
    })

    afterEach(() => {
      Ajax.post = this.ajaxPost
    })

    it('should call Ajax.post', () => {
      this.client.notify('event', {})

      assert(Ajax.post.called)
    })

    it('should call Ajax.post with the client.url', () => {
      this.client.notify('event', {})

      assert(Ajax.post.args[0], this.client.url)
    })

    it('should throw if not url is provided', () => {
      const client = Object.create(Ajax.cometClient)

      assert.throws(() => {
        client.notify('event', {})
      }, /TypeError/)
    })

    it('should throw if "data" is not provided', () => {
      assert.throws(() => {
        this.client.notify('event')
      }, /TypeError/)
    })

    it('should call post with the correct data', () => {
      const topic = 'event'
      const data = { id: 12345 }
      const expected = JSON.stringify({ topic, data })

      this.client.notify(topic, data)

      assert.deepStrictEqual(Ajax.post.args[1].data, expected)
    })
  })
})
