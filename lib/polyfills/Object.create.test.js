/* globals describe, it, after, before */

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

    it('should create an new object with the object provided as prototype', () => {
      var person = {
        firsName: 'unknown',
        speak () {
          return 'Hello'
        }
      }
      var pete = Object.create(person)
      assert.strictEqual(pete.firsName, 'unknown')
      assert.strictEqual(pete.speak(), 'Hello')
    })
  })

  describe('clean up', () => {
    it('should be the reestablished correctly', () => {
      assert.strictEqual(Object.create, originalCreate)
      var person = {
        firsName: 'unknown',
        speak () {
          return 'Hello'
        }
      }
      var pete = Object.create(person)
      assert.strictEqual(pete.firsName, 'unknown')
      assert.strictEqual(pete.speak(), 'Hello')
    })
  })
})
