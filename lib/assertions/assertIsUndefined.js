const assert = require('assert')

module.exports = (obj) => {
  assert.strictEqual(typeof obj, 'undefined')
  assert.strictEqual(obj, undefined)
}
