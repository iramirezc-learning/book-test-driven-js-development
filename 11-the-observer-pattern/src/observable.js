function _observers (observable, event) {
  if (!observable.observers) {
    observable.observers = {}
  }

  if (!observable.observers[event]) {
    observable.observers[event] = []
  }

  return observable.observers[event]
}

function observe (event, observer) {
  if (typeof observer !== 'function') {
    throw new TypeError('observer is not a function')
  }

  _observers(this, event).push(observer)
}

function hasObserver (event, observer) {
  const observers = _observers(this, event)

  for (let i = 0, l = observers.length; i < l; i++) {
    if (observers[i] === observer) return true
  }

  return false
}

function notify (event) {
  const observers = _observers(this, event)

  const args = Array.prototype.slice.call(arguments, 1)

  for (let i = 0, l = observers.length; i < l; i++) {
    try {
      observers[i].apply(this, args)
    } catch (e) { }
  }
}

const observable = {
  observe,
  hasObserver,
  notify
}

module.exports = observable
