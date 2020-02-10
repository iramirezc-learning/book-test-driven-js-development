const assert = require('assert')
const { JSDOM } = require('jsdom')

const {
  assertIsObject,
  assertIsFunction
} = require('../assertions')

const { stubFn } = require('../stub')

const Chat = {
  messageFormController: require('./messageFormController')
}

describe('Chat.messageFormController - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(Chat.messageFormController)
  })

  it('should have handleSubmit method', () => {
    assertIsFunction(Chat.messageFormController.handleSubmit)
  })

  describe('methods', () => {
    beforeEach(() => {
      this.controller = Object.create(Chat.messageFormController)
      this.model = {
        currentUser: 'Isaac',
        notify: stubFn()
      }
      this.event = {
        preventDefault: stubFn()
      }
      this.controller.setModel(this.model)
      this.dom = new JSDOM(`<form>\
        <fieldset>
          <input type="text" name="message" id="message">
          <input type="submit" value="Send">
        </fieldset>
      </form>`)
      this.element = this.dom.window.document.getElementsByTagName('form')[0]
      this.input = this.element.getElementsByTagName('input')[0]
      this.input.value = 'Hello!'
      this.controller.setView(this.element)
    })

    describe('handleSubmit method', () => {
      it('should prevent default action of the form', () => {
        this.controller.handleSubmit(this.event)

        assert(this.event.preventDefault.called)
      })

      it('should publish a message', () => {
        this.controller.handleSubmit(this.event)

        assert(this.model.notify.called)
        assert.strictEqual(this.model.notify.args[0], 'message')
        assertIsObject(this.model.notify.args[1])
      })

      it('should publish message from current user', () => {
        this.controller.handleSubmit(this.event)

        assert.strictEqual(this.model.notify.args[1].user, 'Isaac')
      })

      it('should publish message from form', () => {
        this.controller.handleSubmit(this.event)

        const actual = this.model.notify.args[1].message
        assert.strictEqual(actual, 'Hello!')
      })

      it('should not send empty messages', () => {
        this.input.value = ''
        this.controller.handleSubmit(this.event)

        assert(!this.model.notify.called)
      })

      it('should clear the form after publish', () => {
        this.controller.handleSubmit(this.event)

        assert.strictEqual(this.input.value, '')
      })
    })
  })
})
