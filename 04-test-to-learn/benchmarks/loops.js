/* eslint-disable no-unused-vars */

const runBenchmark = require('../../lib/benchmark')
const loops = require('../../lib/loops')

function init (cb = () => { }, { loopLength }) {
  const ARRAY = []

  for (let i = 0; i < loopLength; i++) {
    ARRAY[i] = `item ${i}`
  }

  cb(ARRAY)
}

// Benchmarks
// ==================================================
init((data) => {
  var tests = {}
  // build new tests object providing data to each function
  for (var f in loops) {
    tests[f] = loops[f].bind(null, data)
  }

  runBenchmark({
    name: `Loop Performance (data size: ${data.length})`,
    tests,
    iterations: 1000,
    logs: true
  })
}, { loopLength: 100000 })
