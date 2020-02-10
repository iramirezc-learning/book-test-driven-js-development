const assert = require('assert')
const { JSDOM } = require('jsdom')

const {
  assertIsObject,
  assertIsFunction
} = require('../assertions')

const { stubFn } = require('../stub')

const tddjs = require('../tddjs')

const Chat = {
  userFormController: require('./userFormController')
}

describe('Chat.userFormController - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(Chat.userFormController)
  })

  it('should have a handleSubmit method', () => {
    assertIsFunction(Chat.userFormController.handleSubmit)
  })

  it('should have a setView method', () => {
    assertIsFunction(Chat.userFormController.setView)
  })

  describe('methods', () => {
    beforeEach(() => {
      this.controller = Object.create(Chat.userFormController)
      tddjs.dom.addEventHandler = stubFn()
      this.originalHandleSubmit = Chat.userFormController.handleSubmit
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
    })

    afterEach(() => {
      Chat.userFormController.handleSubmit = this.originalHandleSubmit
    })

    describe('setView', () => {
      it('should add js-chat class', () => {
        this.controller.setView(this.element)

        assert.strictEqual(this.element.className, 'js-chat')
      })

      it('should handle submit event', () => {
        this.controller.setView(this.element)

        assert(tddjs.dom.addEventHandler.called)
        assert.strictEqual(tddjs.dom.addEventHandler.args[0], this.element)
        assert.strictEqual(tddjs.dom.addEventHandler.args[1], 'submit')
        assertIsFunction(tddjs.dom.addEventHandler.args[2])
      })

      it('should handle event with bound handleSubmit', () => {
        const stub = Chat.userFormController.handleSubmit = stubFn()

        this.controller.setView(this.element)

        tddjs.dom.addEventHandler.args[2]()

        assert(stub.called)
        assert.strictEqual(stub.thisArg, Chat.userFormController)
      })

      // Exercise
      it('should throw if no element is passed', () => {
        assert.throws(() => {
          this.controller.setView()
        }, /SyntaxError/)
      })
    })

    describe('handleSubmit', () => {
      beforeEach(() => {
        this.input = this.dom.window.document.getElementsByTagName('input')[0]
        this.model = {}
        this.controller.setModel(this.model)
        this.controller.setView(this.element)
      })

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
