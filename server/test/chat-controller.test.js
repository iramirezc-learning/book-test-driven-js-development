const assert = require('assert')
const EventEmitter = require('events').EventEmitter

const { assertIsObject, assertIsFunction } = require('../../lib/assertions')
const chatController = require('../src/chat-controller')
const { stubFn } = require('../../lib/stub')

describe('Chat controller - Unit Tests', () => {
  const sendRequest = (data) => {
    const str = encodeURI(JSON.stringify(data))
    this.req.emit('data', Buffer.from(str.substring(0, str.length / 2)))
    this.req.emit('data', Buffer.from(str.substring(str.length / 2)))
    this.req.emit('end')
  }

  const controllerBeforeEach = () => {
    const req = this.req = new EventEmitter()
    req.headers = { 'x-access-token': '' }
    const res = this.res = { writeHead: stubFn(), write: stubFn(), end: stubFn() }
    this.controller = chatController.create(req, res)
    this.addMessagePromise = {
      resolve: stubFn(),
      reject: stubFn()
    }
    this.waitMessagePromise = {
      resolve: stubFn(),
      reject: stubFn()
    }

    const addPromise = new Promise((resolve, reject) => {
      this.addMessagePromise.resolve = resolve
      this.addMessagePromise.reject = reject
    })

    const waitPromise = new Promise((resolve, reject) => {
      this.waitMessagePromise.resolve = resolve
      this.waitMessagePromise.reject = reject
    })

    this.controller.chatRoom = {
      addMessage: stubFn(addPromise),
      waitForMessagesSince: stubFn(waitPromise)
    }
    this.jsonParse = JSON.parse
    this.jsonStringify = JSON.stringify
    this.sendRequest = sendRequest
  }

  const controllerAfterEach = () => {
    JSON.parse = this.jsonParse
    JSON.stringify = this.jsonStringify
  }

  describe('module initialization', () => {
    it('should be an object', () => {
      assertIsObject(chatController)
    })

    it('should expose methods', () => {
      assertIsFunction(chatController.create)
      assertIsFunction(chatController.post)
    })
  })

  describe('create method', () => {
    beforeEach(controllerBeforeEach)

    it('should return an object with "request" and "response"', () => {
      assert.strictEqual(Object.getPrototypeOf(this.controller), chatController)
      assert.strictEqual(this.controller.request, this.req)
      assert.strictEqual(this.controller.response, this.res)
    })
  })

  describe('respond method', () => {
    beforeEach(controllerBeforeEach)
    afterEach(controllerAfterEach)

    it('should write status code', done => {
      this.controller.respond(201)

      assert(this.res.writeHead.called)
      assert.strictEqual(this.res.writeHead.args[0], 201)
      done()
    })

    it('should end the connection', done => {
      this.controller.respond(200)

      assert(this.res.end.called)
      done()
    })

    it('should encode the data as json', done => {
      const data = { some: { data: true } }
      const dataAsString = JSON.stringify(data)

      JSON.stringify = stubFn(dataAsString)

      this.controller.respond(200, data)

      assert(JSON.stringify.called)
      assert.strictEqual(JSON.stringify.args[0], data)
      done()
    })

    it('it call write with the encoded data', done => {
      const data = {
        some: { data: true }
      }
      const encoded = JSON.stringify(data)

      this.controller.respond(200, data)

      assert(this.res.write.called)
      assert.strictEqual(this.res.write.args[0], encoded)
      done()
    })

    it('should set the content-type as application/json', done => {
      this.controller.respond(200)

      assert.strictEqual(this.res.writeHead.args[1]['Content-Type'], 'application/json')
      done()
    })

    it('should set the content-length with the encoded data length', done => {
      const data = {
        some: { data: true }
      }
      const encoded = JSON.stringify(data)

      this.controller.respond(200, data)

      assert.strictEqual(this.res.writeHead.args[1]['Content-Length'], encoded.length)

      done()
    })
  })

  describe('post method', () => {
    beforeEach(controllerBeforeEach)
    afterEach(controllerAfterEach)

    it('should parse request body as json', (done) => {
      const data = {
        data: {
          user: 'isaac',
          message: 'hi!'
        }
      }

      JSON.parse = stubFn(data)

      this.controller.post()
      this.sendRequest(data)

      assert.strictEqual(JSON.parse.args[0], JSON.stringify(data))

      done()
    })

    it('should add message to chatroom from request body', done => {
      const data = {
        data: {
          user: 'isaac',
          message: "<script>window.location = 'http://hacked';</script>" // this should be fixed
        }
      }

      this.controller.post()
      this.sendRequest(data)

      assert(this.controller.chatRoom.addMessage.called)

      const args = this.controller.chatRoom.addMessage.args

      assert.strictEqual(args[0], data.data.user)
      assert.strictEqual(args[1], data.data.message)

      done()
    })

    it('should write the status header to 201 when addMessage resolves', done => {
      const data = {
        data: {
          user: 'isaac',
          message: 'hi!'
        }
      }

      this.controller.post()
      this.sendRequest(data)
      this.addMessagePromise.resolve({})

      setTimeout(() => {
        assert(this.controller.response.writeHead.called)
        assert.strictEqual(this.controller.response.writeHead.args[0], 201)
        done()
      }, 0)
    })

    it('should close the connection when addMessage resolves', done => {
      const data = {
        data: {
          user: 'Nahum',
          message: 'hi1'
        }
      }

      this.controller.post()
      this.sendRequest(data)
      this.addMessagePromise.resolve({})

      setTimeout(() => {
        assert(this.controller.response.end.called)
        done()
      }, 0)
    })

    it('should not respond immediately', (done) => {
      this.controller.post()
      this.sendRequest({ data: {} })

      assert.strictEqual(this.controller.response.end.called, false)
      done()
    })

    it('should write head with status 500 if there is an error', done => {
      this.controller.post()
      this.sendRequest({ data: {} })
      this.addMessagePromise.reject(new Error('fake error'))

      setTimeout(() => {
        assert(this.controller.response.writeHead.called)
        assert.strictEqual(this.controller.response.writeHead.args[0], 500)
        done()
      }, 0)
    })

    it('should close the connection when addMessage rejects', done => {
      this.controller.post()
      this.sendRequest({ data: {} })
      this.addMessagePromise.reject(new Error('fake error'))

      setTimeout(() => {
        assert(this.controller.response.end.called)
        done()
      }, 0)
    })
  })

  describe('get method', () => {
    beforeEach(controllerBeforeEach)
    afterEach(controllerAfterEach)

    it('should wait for any message', done => {
      this.req.headers = {
        'x-access-token': ''
      }
      const chatRoom = this.controller.chatRoom

      this.controller.get()

      assert(chatRoom.waitForMessagesSince.called)
      assert.strictEqual(chatRoom.waitForMessagesSince.args[0], 0)
      done()
    })

    it('should wait for messages since X-Access-Token', done => {
      this.req.headers = {
        'x-access-token': '2'
      }

      const chatRoom = this.controller.chatRoom

      this.controller.get()

      assert(chatRoom.waitForMessagesSince.called)
      assert.strictEqual(chatRoom.waitForMessagesSince.args[0], 2)
      done()
    })

    it('should respond with formatted data', done => {
      this.controller.respond = stubFn()

      const messages = [{
        user: 'isaac',
        message: 'hi'
      }]

      this.waitMessagePromise.resolve(messages)

      this.controller.get()

      setTimeout(() => {
        assert(this.controller.respond.called)
        const args = this.controller.respond.args
        assert.strictEqual(args[0], 201)
        assert.strictEqual(args[1].message, messages)
        done()
      }, 0)
    })

    it('should include token in response', done => {
      this.controller.respond = stubFn()
      this.waitMessagePromise.resolve([
        { id: 24 },
        { id: 25 }
      ])

      this.controller.get()

      setTimeout(() => {
        assert.strictEqual(this.controller.respond.args[1].token, 25)
        done()
      }, 0)
    })
  })
})
