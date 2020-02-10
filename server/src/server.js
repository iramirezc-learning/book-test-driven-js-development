const http = require('http')
const path = require('path')
const serveStatic = require('serve-static')

const chatController = require('./chat-controller')
const chatRoom = require('./chat-room')

const room = Object.create(chatRoom)
const serve = serveStatic(path.join(__dirname, '../../', 'public'))

const server = http.createServer((req, res) => {
  console.log('REQUEST:', req.method, req.url)

  if (String(req.url).toLowerCase().includes('/comet')) {
    const controller = chatController.create(req, res)
    controller.chatRoom = room
    controller[req.method.toLowerCase()]()
  } else {
    serve(req, res, (err) => {
      console.error(err)
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.write('<h1>Nothing to see here, move along!</h1>')
      res.end()
    })
  }
})

module.exports = server
