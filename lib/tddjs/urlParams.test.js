const assert = require('assert')

const tddjs = {
  urlParams: require('./urlParams')
}

describe.only('TDDJS.urlParams', () => {
  it('should return an empty string when object is a falsy value', () => {
    assert.strictEqual(tddjs.urlParams(), '')
    assert.strictEqual(tddjs.urlParams(''), '')
    assert.strictEqual(tddjs.urlParams(0), '')
    assert.strictEqual(tddjs.urlParams(null), '')
    assert.strictEqual(tddjs.urlParams(undefined), '')
    assert.strictEqual(tddjs.urlParams(false), '')
  })

  it('should encode a string', () => {
    assert.strictEqual(tddjs.urlParams('Hello World'), 'Hello%20World')
    assert.strictEqual(tddjs.urlParams('20%'), '20%25')
    assert.strictEqual(tddjs.urlParams('|'), '%7C')
    assert.strictEqual(tddjs.urlParams('"'), '%22')
    assert.strictEqual(tddjs.urlParams('{'), '%7B')
    assert.strictEqual(tddjs.urlParams('}'), '%7D')
    assert.strictEqual(tddjs.urlParams('['), '%5B')
    assert.strictEqual(tddjs.urlParams(']'), '%5D')
  })

  it('should encode an object', () => {
    assert.strictEqual(tddjs.urlParams({}), '')
    assert.strictEqual(tddjs.urlParams({ a: 1 }), 'a=1')
    assert.strictEqual(tddjs.urlParams({ a: 1, b: true }), 'a=1&b=true')
    assert.strictEqual(tddjs.urlParams({ a: 1, b: true, c: { d: 'E' } }), 'a=1&b=true&c=%5Bobject%20Object%5D')
  })

  it('should encode an array', () => {
    assert.strictEqual(tddjs.urlParams([]), '')
    assert.strictEqual(tddjs.urlParams([1]), '0=1')
    assert.strictEqual(tddjs.urlParams([1, 2, 3]), '0=1&1=2&2=3')
    assert.strictEqual(tddjs.urlParams([1, 2, 3, [4, 5]]), '0=1&1=2&2=3&3=4%2C5')
  })
})
