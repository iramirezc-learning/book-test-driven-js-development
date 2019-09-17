/**
 * This is the client implementation of the Observable library from Chapter 11
 */

const Observable = (function () {
  function observers (observable, event) {
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

    observers(this, event).push(observer)
  }

  function hasObserver (event, observer) {
    const _observers = observers(this, event)

    for (let i = 0, l = _observers.length; i < l; i++) {
      if (_observers[i] === observer) return true
    }

    return false
  }

  function notify (event) {
    const _observers = observers(this, event)

    const args = Array.prototype.slice.call(arguments, 1)

    for (let i = 0, l = _observers.length; i < l; i++) {
      try {
        _observers[i].apply(this, args)
      } catch (e) { }
    }
  }

  return {
    observe,
    hasObserver,
    notify
  }
})()

window.Observable = Observable
