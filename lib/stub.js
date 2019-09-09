function stubFn (returnValue) {
  const fn = function () {
    fn.called = true
    fn.args = Array.prototype.slice.call(arguments)
    return returnValue
  }

  fn.called = false

  return fn
}

const stubDateConstructor = (function (_global) {
  const NativeDate = _global.Date

  return function (fakeDate) {
    _global.Date = function () {
      _global.Date = NativeDate
      Date = NativeDate // eslint-disable-line
      return fakeDate
    }
  }
})(global)

module.exports = {
  stubFn,
  stubDateConstructor
}
