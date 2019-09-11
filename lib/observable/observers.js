module.exports = function observers (observable, event) {
  if (!observable.observers) {
    observable.observers = {}
  }

  if (!observable.observers[event]) {
    observable.observers[event] = []
  }

  return observable.observers[event]
}
