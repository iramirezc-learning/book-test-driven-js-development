const assert = require('assert')

const tddjs = {
  extend: require('./extend'),
  isOwnProperty: require('./isOwnProperty')
}

describe('TDDJS.extend', () => {
  let mock

  before(() => {
    mock = {
      setName (name) {
        return (this.name = name)
      },
      getName () {
        return this.name || null
      }
    }
  })

  it('should copy the properties', () => {
    var obj = {}
    tddjs.extend(obj, mock)
    assert.strictEqual(typeof obj.setName, 'function')
    assert.strictEqual(typeof obj.getName, 'function')
  })

  it('should create a new object when target is null or undefined', () => {
    var obj = tddjs.extend(null, mock)
    assert.strictEqual(typeof obj.setName, 'function')
    assert.strictEqual(typeof obj.getName, 'function')
  })

  it('should return the target untouched when no source', () => {
    var obj = tddjs.extend({})
    var properties = []

    for (var prop in obj) {
      if (tddjs.isOwnProperty(obj, prop)) {
        properties.push(prop)
      }
    }

    assert.deepStrictEqual(obj, {})
    assert.strictEqual(properties.length, 0)
  })
})
