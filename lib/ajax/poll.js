/**
 * Ajax.poll
 */
module.exports = function (Ajax) {
  return function (url, options) {
    const poller = Object.create(Ajax.poller)
    const _options = options || {}

    poller.url = url
    poller.method = _options.method
    poller.headers = _options.headers
    poller.interval = _options.interval
    poller.success = _options.success
    poller.failure = _options.failure
    poller.complete = _options.complete
    poller.start()

    return poller
  }
}
