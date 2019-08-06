const assert = require('assert')

const {
  assertIsObject,
  assertIsUndefined
} = require('../../lib/assertions')
const {
  fibonacci,
  fibonacciFast,
  fibonacciMemoized
} = require('../../lib/fibonaccies')
const tddjs = require('../../lib/tddjs')

describe('Chapter 06', () => {
  describe('6.1 Binding Functions', () => {
    describe('light box - broken', () => {
      const lightBox = {
        open: function open () {
          return this.create(true)
        },
        create: function create (success = false) {
          return success
        }
      }

      function anchorLightBox (anchor, options) {
        const lb = Object.create(lightBox)
        lb.url = anchor.href
        lb.title = anchor.title || anchor.href
        Object.assign(lb, options)
        // this will throw the error
        anchor.onClick = lb.open
        return anchor
      }

      it('should throw an exception', () => {
        // because when calling a.onClick
        // 'this.create' will be undefined
        // since we are not binding the 'this' object
        const a = anchorLightBox({
          href: 'www.example.com',
          title: 'my site',
          onClick: function noop () { }
        })

        assert.throws(() => {
          a.onClick()
        }, /TypeError/)
      })
    })
    describe('light box - fixed using closure', () => {
      const lightBox = {
        open: function open () {
          return this.create(true)
        },
        create: function create (success = false) {
          return success
        }
      }

      function anchorLightBox (anchor, options) {
        const lb = Object.create(lightBox)
        lb.url = anchor.href
        lb.title = anchor.title || anchor.href
        Object.assign(lb, options)
        // here lb is encapsulated in the closure
        anchor.onClick = function () {
          return lb.open()
        }
        return anchor
      }

      it('should not throw an exception', () => {
        const a = anchorLightBox({
          href: 'www.example.com',
          title: 'my site',
          onClick: function noop () { }
        })

        assert.strictEqual(a.onClick(), true)
      })
    })
    describe('light box - fixed using bind', () => {
      const lightBox = {
        open: function open () {
          return this.create(true)
        },
        create: function create (success = false) {
          return success
        }
      }

      function anchorLightBox (anchor, options) {
        const lb = Object.create(lightBox)
        lb.url = anchor.href
        lb.title = anchor.title || anchor.href
        Object.assign(lb, options)
        anchor.onClick = lb.open.bind(lb)
        return anchor
      }

      it('should not throw an exception', () => {
        const a = anchorLightBox({
          href: 'www.example.com',
          title: 'my site',
          onClick: function noop () { }
        })
        assert.strictEqual(a.onClick(), true)
      })
    })
  })

  describe('6.2 Immediately Called Anonymous Functions', () => {
    // see tddjs.test.js for complete tests
    describe('namespace - basic testing', () => {
      before(() => {
        delete tddjs.custom
      })

      it('should work inside other objects', () => {
        assertIsUndefined(tddjs.custom)
        const custom = { namespace: tddjs.namespace }
        custom.namespace('my.event')
        assertIsObject(custom.my.event)
        assertIsUndefined(tddjs.my)
      })
    })
  })

  describe('6.3 Stateful Functions', () => {
    // see tddjs.test.js for complete tests
    describe('uid - basic testing', () => {
      it('should return unique id', () => {
        const obj = {}
        const obj2 = {}
        const id = tddjs.uid(obj)

        assert.notStrictEqual(id, tddjs.uid(obj2))
      })
    })

    // see tddjs.test.js for complete tests
    describe('iterator - basic testing', () => {
      let collection
      let iterator

      beforeEach(() => {
        collection = [1, 2, 3, 4, 5]
        iterator = tddjs.iterator(collection)
      })

      it('should loop collection with iterator', () => {
        const result = []

        while (iterator.hasNext()) {
          result.push(iterator.next())
        }

        assert.deepStrictEqual(result, collection)
      })
    })
  })

  describe('6.4 Memoization', () => {
    describe('fibonacci', () => {
      it('should return correct results for fibonacci(n)', () => {
        assert.strictEqual(fibonacci(0), 0)
        assert.strictEqual(fibonacci(1), 1)
        assert.strictEqual(fibonacci(2), 1)
        assert.strictEqual(fibonacci(3), 2)
        assert.strictEqual(fibonacci(4), 3)
        assert.strictEqual(fibonacci(5), 5)
        assert.strictEqual(fibonacci(6), 8)
        assert.strictEqual(fibonacci(10), 55)
        assert.strictEqual(fibonacci(15), 610)
        assert.strictEqual(fibonacci(15), 610)
        assert.strictEqual(fibonacci(20), 6765)
        assert.strictEqual(fibonacci(30), 832040)
      })
    })

    describe('fibonacci using memoization', () => {
      it('should return correct results for fibonacci(n)', () => {
        assert.strictEqual(fibonacciMemoized(0), 0)
        assert.strictEqual(fibonacciMemoized(1), 1)
        assert.strictEqual(fibonacciMemoized(2), 1)
        assert.strictEqual(fibonacciMemoized(3), 2)
        assert.strictEqual(fibonacciMemoized(4), 3)
        assert.strictEqual(fibonacciMemoized(5), 5)
        assert.strictEqual(fibonacciMemoized(6), 8)
        assert.strictEqual(fibonacciMemoized(10), 55)
        assert.strictEqual(fibonacciMemoized(15), 610)
        assert.strictEqual(fibonacciMemoized(15), 610)
        assert.strictEqual(fibonacciMemoized(20), 6765)
        assert.strictEqual(fibonacciMemoized(30), 832040)
      })
    })

    describe('fibonacci using Function.prototype.memoize', () => {
      it('should return correct results for fibonacci(n)', () => {
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
  })
})
