const assert = require('assert')

const {
  assertIsObject,
  assertIsUndefined
} = require('../assertions')

const tddjs = {
  namespace: require('./namespace')
}

describe('TDDJS.namespace', () => {
  before(() => {
    delete tddjs.nstest
  })

  it('should create non-existen object', () => {
    tddjs.namespace('nstest')
    assertIsObject(tddjs.nstest)
  })

  it('should not override existing objects', () => {
    tddjs.nstest = { nested: {} }
    const result = tddjs.namespace('nstest.nested')
    assert.strictEqual(tddjs.nstest.nested, result)
  })

  it('should only create missing parts', () => {
    const existing = {}
    tddjs.nstest = { nested: { existing } }
    const result = tddjs.namespace('nstest.nested.ui')
    assert.strictEqual(tddjs.nstest.nested.existing, existing)
    assertIsObject(tddjs.nstest.nested.ui)
    assert.strictEqual(tddjs.nstest.nested.ui, result)
  })

  it('should work inside other objects', () => {
    const custom = { namespace: tddjs.namespace }
    custom.namespace('dom.event')
    assertIsObject(custom.dom.event)
    assertIsUndefined(tddjs.dom)
  })
})
