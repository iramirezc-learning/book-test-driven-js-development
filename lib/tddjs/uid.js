let uid = (function () {
  let id = 0

  function _uid (obj) {
    if (typeof obj.__uid !== 'number') {
      obj.__uid = id++
    }

    return obj.__uid
  }

  return _uid
}())

module.exports = uid
