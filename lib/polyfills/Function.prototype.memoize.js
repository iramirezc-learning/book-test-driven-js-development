module.exports = (shouldInstall = !Function.prototype.memoize) => {
  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Function.prototype.memoize = function () {
        const cache = {}
        const func = this
        const join = Array.prototype.join

        return function () {
          const key = join.call(arguments)

          if (!(key in cache)) {
            cache[key] = func.apply(this, arguments)
          }

          return cache[key]
        }
      }
    }())
  }
  /* eslint-enable no-extend-native */
}
