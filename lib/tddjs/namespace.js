function namespace (stringPath) {
  let object = this
  let paths = stringPath.split('.')

  for (let i = 0, l = paths.length; i < l; i++) {
    let path = paths[i]
    if (typeof object[path] === 'undefined') {
      object[path] = {}
    }

    object = object[path]
  }

  return object
}

module.exports = namespace
