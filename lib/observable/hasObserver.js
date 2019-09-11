const observers = require('./observers')

module.exports = function hasObserver (event, observer) {
  const _observers = observers(this, event)

  for (let i = 0, l = _observers.length; i < l; i++) {
    if (_observers[i] === observer) return true
  }

  return false
}
