function isHostMethod (object, property) {
  const type = typeof object[property]

  return type === 'function' ||
    (type === 'object' && !!object[property]) ||
    type === 'unknown'
}

module.exports = isHostMethod
