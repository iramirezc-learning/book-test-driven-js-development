const observers = require('./observers')

module.exports = function notify (event) {
  const _observers = observers(this, event)

  const args = Array.prototype.slice.call(arguments, 1)

  for (let i = 0, l = _observers.length; i < l; i++) {
    try {
      _observers[i].apply(this, args)
    } catch (e) { }
  }
}
