/* eslint-disable no-extend-native */

Object.defineProperties(String.prototype, {
  red: {
    get: function () {
      return '\x1b[31m' + this + '\x1b[39m'
    }
  },
  green: {
    get: function () {
      return '\x1b[32m' + this + '\x1b[39m'
    }
  }
})

const logger = {
  log: console.log.bind(this),
  green: (str) => {
    console.log('\x1b[32m' + String(str).green + '\x1b[39m')
  },
  red: (str) => {
    console.log('\x1b[31m' + String(str).red + '\x1b[39m')
  }
}

module.exports = logger
