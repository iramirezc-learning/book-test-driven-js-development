const { stubFn } = require('../stub')

const fakeXHR = {
  open: stubFn(),
  send: stubFn(),
  readyStateChange (readyState) {
    this.readyState = readyState
    this.onreadystatechange()
  }
}

module.exports = fakeXHR
