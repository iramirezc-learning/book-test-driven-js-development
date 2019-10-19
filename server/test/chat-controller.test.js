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
    const res = this.res = { writeHead: stubFn(), end: stubFn() }
    this.controller = chatController.create(req, res)
    this.controller.chatRoom = { addMessage: stubFn() }
    this.jsonParse = JSON.parse
    this.sendRequest = sendRequest
  }

  const controllerAfterEach = () => {
    JSON.parse = this.jsonParse
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

    it('should write the status header', done => {
      const data = {
        data: {
          user: 'isaac',
          message: 'hi!'
        }
      }

      this.controller.post()
      this.sendRequest(data)

      assert(this.controller.response.writeHead.called)
      assert.strictEqual(this.controller.response.writeHead.args[0], 201)
      done()
    })

    it('should close the connection', done => {
      const data = {
        data: {
          user: 'Nahum',
          message: 'hi1'
        }
      }

      this.controller.post()
      this.sendRequest(data)

      assert(this.controller.response.end.called)
      done()
    })
  })
})
