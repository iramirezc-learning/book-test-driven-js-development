/* globals describe it */

const assert = require('assert')

const {
  assertIsNumber,
  assertIsUndefined
} = require('../assertions')

const tddjs = {
  uid: require('./uid')
}

describe('TDDJS.uid', () => {
  it('should return numeric id', () => {
    const id = tddjs.uid({})
    assertIsNumber(id)
  })

  it('should return consistent id for object', () => {
    const obj = {}
    const id = tddjs.uid(obj)

    assert.strictEqual(id, tddjs.uid(obj))
  })

  it('should return unique id', () => {
    const obj = {}
    const obj2 = {}
    const id = tddjs.uid(obj)

    assert.notStrictEqual(id, tddjs.uid(obj2))
  })

  it('should return consistent id for function', () => {
    const func = function () { }
    const id = tddjs.uid(func)

    assert.strictEqual(id, tddjs.uid(func))
  })

  it('should return undefined for primitive', () => {
    assertIsUndefined(tddjs.uid('some string'))
    assertIsUndefined(tddjs.uid(2))
    assertIsUndefined(tddjs.uid(true))
  })
})
