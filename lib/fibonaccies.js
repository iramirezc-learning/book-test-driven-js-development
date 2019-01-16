require('./polyfills/Function.prototype.memoize')()

const fibonacci = (n) => {
  if (n === 0) return 0
  if (n === 1) return 1

  return fibonacci(n - 2) + fibonacci(n - 1)
}

const fibonacciMemoized = (function () {
  const cache = {
    0: 0,
    1: 1
  }

  function _fibonacci (n) {
    if (!(n in cache)) {
      cache[n] = _fibonacci(n - 2) + _fibonacci(n - 1)
    }

    return cache[n]
  }

  return _fibonacci
}())

module.exports = {
  fibonacci,
  fibonacciFast: fibonacci.memoize(),
  fibonacciMemoized
}
