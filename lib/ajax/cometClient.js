const tddjs = require('../tddjs')
const observable = require('../observable')

module.exports = function (Ajax) {
  return {
    dispatch (data) {
      const observers = this.observers

      if (!observers || typeof observers.notify !== 'function') return

      tddjs.each(data, (topic, events) => {
        if (!Array.isArray(events)) return

        const len = events.length

        for (let i = 0; i < len; i++) {
          observers.notify(topic, events[i])
        }
      })
    },
    observe (topic, observer) {
      if (!this.observers) {
        this.observers = Object.create(observable)
      }

      this.observers.observe(topic, observer)
    },
    connect () {
      if (!this.url) {
        throw new TypeError('"url" is required')
      }

      const headers = {
        'Content-Type': 'application/json',
        'X-Access-Token': ''
      }

      if (!this.poller) {
        this.poller = Ajax.poll(this.url, {
          success: function (xhr) {
            // NOTE: this should not happen here
            // separation of concerns needs to be applied.
            // May be Ajax.request should handle the parsing.
            try {
              const jsonResponse = JSON.parse(xhr.responseText)

              if (typeof jsonResponse.token !== 'undefined') {
                headers['X-Access-Token'] = jsonResponse.token
                delete jsonResponse.token
              }

              this.dispatch(jsonResponse)
            } catch (err) { }
          }.bind(this),
          headers
        })
      }
    },
    notify (topic, data) {
      if (!this.url) {
        throw new TypeError('url is required')
      }

      if (!data) {
        throw new TypeError('data is required')
      }

      Ajax.post(this.url, {
        data: JSON.stringify({
          topic,
          data
        })
      })
    }
  }
}
