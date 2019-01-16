module.exports = (shouldInstall = !Function.prototype.memoize) => {
  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Function.prototype.memoize = function () {
        const cache = {}
        const func = this

        return function (x) {
          if (!(x in cache)) {
            cache[x] = func.call(this, x)
          }

          return cache[x]
        }
      }
    }())
  }
  /* eslint-enable no-extend-native */
}
