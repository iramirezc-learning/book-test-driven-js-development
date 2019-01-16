const assert = require('assert')

module.exports = (obj) => {
  return assert.strictEqual(typeof obj, 'number')
}
