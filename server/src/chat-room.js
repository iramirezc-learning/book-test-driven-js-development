const EventEmitter = require('events').EventEmitter

const chatRoom = Object.create(EventEmitter.prototype, {
  addMessage: {
    value (user, message) {
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

        this.emit('message', data)

        resolve(data)
      })
    }
  },
  getMessagesSince: {
    value (id) {
      return new Promise((resolve) => {
        resolve((this.messages || []).splice(id || 0))
      })
    },
    writable: true // NOTE: This needs to be writable so I can stub it.
  },
  waitForMessagesSince: {
    value (id) {
      return new Promise((resolve, reject) => {
        this.getMessagesSince(id)
          .then(msgs => {
            if (msgs.length) {
              resolve(msgs)
            } else {
              this.addListener('message', (msg) => {
                this.removeListener('message', this.listeners('message')[0])
                resolve([msg])
              })
            }
          })
          .catch(reject)
      })
    }
  }
})

module.exports = chatRoom
