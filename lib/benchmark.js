const logger = require('./logger')

const NAME_PAD = 2
const TOTAL_PAD = 20
const AVERAGE_PAD = 20

function getResultRow ({ name, total, average, maxPad }) {
  return `${''.padStart(NAME_PAD)}${name.padEnd(maxPad)}${String(total + 'ms (total)').padStart(TOTAL_PAD)}${String(average + 'ms (avg)').padStart(AVERAGE_PAD)}`
}

function getMinMaxResults ({ results }) {
  var min = Infinity
  var minLabel = ''
  var max = -Infinity
  var maxLabel = ''

  for (var label in results) {
    const currentAverage = results[label].average

    if (currentAverage < min) {
      min = currentAverage
      minLabel = label
    }

    if (currentAverage > max) {
      max = currentAverage
      maxLabel = label
    }
  }

  return {
    min, minLabel, max, maxLabel
  }
}

function printResults ({ benchmarkName, iterations, results, maxPad }) {
  const { minLabel, maxLabel } = getMinMaxResults({ results })

  console.log(`\n${benchmarkName} (iterations: ${iterations}):`)

  for (var name in results) {
    const { total, average } = results[name]
    const resultRow = getResultRow({ name, total, average, maxPad })

    if (name === minLabel) {
      logger.green(resultRow)
      continue
    }

    if (name === maxLabel) {
      logger.red(resultRow)
      continue
    }

    logger.log(resultRow)
  }
}

function getMaxPad (tests) {
  var testNames = Object.keys(tests).map(name => name.length)
  return Math.max(...testNames)
}
function runTests ({ tests, iterations, logs, maxPad }) {
  var runningTimes = {}

  for (var label in tests) {
    if (!Object.hasOwnProperty.call(tests, label) || typeof tests[label] !== 'function') continue

    ((name, test) => {
      var start = new Date().getTime()
      var l = iterations

      while (l--) {
        test()
      }

      var total = new Date().getTime() - start
      var average = total / iterations

      runningTimes[name] = { total, average }

      logs && logger.log(getResultRow({ name, total, average, maxPad }))
    })(label, tests[label])
  }

  return runningTimes
}

function _runBenchmark ({ name: benchmarkName, tests, iterations, logs }) {
  const maxPad = getMaxPad(tests)
  const runningTimes = runTests({ tests, iterations, logs, maxPad })

  printResults({ benchmarkName, results: runningTimes, iterations, maxPad })

  return runningTimes
}

function runBenchmark ({ name = '', tests = {}, iterations = 1, logs = true }) {
  return _runBenchmark({ name, tests, iterations, logs })
}

module.exports = runBenchmark
