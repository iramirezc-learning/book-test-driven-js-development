const assert = require('assert')
const { JSDOM } = require('jsdom')

const {
  assertIsObject,
  assertIsFunction
} = require('../assertions')

const { stubFn } = require('../stub')

const Chat = {
  messageListController: require('./messageListController')
}

describe('Chat.messageListController - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(Chat.messageListController)
  })

  it('should have `setModel` method', () => {
    assertIsFunction(Chat.messageListController.setModel)
  })

  it('should have `addMessage` method', () => {
    assertIsFunction(Chat.messageListController.addMessage)
  })

  it('should have `setView` method', () => {
    assertIsFunction(Chat.messageListController.setView)
  })

  describe('methods', () => {
    beforeEach(() => {
      this.controller = Object.create(Chat.messageListController)
      this.model = { observe: stubFn() }
      this.controller.setModel(this.model)
      this.dom = new JSDOM(`<dl></dl>`)
      this.element = this.dom.window.document.getElementsByTagName('dl')[0]
      this.controller.setView(this.element, this.dom.window.document)
      this.dds = this.element.getElementsByTagName('dd')
      this.dts = this.element.getElementsByTagName('dt')
    })

    describe('setModel method', () => {
      it('should observe model`s message channel', () => {
        assert(this.model.observe.called)
        assert.strictEqual('message', this.model.observe.args[0])
        assertIsFunction(this.model.observe.args[1])
      })

      it('should observe with bound addMessage', () => {
        const stub = this.controller.addMessage = stubFn()

        this.controller.setModel(this.model) // do not remove
        this.model.observe.args[1]()

        assert(stub.called)
        assert.strictEqual(stub.thisArg, this.controller)
      })

      it('should throw an error if model object is not provided', () => {
        assert.throws(() => {
          this.controller.setModel(null)
        }, /TypeError: model object is required./)
      })

      it('should throw an error if model object does not support observe method', () => {
        assert.throws(() => {
          this.controller.setModel({})
        }, /TypeError: model object does not support observe method./)

        assert.throws(() => {
          this.controller.setModel({ observe: true })
        }, /TypeError: model object does not support observe method./)
      })
    })

    describe('addMessage method', () => {
      it('should add a dt element with @user', () => {
        this.controller.addMessage({
          user: 'Isaac',
          message: 'Hello World'
        })

        assert.strictEqual(this.dts.length, 1)
        assert.strictEqual(this.dts[0].innerHTML, '@Isaac')
      })

      it('should add a dd element with message', () => {
        this.controller.addMessage({
          user: 'Isaac',
          message: 'Hello World'
        })

        assert.strictEqual(this.dds.length, 1)
        assert.strictEqual(this.dds[0].innerHTML, 'Hello World')
      })

      it('should escape HTML in messages', () => {
        this.controller.addMessage({
          user: 'Hackerman',
          message: "<script>window.alert('boom!');</script>"
        })

        const expectedMessage = "&lt;script&gt;window.alert('boom!');&lt;/script&gt;"

        assert.strictEqual(this.dds[0].innerHTML, expectedMessage)
      })

      it('should not repeat same user dt', () => {
        this.controller.addMessage({
          user: 'Nahum',
          message: 'Hello'
        })
        this.controller.addMessage({
          user: 'Nahum',
          message: 'My World!'
        })

        assert.strictEqual(this.dts.length, 1)
        assert.strictEqual(this.dds.length, 2)
      })

      it('should set js-yellow class to a dd if the message contains the name of the current user', () => {
        this.model.currentUser = 'Isaac'
        this.controller.addMessage({
          user: 'Peter',
          message: '@Isaac, could you please help!'
        })

        assert.strictEqual(this.dds[0].className, 'js-yellow')
      })

      it('should scroll element down', () => {
        const element = {
          appendChild: stubFn(),
          scrollHeight: 1900
        }

        this.controller.setView(element, this.dom.window.document)
        this.controller.addMessage({
          user: 'Isaac',
          message: "What's up?"
        })
        assert.strictEqual(element.scrollTop, 1900)
      })
    })

    describe('setView method', () => {
      it('should set js-chat class', () => {
        this.controller.setView(this.element)

        assert.strictEqual(this.element.className, 'js-chat')
      })

      it('should set the view', () => {
        this.controller.setView(this.element)

        assert.strictEqual(this.element, this.controller.view)
      })
    })
  })
})
