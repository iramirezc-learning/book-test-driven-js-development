module.exports = {
  addMessage (user, message, cb) {
    process.nextTick(() => {
      let err = null
      let data

      if (!user) {
        err = new TypeError('user is required')
      }

      if (!message) {
        err = new TypeError('message is required')
      }

      if (!err) {
        if (!this.messages) {
          this.messages = []
        }

        data = {
          id: this.messages.length + 1,
          message,
          user
        }

        this.messages.push(data)
      }

      if (typeof cb === 'function') {
        cb(err, data)
      }

      console.log(user, message)
    })
  },
  // TODO: this function should be asynchronous too
  getMessagesSince (id, cb) {
    if (typeof id === 'function') {
      cb = id
      id = 0
    }

    if (typeof cb !== 'function') {
      return
    }

    if (!this.messages || this.messages.length === 0 || typeof id !== 'number') {
      return cb(null, [])
    }

    return cb(null, this.messages.splice(id))
  }
}
