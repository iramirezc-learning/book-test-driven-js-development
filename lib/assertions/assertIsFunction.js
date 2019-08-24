const assert = require('assert')

module.exports = (fn) => {
  return assert.strictEqual(typeof fn, 'function')
}
