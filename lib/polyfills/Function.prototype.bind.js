module.exports = (shouldInstall = !Function.prototype.bind) => {
  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Function.prototype.bind = function bind (thisObj) {
        let targetFunction = this
        let slice = Array.prototype.slice

        if (arguments.length > 1) {
          var args = slice.call(arguments, 1)

          return function () {
            let allArgs = args

            if (arguments.length > 0) {
              allArgs = args.concat(slice.call(arguments))
            }

            return targetFunction.apply(thisObj, allArgs)
          }
        }

        return function () {
          if (arguments.length > 0) {
            return targetFunction.apply(thisObj, arguments)
          }

          return targetFunction.call(thisObj)
        }
      }
    })()
  }
  /* eslint-enable no-extend-native */
}
