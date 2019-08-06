require('../src/1-strftime')

const assert = require('../src/2-assert')
const output = require('../src/3-output-color')

const date = new Date(2000, 11, 31)

const testCases = [
  { value: date, format: '%d', expected: '31' },
  { value: date, format: '%m', expected: '12' },
  { value: date, format: '%F', expected: '2000-12-30' }, // fail on purpose
  { value: date, format: '%y', expected: '00' },
  { value: date, format: '%Y', expected: '2000' }
]

testCases.forEach(test => {
  const { value, format, expected } = test

  try {
    assert(`Expected: ${value.strftime(format)} to be equal to: ${expected}`, value.strftime(format) === expected)
  } catch (e) {
    output(e.message, 'red')
  }
})

output((assert.count + ' tests OK'), 'green')
