const testCase = require('../../01-automated-testing/code/4-test-case')
const assert = require('../../01-automated-testing/code/2-assert')

// load trim
require('./2-trim')

testCase('String trim test', {
  'test trim should be a function': function () {
    assert('should be a function', typeof ''.trim === 'function')
  },
  'test trim should remove leading white-space': function () {
    assert('should remove leading white-space', '     a string'.trim() === 'a string')
  },
  'test trim should remove trailing white-space': function () {
    assert('should remove trailing white-space', 'a string     '.trim() === 'a string')
  },
  'test trim should remove trailing and leading white-space': function () {
    assert('should remove trailing white-space', '     a string     '.trim() === 'a string')
  },
  'test trim should let the string as it is when nothing to trim': function () {
    assert('should let string as it is', 'a string'.trim() === 'a string')
  }
})
