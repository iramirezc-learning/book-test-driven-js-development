const assert = require('assert')

const { assertIsNumber } = require('../assertions')
const tddjs = require('../tddjs')
const Ajax = require('../ajax')

describe('Ajax.create - unit tests', () => {
  it('should return an XMLHttpRequest object', () => {
    const xhr = Ajax.create()

    assertIsNumber(xhr.readyState)
    assert(tddjs.isHostMethod(xhr, 'open'))
    assert(tddjs.isHostMethod(xhr, 'send'))
    assert(tddjs.isHostMethod(xhr, 'setRequestHeader'))
  })
})
