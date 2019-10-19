const http = require('http')

const chatController = require('./chat-controller')
const chatRoom = require('./chat-room')

const room = Object.create(chatRoom)

const server = http.createServer((req, res) => {
  console.log('REQUEST:', req.method, req.url)

  if (String(req.url).toLowerCase() === '/comet') {
    const controller = chatController.create(req, res)
    controller.chatRoom = room
    controller[req.method.toLowerCase()]()
  }
})

module.exports = server
