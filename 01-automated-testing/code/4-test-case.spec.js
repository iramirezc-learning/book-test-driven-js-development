require('./1-strftime')

const testCase = require('./4-test-case');
const assert = require('./2-assert');

const date = new Date(2009, 9, 2);

testCase('strftime test', {
  'test format specifier %Y': function () {
    assert('%Y should return full year', date.strftime('%Y') === '2009');
  },
  'test format specifier %m': function () {
    assert('%m should return month', date.strftime('%m') === '10');
  },
  'test format specifier %d': function () {
    assert('%d should return date', date.strftime('%d') === '02');
  },
  'test format specifier %y': function () {
    assert('%y should return year as two digits', date.strftime('%y') === '9'); // fail on purpose
  },
  'test format shorthand %F': function () {
    assert('%F should act as %Y-%m-%d', date.strftime('%F') === '2009-10-02');
  }
});