const assert = require('assert')
const EventEmitter = require('events').EventEmitter

const { assertIsObject, assertIsNumber, assertIsArray, assertIsFunction } = require('../../lib/assertions')
const chatRoom = require('../src/chat-room')
const { stubFn } = require('../../lib/stub')

describe('Chat room - Unit Tests', () => {
  beforeEach(() => {
    this.consoleLog = console.log
    console.log = stubFn()
    this.room = Object.create(chatRoom)
  })

  afterEach(() => {
    console.log = this.consoleLog
  })

  it('should be an EventEmitter', () => {
    assert(this.room instanceof EventEmitter)
    assertIsFunction(this.room.addListener)
    assertIsFunction(this.room.emit)
  })

  describe('addMessage', () => {
    it('should return a promise', (done) => {
      const result = this.room.addMessage('Isaac', 'message')

      assert(result instanceof Promise)
      assertIsFunction(result.then)
      done()
    })

    it('should require username', (done) => {
      this.room.addMessage(null, 'a message')
        .then(() => { }, (err) => {
          assert(err instanceof TypeError)
          done()
        })
        .catch(done)
    })

    it('should require a message', (done) => {
      this.room.addMessage('Isaac', null)
        .then(() => { }, (err) => {
          assert(err instanceof TypeError)
          done()
        })
        .catch(done)
    })

    it('should call callback with new object', (done) => {
      const txt = 'some message'

      this.room.addMessage('isaac', txt)
        .then((msg) => {
          assertIsObject(msg)
          assertIsNumber(msg.id)
          assert.strictEqual(msg.message, txt)
          assert.strictEqual(msg.user, 'isaac')
          done()
        })
        .catch(done)
    })

    it('should assign unique ids to messages', (done) => {
      Promise.all([
        this.room.addMessage('isaac', 'msg1'),
        this.room.addMessage('nahum', 'msg2')
      ])
        .then((msgs) => {
          assert.notStrictEqual(msgs[0].id, msgs[1].id)
          assert.strictEqual(msgs[0].message, 'msg1')
          assert.strictEqual(msgs[1].message, 'msg2')
          done()
        })
        .catch(done)
    })

    it('should emit a "message" event', (done) => {
      let message

      this.room.addListener('message', (m) => {
        message = m
      })

      this.room.addMessage('Isaac', 'Hello')
        .then(msg => {
          assert.deepStrictEqual(message, msg)
          done()
        })
        .catch(done)
    })
  })

  describe('getMessagesSince', () => {
    it('should return an empty array when no messages', (done) => {
      this.room.getMessagesSince(0)
        .then((msgs) => {
          assertIsArray(msgs)
          assert.deepStrictEqual(msgs, [])
          done()
        })
        .catch(done)
    })

    it('should get messages since given id', (done) => {
      const user = 'Isaac'

      Promise.all([
        this.room.addMessage(user, 'msg1'),
        this.room.addMessage(user, 'msg2')
      ])
        .then((msgx) => {
          const [msg1, msg2] = msgx
          this.room.getMessagesSince(msg1.id)
            .then((msgs) => {
              assertIsArray(msgs)
              assert.deepStrictEqual(msgs, [msg2])
              done()
            })
        })
        .catch(done)
    })

    it('should get messages all messages if id provided is 0', (done) => {
      const user = 'Isaac'

      Promise.all([
        this.room.addMessage(user, 'msg1'),
        this.room.addMessage(user, 'msg2')
      ])
        .then((msgx) => {
          const [msg1, msg2] = msgx

          this.room.getMessagesSince(0)
            .then((msgs) => {
              assertIsArray(msgs)
              assert.strictEqual(msgs.length, 2)
              assert.deepStrictEqual(msgs, [msg1, msg2])
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should return an empty array if id does not exist', (done) => {
      const user = 'Isaac'

      Promise.all([
        this.room.addMessage(user, 'msg1'),
        this.room.addMessage(user, 'msg2')
      ])
        .then((msgx) => {
          this.room.getMessagesSince(3)
            .then((msgs) => {
              assertIsArray(msgs)
              assert.deepStrictEqual(msgs, [])
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should return an array with all messages if id is not provided', (done) => {
      const user = 'Isaac'

      Promise.all([
        this.room.addMessage(user, 'msg1'),
        this.room.addMessage(user, 'msg2')
      ])
        .then((msgx) => {
          const [msg1, msg2] = msgx
          this.room.getMessagesSince()
            .then(msgs => {
              assertIsArray(msgs)
              assert.deepStrictEqual(msgs, [msg1, msg2])
              done()
            })
            .catch(done)
        })
        .catch(done)
    })

    it('should return an array with all messages if id is invalid', (done) => {
      const user = 'Isaac'

      Promise.all([
        this.room.addMessage(user, 'msg1'),
        this.room.addMessage(user, 'msg2')
      ])
        .then((msgx) => {
          const [msg1, msg2] = msgx
          this.room.getMessagesSince(null)
            .then(msgs => {
              assertIsArray(msgs)
              assert.deepStrictEqual(msgs, [msg1, msg2])
              done()
            })
            .catch(done)
        })
        .catch(done)
    })
  })

  describe('waitForMessagesSince', () => {
    it('should yield existing messages', (done) => {
      const mockMessages = [{ id: 43 }]

      this.room.getMessagesSince = stubFn(Promise.resolve(mockMessages))

      this.room.waitForMessagesSince(42)
        .then(msgs => {
          assert.deepStrictEqual(msgs, mockMessages)
          done()
        })
        .catch(done)
    })

    it('should add listener when no messages', (done) => {
      this.room.addListener = stubFn()
      this.room.getMessagesSince = stubFn(Promise.resolve([]))

      this.room.waitForMessagesSince(0)

      setTimeout(() => {
        assert(this.room.addListener.called)
        assert(this.room.addListener.args[0], 'message')
        assertIsFunction(this.room.addListener.args[1])
        assert(this.room.getMessagesSince.called)
        done()
      }, 0)
    })

    it('should resolve new message waiting', (done) => {
      const user = 'Isaac'
      const message = 'Are you waiting for this?'

      this.room.waitForMessagesSince(0)
        .then(msgs => {
          assertIsArray(msgs)
          assert.strictEqual(msgs.length, 1)
          assert.strictEqual(msgs[0].user, user)
          assert.strictEqual(msgs[0].message, message)
          done()
        })
        .catch(done)

      setTimeout(() => {
        this.room.addMessage(user, message)
      }, 0)
    })

    it('should remove the event listener after resolving a new message', (done) => {
      this.room.waitForMessagesSince(0)
        .then(msgs => {
          assertIsArray(msgs)
          assert.strictEqual(this.room.listeners('message').length, 0)
          done()
        })
        .catch(done)

      setTimeout(() => {
        this.room.addMessage('Isaac', 'Hello')
      }, 0)
    })
  })
})
