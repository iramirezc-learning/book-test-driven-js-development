module.exports = (shouldInstall = !Object.create && Object.defineProperties) => {
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
      Object.create = function (object, properties) {
        function F () { /* noop */ }
        F.prototype = object
        const newObj = new F()

        if (typeof properties !== 'undefined') {
          Object.defineProperties(newObj, properties)
        }

        return newObj
      }
    }())
  }
  /* eslint-enable no-extend-native */

  return { uninstall }
}
