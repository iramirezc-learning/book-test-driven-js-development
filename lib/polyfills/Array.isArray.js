module.exports = (shouldInstall = !Array.isArray) => {
  let original

  if (Array.isArray) {
    original = Array.isArray
  }

  function uninstall () {
    if (original) {
      Array.isArray = original
    }
  }

  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Array.isArray = function (object) {
        return Object.prototype.toString.call(object) === '[object Array]'
      }
    }())
  }
  /* eslint-enable no-extend-native */

  return { uninstall }
}
