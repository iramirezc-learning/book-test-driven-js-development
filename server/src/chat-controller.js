module.exports = {
  create (req, res) {
    return Object.create(this, {
      request: { value: req },
      response: { value: res }
    })
  },
  post () {
    const body = []

    this.request.addListener('data', chunk => {
      body.push(chunk)
    })

    this.request.addListener('end', () => {
      const json = JSON.parse(decodeURI(Buffer.concat(body).toString()))

      this.chatRoom.addMessage(json.data.user, json.data.message)
      this.response.writeHead(201)
      this.response.end()
    })
  }
}
