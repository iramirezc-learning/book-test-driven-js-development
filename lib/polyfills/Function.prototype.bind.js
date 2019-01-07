/* eslint-disable no-extend-native */
if (!Function.prototype.bind) {
  Function.prototype.bind = function bind (thisObj) {
    let targetFunction = this
    let args = Array.prototype.slice.call(arguments, 1)

    return function () {
      let receivedArgs = Array.prototype.slice.call(arguments)
      return targetFunction.apply(thisObj, args.concat(receivedArgs))
    }
  }
}
/* eslint-enable no-extend-native */
