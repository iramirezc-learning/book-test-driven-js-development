const controller = {}

const escapeHTML = msg => {
  if (typeof msg === 'string') {
    msg = msg.replace(/</g, '&lt;')
    msg = msg.replace(/>/g, '&gt;')
  }
  return msg
}

controller.addMessage = function (message) {
  if (this.view && this.dom) {
    const user = message.user

    if (this.prevUser !== user) {
      this.prevUser = user
      const dt = this.dom.createElement('dt')
      dt.innerHTML = `@${user}`
      this.view.appendChild(dt)
    }

    const dd = this.dom.createElement('dd')
    dd.innerHTML = escapeHTML(message.message)
    this.view.appendChild(dd)

    if (this.model && this.model.currentUser) {
      if (dd.innerHTML.includes(`@${this.model.currentUser}`)) {
        dd.className += 'js-yellow'
      }
    }
  }
}

controller.setModel = function (model) {
  if (typeof model !== 'object' || !model) {
    throw new TypeError('model object is required.')
  }

  if (!model.observe || typeof model.observe !== 'function') {
    throw new TypeError('model object does not support observe method.')
  }

  const handler = this.addMessage.bind(this)
  model.observe('message', handler)
  this.model = model
}

controller.setView = function (el, dom) {
  el.className = 'js-chat'
  this.view = el
  this.dom = dom // work around to pass the document object
}

module.exports = controller
