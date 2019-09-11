/**
 * Ajax.poller
 */
module.exports = function (Ajax) {
  return {
    start () {
      const poller = this

      if (!poller.url) {
        throw new TypeError('Must specify URL to poll.')
      }

      let interval = 1000

      if (typeof poller.interval === 'number') {
        interval = poller.interval
      }

      // used as cache buster too
      const requestStart = new Date().getTime()

      let queryParams = `ts=${requestStart}`

      if (poller.url.includes('?')) {
        queryParams = `&${queryParams}`
      } else {
        queryParams = `?${queryParams}`
      }

      Ajax.request(`${poller.url}${queryParams}`, {
        headers: poller.headers,
        success: poller.success,
        failure: poller.failure,
        complete: function () {
          const elapsed = new Date().getTime() - requestStart

          const remaining = interval - elapsed

          setTimeout(function () {
            poller.start()
          }, Math.max(0, remaining))

          if (typeof poller.complete === 'function') {
            poller.complete()
          }
        }
      })
    }
  }
}
