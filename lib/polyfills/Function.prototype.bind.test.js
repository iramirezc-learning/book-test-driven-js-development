/* globals describe, it, after, before */

const assert = require('assert')

const bindPolyFill = require('./Function.prototype.bind')

function sumAll () {
  let total = 0

  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i]
  }

  return total
}

describe('PolyFill - Function.prototype.bind', () => {
  let originalBind

  before(() => {
    originalBind = Function.prototype.bind
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(Function.prototype.bind, originalBind)
    })
  })

  describe('implementation', () => {
    let circle

    before(() => {
      bindPolyFill(true) // load polyFill version
      circle = {
        radius: 10,
        diameter: function () {
          return this.radius * 2
        }
      }
    })

    after(() => {
      /* eslint-disable no-extend-native */
      Function.prototype.bind = originalBind
      /* eslint-enable no-extend-native */
    })

    it('should be the polyfill version', () => {
      assert.notStrictEqual(Function.prototype.bind, originalBind)
    })

    it('should calculate circle.diameter correctly before binding', () => {
      assert.strictEqual(circle.diameter(), 20)
    })

    it('should bind circle.diameter correctly', () => {
      let diameter = circle.diameter.bind({ radius: 20 })

      assert.strictEqual(diameter(), 40)
    })

    it('should return NaN when circle.diameter is not bind', () => {
      let diameter = circle.diameter // no biding

      assert.strictEqual(Number.isNaN(diameter()), true)
    })

    it('should bind a function with arguments', () => {
      let sumAllOnce = sumAll.bind(null)

      assert.strictEqual(sumAllOnce(1, 2, 3), 6)
    })

    it('should bind a function with additional arguments', () => {
      let sumAllAgain = sumAll.bind(null, 1, 2, 3)

      assert.strictEqual(sumAllAgain(4, 5), 15)
    })
  })

  describe('clean up', () => {
    it('should be reestablished correctly', () => {
      assert.strictEqual(Function.prototype.bind, originalBind)
    })
  })
})
