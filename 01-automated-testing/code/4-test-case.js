const assert = require('./2-assert');
const output = require('./3-output-color');

function testCase(name, tests) {
  assert.count = 0;

  let successful = 0;
  let testCount = 0;

  for (let test in tests) {
    // start of line + 'test'
    if (!/^test/.test(test)) {
      continue;
    }

    testCount++;

    try {
      tests[test]();
      output(test, 'green');
      successful++;
    } catch(e) {
      output(test + ' failed: ' +  e.message, 'red');
    }
  }

  const color = successful == testCount ? 'green' : 'red';

  output(`${testCount} tests, ${(testCount - successful)} failures`, color);
}

module.exports = testCase;