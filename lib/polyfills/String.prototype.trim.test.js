/* globals describe, it, after, before */

const assert = require('assert')

const trimPolyFill = require('./String.prototype.trim')

describe('Polyfill - String.prototype.trim', () => {
  let originalTrim

  before(() => {
    originalTrim = String.prototype.trim
  })

  describe('initialization', () => {
    it('should be the original version', () => {
      assert.strictEqual(String.prototype.trim, originalTrim)
    })
  })

  describe('implementation', () => {
    before(() => {
      trimPolyFill(true)
    })

    after(() => {
      /* eslint-disable no-extend-native */
      String.prototype.trim = originalTrim
      /* eslint-enable no-extend-native */
    })

    it('should be the polyfilled version', () => {
      assert.notStrictEqual(String.prototype.trim, originalTrim)
    })

    it('should trim a text', () => {
      assert.strictEqual('   hola   '.trim(), 'hola')
    })
  })

  describe('clean up', () => {
    it('should be the reestablished correctly', () => {
      assert.strictEqual(String.prototype.trim, originalTrim)
      assert.strictEqual('   hola   '.trim(), 'hola')
    })
  })
})
