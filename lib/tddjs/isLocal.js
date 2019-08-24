function isLocal () {
  try {
    return !!(window.location && window.location.protocol.indexOf('file:') === 0)
  } catch (err) {
    return false
  }
}

module.exports = isLocal
