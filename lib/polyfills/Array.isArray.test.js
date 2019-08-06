const assert = require('assert')

const installPolyfill = require('./Array.isArray')

describe('Polyfill - Array.isArray', () => {
  let original

  before(() => {
    original = Array.isArray
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(Array.isArray, original)
    })
  })

  describe('implementation', () => {
    let polyfill

    before(() => {
      polyfill = installPolyfill(true)
    })

    after(() => {
      polyfill.uninstall()
    })

    it('should be the polyfilled version', () => {
      assert.notStrictEqual(Array.isArray, original)
    })

    it('should return true if an Array is an Array', () => {
      assert.strictEqual(Array.isArray([]), true)
    })

    it('should return false if object is not an Array', () => {
      assert.strictEqual(Array.isArray({ length: 0 }), false)
    })
  })

  describe('clean up', () => {
    it('should be the reestablished correctly', () => {
      assert.strictEqual(Array.isArray([]), true)
      assert.strictEqual(Array.isArray({ length: 0 }), false)
    })
  })
})
