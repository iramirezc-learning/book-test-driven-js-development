function namespace (stringPath) {
  let object = this
  const paths = stringPath.split('.')

  for (let i = 0, l = paths.length; i < l; i++) {
    const path = paths[i]
    if (typeof object[path] === 'undefined') {
      object[path] = {}
    }

    object = object[path]
  }

  return object
}

module.exports = namespace
