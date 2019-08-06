require('../src/1-strftime')

const testCase = require('../src/5-test-case-hooks')
const assert = require('../src/2-assert')

// Notice how we are no longer testing `strftime` method
// but every format instead.
// This is a good practice to perform unit testing otherwise
// it will be integration testing

testCase('strftime test', {
  setUp: function () {
    this.date = new Date(2009, 9, 2, 22, 14, 45)
  },
  'test format specifier %Y': function () {
    assert('%Y should return full year', Date.formats.Y(this.date) === 2009)
  },
  'test format specifier %m': function () {
    assert('%m should return month', Date.formats.m(this.date) === '10')
  },
  'test format specifier %d': function () {
    assert('%d should return date', Date.formats.d(this.date) === '02')
  },
  'test format specifier %y': function () {
    assert('%y should return year as two digits', Date.formats.y(this.date) === '9') // fail on purpose
  },
  'test format shorthand %F': function () {
    assert('%F should be shortcut for %Y-%m-%d', Date.formats.F === '%Y-%m-%d')
  },
  'test format shorthand %D': function () {
    assert('%D should be shortcut for %m/%d/%y', Date.formats.D === '%m/%d/%y')
  },
  'test format specifier %j': function () {
    assert('%j should return day of year', Date.formats.j(new Date(2000, 0, 2)) === 1) // is this incorrect?
    assert('%j should return day of year', Date.formats.j(this.date) === 275)
  }
})
