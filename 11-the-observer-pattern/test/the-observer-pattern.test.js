/* globals describe it, beforeEach */

const assert = require('assert')

const Observable = require('../code/observable')

describe('Chapter 11', () => {
  let observable

  beforeEach(() => {
    observable = Object.create(Observable)
  })

  describe('11.1 The Observer in JavaScript', () => {
    it('should be nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('11.2 Adding Observers', () => {
    describe('Observable - observe', () => {
      it('should store a function', () => {
        const observers = [
          function () { /* noop */ },
          function () { /* noop */ }
        ]

        observable.observe('event', observers[0])
        observable.observe('event', observers[1])

        // NOTE: observers is not longer public
        // assert.deepStrictEqual(observers, observable.observers)
        assert.strictEqual(observable.hasObserver('event', observers[0]), true)
        assert.strictEqual(observable.hasObserver('event', observers[1]), true)
      })
    })
  })

  describe('11.3 Checking for Observers', () => {
    describe('Observable - hasObserver', () => {
      it('should return true when has observer', () => {
        const observer = function () { /* noop */ }

        observable.observe('event', observer)

        assert.deepStrictEqual(observable.hasObserver('event', observer), true)
      })

      it('should return false when has no observers', () => {
        assert.deepStrictEqual(observable.hasObserver('event', function () { }), false)
      })
    })

    describe('Observable - add & has observer', () => {
      // this is a combination of duplicated tests
      // observe and hasObserver
      it('should store functions', () => {
        const observers = [
          function () { /* noop */ },
          function () { /* noop */ }
        ]

        observable.observe('event', observers[0])
        observable.observe('event', observers[1])

        assert.deepStrictEqual(observable.hasObserver('event', observers[0]), true)
        assert.deepStrictEqual(observable.hasObserver('event', observers[1]), true)
      })
    })
  })

  describe('11.4 Notifying Observers', () => {
    describe('Observable - notify', () => {
      it('should call all observers', () => {
        const observer1 = function () { observer1.called = true }
        const observer2 = function () { observer2.called = true }

        observable.observe('event', observer1)
        observable.observe('event', observer2)
        observable.notify('event')

        assert.strictEqual(observer1.called, true)
        assert.strictEqual(observer2.called, true)
      })

      it('should pass the arguments through', () => {
        let actual

        observable.observe('event', function () {
          actual = Array.prototype.slice.call(arguments)
        })

        observable.notify('event', 'String', 1, true)

        assert.deepStrictEqual(actual, ['String', 1, true])
      })
    })
  })

  describe('11.5 Error Handling', () => {
    describe('Observable - observe', () => {
      it('should throw for an un-callable observer', () => {
        assert.throws(() => {
          observable.observe('event', {})
        }, /TypeError/)
      })
    })

    describe('Observable - notify', () => {
      it('should notify all even when some fail', () => {
        const observer1 = function () { throw new Error('Oops!') }
        const observer2 = function () { observer2.called = true }

        observable.observe('event', observer1)
        observable.observe('event', observer2)
        observable.notify('event', 1, 2, 3)

        assert.strictEqual(observer2.called, true)
      })

      it('should call the observers in the order they were added', () => {
        const calls = []
        const observer1 = function () { calls.push(observer1) }
        const observer2 = function () { calls.push(observer2) }

        observable.observe('event', observer1)
        observable.observe('event', observer2)
        observable.notify('event', 1, 2, 3)

        assert.deepStrictEqual(calls, [observer1, observer2])
      })
    })
  })

  describe('11.6 Observing Arbitrary Objects', () => {
    describe('Observable - notify', () => {
      it('should not fail if no observers', () => {
        assert.doesNotThrow(() => {
          observable.notify('event')
        })
      })
    })
  })

  describe('11.7 Observing Arbitrary Events', () => {
    describe('Observable - observe', () => {
      it('should notify relevant observers only', () => {
        const calls = []

        observable.observe('event', function () {
          calls.push('event')
        })

        observable.observe('other', function () {
          calls.push('other')
        })

        observable.notify('other')

        assert.deepStrictEqual(calls, ['other'])
      })
    })
  })
})
