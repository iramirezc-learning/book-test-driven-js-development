const assert = require('assert')

const {
  assertIsFalse,
  assertIsTrue
} = require('../assertions')

const tddjs = {
  iterator: require('./iterator')
}

describe('TDDJS.iterator', () => {
  let collection
  let iterator

  beforeEach(() => {
    collection = [1, 2, 3, 4, 5]
    iterator = tddjs.iterator(collection)
  })

  it('should return an iterator', () => {
    assert.notStrictEqual(iterator, undefined)
  })

  it('should return the first item when calling next() the first time', () => {
    assert.strictEqual(iterator.next(), collection[0])
  })

  it('should has next after calling next() the first time', () => {
    iterator.next()

    assertIsTrue(iterator.hasNext())
  })

  it('should not has next when calling next() after the last item', () => {
    iterator.next()
    iterator.next()
    iterator.next()
    iterator.next()
    iterator.next()

    assertIsFalse(iterator.hasNext())
  })

  it('should loop collection with iterator', () => {
    const result = []

    while (iterator.hasNext()) {
      result.push(iterator.next())
    }

    assert.deepStrictEqual(result, collection)
  })
})
