const isOwnProperty = (function () {
  const hasOwn = Object.prototype.hasOwnProperty

  if (typeof hasOwn === 'function') {
    return function (object, property) {
      return hasOwn.call(object, property)
    }
  } else {
    // provide an emulation
    throw new Error('isOwnProperty is not implemented')
  }
}())

module.exports = isOwnProperty
