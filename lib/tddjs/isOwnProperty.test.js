const assert = require('assert')

const tddjs = {
  isOwnProperty: require('./isOwnProperty')
}

describe('TDDJS.isOwnProperty', () => {
  it('should return true if the object contains a property', () => {
    var obj = {
      name: 'test'
    }
    assert.strictEqual(obj.name, 'test')
    assert.strictEqual(tddjs.isOwnProperty(obj, 'name'), true, 'property should exist in the obj')
  })
  it('should return false if the object does not contain a property', () => {
    var obj = Object.create({
      name: 'test'
    })
    assert.strictEqual(obj.name, 'test')
    assert.strictEqual(tddjs.isOwnProperty(obj, 'name'), false, 'property should not exist in the obj')
  })
})
