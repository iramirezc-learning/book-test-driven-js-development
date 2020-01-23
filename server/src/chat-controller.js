module.exports = {
  create (req, res) {
    return Object.create(this, {
      request: { value: req },
      response: { value: res }
    })
  },
  respond (statusCode, data = {}) {
    const encodedData = JSON.stringify(data)

    this.response.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': encodedData.length
    })
    this.response.write(encodedData)
    this.response.end()
  },
  post () {
    const body = []

    this.request.addListener('data', chunk => {
      body.push(chunk)
    })

    this.request.addListener('end', () => {
      const json = JSON.parse(decodeURI(Buffer.concat(body).toString()))

      this.chatRoom.addMessage(json.data.user, json.data.message)
        .then(() => {
          this.respond(201)
        })
        .catch(() => {
          this.respond(500)
        })
    })
  },
  get () {
    const id = this.request.headers['x-access-token'] || 0

    this.chatRoom.waitForMessagesSince(parseInt(id, 10))
      .then(messages => {
        this.respond(201, {
          message: messages,
          token: messages[messages.length - 1].id
        })
      })
  }
}
