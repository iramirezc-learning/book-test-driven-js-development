function stubFn (returnValue) {
  const fn = function () {
    fn.called = true
    fn.args = Array.prototype.slice.call(arguments)
    return returnValue
  }

  fn.called = false

  return fn
}

module.exports = {
  stubFn
}
