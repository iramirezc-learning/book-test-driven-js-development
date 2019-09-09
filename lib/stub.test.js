const assert = require('assert')

const { stubDateConstructor } = require('./stub')

describe('Stubs - Unit Tests', () => {
  describe('stubDateConstructor', () => {
    it('should not change the native global Date when not stubbed', () => {
      const originalDate = Date
      assert.strictEqual(Date, originalDate)
      assert(new Date(), 'sanity-check')
    })

    it('should change the native global Date constructor when stub', () => {
      const originalDate = Date
      stubDateConstructor()
      assert.notStrictEqual(Date, originalDate)
      assert(new Date(), 'sanity-check')
    })

    it('should restore the original Date constructor when called', () => {
      const originalDate = Date
      stubDateConstructor()
      assert.notStrictEqual(Date, originalDate)
      assert(new Date(), 'call to restore')
      assert.strictEqual(Date, originalDate)
      assert(new Date(), 'sanity-check')
    })

    it('should return the provided fake date', () => {
      const fakeDate = new Date(1987, 8, 27)

      stubDateConstructor(fakeDate)
      assert.strictEqual(new Date(), fakeDate)
      assert(new Date(), 'sanity-check')
    })

    it('should return current date after first call', () => {
      const fakeDate = new Date(1987, 8, 27)

      stubDateConstructor(fakeDate)
      assert(new Date(), 'call to restore')
      assert.notStrictEqual(new Date(), fakeDate)
      assert(new Date(), 'sanity-check')
    })
  })
})
