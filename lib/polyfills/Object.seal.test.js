const assert = require('assert')

const sealPolyfill = require('./Object.seal')

describe('Polyfill - Object.seal', () => {
  let originalSeal

  before(() => {
    originalSeal = Object.seal
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(Object.seal, originalSeal)
    })
  })

  describe('implementation', () => {
    let polyfill

    before(() => {
      polyfill = sealPolyfill(true)
    })

    after(() => {
      polyfill.uninstall()
    })

    it('should be the polyfilled version', () => {
      assert.notStrictEqual(Object.seal, originalSeal)
    })

    it('should seal an object', () => {
      const circle = { radius: 5 }
      Object.seal(circle)
      circle.diameter = 10
      assert.strictEqual(circle.radius, 5, 'radius should be defined')
      assert.strictEqual(circle.diameter, undefined, 'diameter should be undefined')
      const descriptors = Object.getOwnPropertyDescriptor(circle, 'radius')
      assert.deepStrictEqual(descriptors, {
        value: 5,
        configurable: false,
        enumerable: true,
        writable: true
      })
      const props = Object.getOwnPropertyNames(circle)
      assert.deepStrictEqual(props, ['radius'], 'object should have only properties before prevent extension')
      assert.strictEqual(Object.isExtensible(circle), false, 'object should not be extensible')
      circle.radius = 6
      assert.strictEqual(circle.radius, 6, 'radius can be changed')
    })
  })

  describe('clean up', () => {
    it('should be the reestablished correctly', () => {
      assert.strictEqual(Object.seal, originalSeal)
      const circle = { radius: 5 }
      Object.seal(circle)
      circle.diameter = 10
      assert.strictEqual(circle.radius, 5, 'radius should be defined')
      assert.strictEqual(circle.diameter, undefined, 'diameter should be undefined')
      const descriptors = Object.getOwnPropertyDescriptor(circle, 'radius')
      assert.deepStrictEqual(descriptors, {
        value: 5,
        configurable: false,
        enumerable: true,
        writable: true
      })
      const props = Object.getOwnPropertyNames(circle)
      assert.deepStrictEqual(props, ['radius'], 'object should have only properties before prevent extension')
      assert.strictEqual(Object.isExtensible(circle), false, 'object should not be extensible')
      circle.radius = 6
      assert.strictEqual(circle.radius, 6, 'radius can be changed')
    })
  })
})
