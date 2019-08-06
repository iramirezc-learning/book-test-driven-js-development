const assert = require('assert')

const memoizePolyFill = require('./Function.prototype.memoize')

function fibonacci (n) {
  if (n === 0) return 0
  if (n === 1) return 1

  return fibonacci(n - 1) + fibonacci(n - 2)
}

describe('PolyFill - Function.prototype.memoize', () => {
  let originalBind

  before(() => {
    originalBind = Function.prototype.memoize
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(Function.prototype.memoize, originalBind)
    })
  })

  describe('implementation', () => {
    before(() => {
      memoizePolyFill(true) // load polyFill version
    })

    after(() => {
      /* eslint-disable no-extend-native */
      Function.prototype.memoize = originalBind
      /* eslint-enable no-extend-native */
    })

    it('should be the polyfill version', () => {
      assert.notStrictEqual(Function.prototype.memoize, originalBind)
    })

    it('should return correct results for fibonacci(n)', () => {
      const fibonacciFast = fibonacci.memoize()
      assert.strictEqual(fibonacciFast(0), 0)
      assert.strictEqual(fibonacciFast(1), 1)
      assert.strictEqual(fibonacciFast(2), 1)
      assert.strictEqual(fibonacciFast(3), 2)
      assert.strictEqual(fibonacciFast(4), 3)
      assert.strictEqual(fibonacciFast(5), 5)
      assert.strictEqual(fibonacciFast(6), 8)
      assert.strictEqual(fibonacciFast(10), 55)
      assert.strictEqual(fibonacciFast(15), 610)
      assert.strictEqual(fibonacciFast(15), 610)
      assert.strictEqual(fibonacciFast(20), 6765)
      assert.strictEqual(fibonacciFast(30), 832040)
    })
  })

  describe('clean up', () => {
    it('should be reestablished correctly', () => {
      assert.strictEqual(Function.prototype.memoize, originalBind)
    })
  })
})
