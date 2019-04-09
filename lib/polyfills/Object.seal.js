module.exports = (shouldInstall = !Object.seal && Object.getOwnPropertyNames && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.preventExtensions) => {
  let original

  if (Object.seal) {
    original = Object.seal
  }

  function uninstall () {
    if (original) {
      Object.seal = original
    }
  }

  /* eslint-disable no-extend-native */
  if (shouldInstall) {
    (function () {
      Object.seal = function (object) {
        const props = Object.getOwnPropertyNames(object)

        for (let i = 0, len = props.length; i < len; i++) {
          const descriptor = Object.getOwnPropertyDescriptor(object, props[i])

          if (descriptor.configurable) {
            Object.defineProperty(object, props[i], {
              configurable: false
            })
          }
        }

        Object.preventExtensions(object)
      }
    }())
  }
  /* eslint-enable no-extend-native */

  return { uninstall }
}
