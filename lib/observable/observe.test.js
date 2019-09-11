const assert = require('assert')

const Observable = require('../observable')

describe('Observable.observe & Observable.hasObserver - Unit Tests', () => {
  let observable

  beforeEach(() => {
    observable = Object.create(Observable)
  })

  it('should return false when has no observers', () => {
    assert.deepStrictEqual(observable.hasObserver('event', function () { }), false)
  })

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

  it('should throw for an un-callable observer', () => {
    assert.throws(() => {
      observable.observe('event', {})
    }, /TypeError/)
  })
})
