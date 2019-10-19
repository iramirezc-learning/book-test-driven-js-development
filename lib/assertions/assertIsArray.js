const assert = require('assert')

module.exports = (val) => {
  return assert(Array.isArray(val))
}
