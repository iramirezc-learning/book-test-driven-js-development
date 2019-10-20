const assert = require('assert')

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
    })

    it('should require a message', (done) => {
      this.room.addMessage('Isaac', null)
        .then(() => { }, (err) => {
          assert(err instanceof TypeError)
          done()
        })
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
              assert.deepStrictEqual(msgs, [msg1, msg2])
              done()
            })
        })
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
        })
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
        })
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
        })
    })
  })
})
