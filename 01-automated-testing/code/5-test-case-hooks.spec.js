require('./1-strftime')

const testCase = require('./5-test-case-hooks')
const assert = require('./2-assert')

testCase('strftime test', {
  setUp: function () { // setUp is like a beforeEach
    this.date = new Date(2009, 9, 2, 22, 14, 45)
  },
  'test format specifier %Y': function () {
    assert('%Y should return full year', this.date.strftime('%Y') === '2009')
  },
  'test format specifier %m': function () {
    assert('%m should return month', this.date.strftime('%m') === '10')
  },
  'test format specifier %d': function () {
    assert('%d should return date', this.date.strftime('%d') === '02')
  },
  'test format specifier %y': function () {
    assert('%y should return year as two digits', this.date.strftime('%y') === '9') // fail on purpose
  },
  'test format shorthand %F': function () {
    assert('%F should act as %Y-%m-%d', this.date.strftime('%F') === '2009-10-02')
  }
})
