const assert = require('assert')

// Reference: https://stackoverflow.com/questions/35782435/node-js-assert-throws-with-async-functions-promises
async function assertThrowsAsync (fn, regExp) {
  let f = () => { }
  try {
    await fn()
  } catch (e) {
    f = () => { throw e }
  } finally {
    assert.throws(f, regExp)
  }
}

module.exports = assertThrowsAsync
