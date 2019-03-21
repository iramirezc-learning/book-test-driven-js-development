module.exports = (shouldInstall = !Object.create) => {
  let original

  if (Object.create) {
    original = Object.create
  }

  function uninstall () {
    if (original) {
      Object.create = original
    }
  }

  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Object.create = function (object) {
        function F () { /* noop */ }
        F.prototype = object
        return new F()
      }
    }())
  }
  /* eslint-enable no-extend-native */

  return { uninstall }
}
