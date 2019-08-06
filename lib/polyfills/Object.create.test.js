const assert = require('assert')

const createPolyfill = require('./Object.create')

describe('Polyfill - Object.create', () => {
  let originalCreate

  before(() => {
    originalCreate = Object.create
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(Object.create, originalCreate)
    })
  })

  describe('implementation', () => {
    let polyfill

    before(() => {
      polyfill = createPolyfill(true)
    })

    after(() => {
      polyfill.uninstall()
    })

    it('should be the polyfilled version', () => {
      assert.notStrictEqual(Object.create, originalCreate)
    })

    it('should create a new object with the object provided as prototype', () => {
      const person = {
        firstName: 'unknown',
        speak () {
          return 'Hello'
        }
      }
      const pete = Object.create(person)
      assert.strictEqual(pete.firstName, 'unknown')
      assert.strictEqual(pete.speak(), 'Hello')
    })

    it('should create a new object with property descriptors', () => {
      const person = {}
      const pete = Object.create(person, {
        firstName: {
          value: 'pete',
          enumerable: true,
          writable: true
        },
        speak: {
          value: () => 'Hello'
        }
      })
      assert.strictEqual(pete.firstName, 'pete')
      assert.strictEqual(pete.speak(), 'Hello')
      const descriptors = Object.getOwnPropertyDescriptor(pete, 'firstName')
      assert.deepStrictEqual(descriptors, {
        value: 'pete',
        enumerable: true,
        configurable: false,
        writable: true
      })
    })
  })

  describe('clean up', () => {
    it('should be the reestablished correctly', () => {
      assert.strictEqual(Object.create, originalCreate)
      const person = {
        firstName: 'unknown',
        speak () {
          return 'Hello'
        }
      }
      const pete = Object.create(person)
      assert.strictEqual(pete.firstName, 'unknown')
      assert.strictEqual(pete.speak(), 'Hello')
    })
  })
})
