const runBenchmark = require('../../lib/benchmark')
const fibonaccies = require('../../lib/fibonaccies')

// Benchmarks
// ==================================================
const N = 30
const tests = {}

for (let f in fibonaccies) {
  tests[f] = fibonaccies[f].bind(null, N)
}

runBenchmark({
  name: `Fibonacci Performance`,
  tests,
  logs: true,
  iterations: 1000
})
