const assert = require('assert')
const { JSDOM } = require('jsdom')

const {
  assertIsObject,
  assertIsFunction
} = require('../assertions')

const { stubFn } = require('../stub')

const tddjs = require('../tddjs')

const formController = require('./formController')

describe('Chat.formController - unit tests', () => {
  it('should be an object', () => {
    assertIsObject(formController)
  })

  it('should have a setView method', () => {
    assertIsFunction(formController.setView)
  })

  describe('methods', () => {
    beforeEach(() => {
      this.controller = Object.create(formController)
      this.controller.handleSubmit = stubFn()
      tddjs.dom.addEventHandler = stubFn()
      this.dom = new JSDOM(`<form>\
        <fieldset>
          <label for="username">Username</label>
          <input type="text" name="username" id="username">
          <input type="submit" value="Enter">
        </fieldset>
      </form>`)
      this.element = this.dom.window.document.getElementsByTagName('form')[0]
      this.input = this.dom.window.document.getElementsByTagName('input')[0]
      this.controller.setView(this.element)
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
        const stub = this.controller.handleSubmit = stubFn()

        this.controller.setView(this.element)

        tddjs.dom.addEventHandler.args[2]()

        assert(stub.called)
        assert.strictEqual(stub.thisArg, this.controller)
      })

      it('should throw if no element is passed', () => {
        assert.throws(() => {
          this.controller.setView()
        }, /SyntaxError/)
      })
    })
  })
})
