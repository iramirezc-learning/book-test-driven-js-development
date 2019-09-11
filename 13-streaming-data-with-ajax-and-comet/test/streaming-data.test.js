const assert = require('assert')

const { stubFn } = require('../../lib/stub')

describe('Chapter 13', () => {
  describe('setTimeout - example tests', () => {
    beforeEach(() => {
      this.setTimeout = global.setTimeout
    })

    afterEach(() => {
      global.setTimeout = this.setTimeout
    })

    it('should call setTimeout', () => {
      global.setTimeout = stubFn()

      setTimeout(() => {
        console.log('do something...')
      }, 1000)

      assert(global.setTimeout.called)
    })
  })
})
