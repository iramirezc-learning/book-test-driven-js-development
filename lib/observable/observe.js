const observers = require('./observers')

module.exports = function observe (event, observer) {
  if (typeof observer !== 'function') {
    throw new TypeError('observer is not a function')
  }

  observers(this, event).push(observer)
}
