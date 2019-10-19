const assert = require('assert')

const { assertIsObject, assertIsNumber, assertIsNull, assertIsUndefined, assertIsArray } = require('../../lib/assertions')
const chatRoom = require('../src/chat-room')
const { stubFn } = require('../../lib/stub')

describe.only('Chat room - Unit Tests', () => {
  beforeEach(() => {
    this.consoleLog = console.log
    console.log = stubFn()
    this.room = Object.create(chatRoom)
  })

  afterEach(() => {
    console.log = this.consoleLog
  })

  describe('addMessage', () => {
    it('should require username', (done) => {
      this.room.addMessage(null, 'a message', (err) => {
        assert(err instanceof TypeError)
        done()
      })
    })

    it('should require a message', (done) => {
      this.room.addMessage('Isaac', null, (err) => {
        assert(err instanceof TypeError)
        done()
      })
    })

    it('should not require a callback', (done) => {
      assert.doesNotThrow(() => {
        this.room.addMessage()
        done()
      })
    })

    it('should be asynchronous', (done) => {
      let id = 0

      this.room.addMessage('Isaac', 'Hey', (err, msg) => {
        assertIsNull(err)
        id = msg.id
      })

      this.room.getMessagesSince(id - 1, (err, msgs) => {
        assertIsNull(err)
        assert.strictEqual(msgs.length, 0)
        assert.strictEqual(id, 0)
        done()
      })
    })

    it('should call callback with new object', (done) => {
      const txt = 'some message'

      this.room.addMessage('isaac', txt, (err, msg) => {
        assertIsNull(err)
        assertIsObject(msg)
        assertIsNumber(msg.id)
        assert.strictEqual(msg.message, txt)
        assert.strictEqual(msg.user, 'isaac')
        done()
      })
    })

    it('should not return new object if error', (done) => {
      this.room.addMessage('isaac', null, (err, msg) => {
        assert.notStrictEqual(err, null)
        assertIsUndefined(msg)
        done()
      })
    })

    it('should assign unique ids to messages', (done) => {
      this.room.addMessage('isaac', 'msg1', (err1, msg1) => {
        assertIsNull(err1)
        this.room.addMessage('nahum', 'msg2', (err2, msg2) => {
          assertIsNull(err2)
          assert.notStrictEqual(msg1.id, msg2.id)
          done()
        })
      })
    })
  })

  describe('getMessagesSince', () => {
    it('should not throw if cb is not provided', (done) => {
      assert.doesNotThrow(() => {
        this.room.getMessagesSince()
        done()
      })
    })

    it('should return an empty array when no messages', (done) => {
      this.room.getMessagesSince(0, (err, msgs) => {
        assertIsNull(err)
        assertIsArray(msgs)
        assert.deepStrictEqual(msgs, [])
        done()
      })
    })

    it('should get messages since given id', (done) => {
      const user = 'Isaac'

      this.room.addMessage(user, 'msg1', (err1, msg1) => {
        this.room.addMessage(user, 'msg2', (err2, msg2) => {
          this.room.getMessagesSince(msg1.id, (err, msgs) => {
            assertIsNull(err1)
            assertIsNull(err2)
            assertIsNull(err)
            assertIsArray(msgs)
            assert.deepStrictEqual(msgs, [msg2])
            done()
          })
        })
      })
    })

    it('should get messages all messages if id provided is 0', (done) => {
      const user = 'Isaac'

      this.room.addMessage(user, 'msg1', (err1, msg1) => {
        this.room.addMessage(user, 'msg2', (err2, msg2) => {
          this.room.getMessagesSince(0, (err, msgs) => {
            assertIsNull(err1)
            assertIsNull(err2)
            assertIsNull(err)
            assertIsArray(msgs)
            assert.deepStrictEqual(msgs, [msg1, msg2])
            done()
          })
        })
      })
    })

    it('should return an empty array if id does not exist', (done) => {
      const user = 'Isaac'

      this.room.addMessage(user, 'msg1', (err1, msg1) => {
        this.room.addMessage(user, 'msg2', (err2, msg2) => {
          this.room.getMessagesSince(3, (err, msgs) => {
            assertIsNull(err1)
            assertIsNull(err2)
            assertIsNull(err)
            assertIsArray(msgs)
            assert.deepStrictEqual(msgs, [])
            done()
          })
        })
      })
    })

    it('should return an empty array if id is not provided', (done) => {
      const user = 'Isaac'

      this.room.addMessage(user, 'msg1', (err1, msg1) => {
        this.room.addMessage(user, 'msg2', (err2, msg2) => {
          this.room.getMessagesSince(null, (err, msgs) => {
            assertIsNull(err1)
            assertIsNull(err2)
            assertIsNull(err)
            assertIsArray(msgs)
            assert.deepStrictEqual(msgs, [])
            done()
          })
        })
      })
    })

    it('should return an array with all messages if only cb is provided', (done) => {
      const user = 'Isaac'

      this.room.addMessage(user, 'msg1', (err1, msg1) => {
        this.room.addMessage(user, 'msg2', (err2, msg2) => {
          this.room.getMessagesSince((err, msgs) => {
            assertIsNull(err1)
            assertIsNull(err2)
            assertIsNull(err)
            assertIsArray(msgs)
            assert.deepStrictEqual(msgs, [msg1, msg2])
            done()
          })
        })
      })
    })
  })
})
