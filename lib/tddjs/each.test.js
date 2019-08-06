const assert = require('assert')

const tddjs = {
  each: require('./each')
}

describe('TDDJS.each', () => {
  it('should iterate over all properties in an object', () => {
    var result = []
    var sum = 0
    var obj = {
      prop1: 1,
      prop2: 2,
      prop3: 3,
      prop4: 4,
      prop5: 5
    }
    tddjs.each(obj, (name, value) => {
      result.push(name)
      sum += value
    })
    assert.strictEqual(result.length, 5, 'all properties should be iterated')
    assert.strictEqual(sum, 15, 'all values should pass to the callback funcion')
  })
})
