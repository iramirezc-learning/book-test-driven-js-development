const { stubFn } = require('../stub')

const fakeXHR = {
  open: stubFn(),
  send: stubFn(),
  setRequestHeaders (header, value) {
    if (!this.headers) {
      this.headers = {}
    }

    this.headers[header] = value
  },
  readyStateChange (readyState) {
    this.readyState = readyState
    this.onreadystatechange()
  }
}

module.exports = fakeXHR