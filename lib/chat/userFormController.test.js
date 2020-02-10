const assert = require('assert')
const { JSDOM } = require('jsdom')

const {
  assertIsObject,
  assertIsFunction
} = require('../assertions')

const { stubFn } = require('../stub')

const Chat = {
  formController: require('./formController'),
  userFormController: require('./userFormController')
}

describe('Chat.userFormController - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(Chat.userFormController)
  })

  it('should have a handleSubmit method', () => {
    assertIsFunction(Chat.userFormController.handleSubmit)
  })

  it('should have a setView method inherit from formController', () => {
    assertIsFunction(Chat.userFormController.setView)
    assert.strictEqual(Chat.userFormController.setView, Chat.formController.setView)
  })

  describe('methods', () => {
    beforeEach(() => {
      this.controller = Object.create(Chat.userFormController)
      this.dom = new JSDOM(`<form>\
        <fieldset>
          <label for="username">Username</label>
          <input type="text" name="username" id="username">
          <input type="submit" value="Enter">
        </fieldset>
      </form>`)
      this.element = this.dom.window.document.getElementsByTagName('form')[0]
      this.event = {
        preventDefault: stubFn()
      }
      this.input = this.dom.window.document.getElementsByTagName('input')[0]
      this.model = {}
      this.controller.setModel(this.model)
      this.controller.setView(this.element)
    })

    describe('handleSubmit', () => {
      it('should prevent event default action', () => {
        this.controller.handleSubmit(this.event)

        assert(this.event.preventDefault.called)
      })

      it('should set model.currentUser', () => {
        this.input.value = 'isaac'

        this.controller.handleSubmit(this.event)

        assert.strictEqual('isaac', this.model.currentUser)
      })

      it('should notify observers of username change', () => {
        this.input.value = 'nahum'

        const observer = stubFn()

        this.controller.observe('user', observer)
        this.controller.handleSubmit(this.event)

        assert(observer.called)
        assert.strictEqual(observer.args[0], 'nahum')
      })

      it('should remove class when successful', () => {
        this.input.value = 'ramirez'

        this.controller.handleSubmit(this.event)

        assert.strictEqual('', this.element.className)
      })

      it('should not notify observers of empty users', () => {
        this.input.value = ''

        const observer = stubFn()

        this.controller.observe('user', observer)
        this.controller.handleSubmit(this.event)

        assert.strictEqual(false, observer.called)
      })

      it('should not remove class when username is empty', () => {
        this.input.value = ''

        this.controller.handleSubmit(this.event)

        assert.strictEqual('js-chat', this.element.className)
      })
    })
  })
})
