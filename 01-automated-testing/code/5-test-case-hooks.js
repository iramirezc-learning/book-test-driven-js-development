const assert = require('./2-assert')
const output = require('./3-output-color')

function testCase (name, tests) {
  assert.count = 0

  let successful = 0
  let testCount = 0
  const hasSetup = typeof tests.setUp === 'function' // beforeEach
  const hasTearDown = typeof tests.tearDown === 'function' // afterEach

  for (let test in tests) {
    // start of line + 'test'
    if (!/^test/.test(test)) {
      continue
    }

    testCount++

    try {
      if (hasSetup) {
        tests.setUp()
      }

      tests[test]()
      output(test, 'green')

      if (hasTearDown) {
        tests.tearDown()
      }

      // If the tearDown method throws an error, it is
      // considered a test failure, so we don't count
      // success until all methods have run successfully
      successful++
    } catch (e) {
      output(test + ' failed: ' + e.message, 'red')
    }
  }

  const color = successful === testCount ? 'green' : 'red'

  output(`${testCount} tests, ${(testCount - successful)} failures`, color)
}

module.exports = testCase
