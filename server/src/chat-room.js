module.exports = {
  addMessage (user, message) {
    console.log(user, message)

    return new Promise((resolve, reject) => {
      if (!user) return reject(new TypeError('user is required'))
      if (!message) return reject(new TypeError('message is required'))

      if (!this.messages) {
        this.messages = []
      }

      const data = {
        id: this.messages.length + 1,
        message,
        user
      }

      this.messages.push(data)

      resolve(data)
    })
  },
  getMessagesSince (id) {
    return new Promise((resolve) => {
      resolve((this.messages || []).splice(id || 0))
    })
  }
}
