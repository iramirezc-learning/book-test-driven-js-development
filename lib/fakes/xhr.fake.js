const { stubFn } = require('../stub')

const fakeXHR = {
  open: stubFn(),
  send: stubFn(),
  setRequestHeader (header, value) {
    if (!this.headers) {
      this.headers = {}
    }

    this.headers[header] = value
  },
  complete (status, responseText) {
    this.status = status || 200
    this.responseText = responseText
    this.readyStateChange(4)
  },
  readyStateChange (readyState) {
    this.readyState = readyState
    this.onreadystatechange()
  }
}

module.exports = fakeXHR
