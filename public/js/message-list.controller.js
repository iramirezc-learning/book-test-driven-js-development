/* globals tddjs */

(function () {
  const chat = tddjs.namespace('chat')

  const controller = chat.messageListController = {}

  const escapeHTML = msg => {
    if (typeof msg === 'string') {
      msg = msg.replace(/</g, '&lt;')
      msg = msg.replace(/>/g, '&gt;')
    }
    return msg
  }

  controller.addMessage = (message) => {
    if (controller.view && controller.dom) {
      const user = message.user

      if (controller.prevUser !== user) {
        controller.prevUser = user
        const dt = controller.dom.createElement('dt')
        dt.innerHTML = `@${user}`
        controller.view.appendChild(dt)
      }

      const dd = controller.dom.createElement('dd')
      dd.innerHTML = escapeHTML(message.message)
      controller.view.appendChild(dd)

      if (controller.model && controller.model.currentUser) {
        if (dd.innerHTML.includes(`@${controller.model.currentUser}`)) {
          dd.className += 'js-yellow'
        }
      }
    }
  }

  controller.setModel = model => {
    if (typeof model !== 'object' || !model) {
      throw new TypeError('model object is required.')
    }

    if (!model.observe || typeof model.observe !== 'function') {
      throw new TypeError('model object does not support observe method.')
    }

    const handler = controller.addMessage.bind(controller)
    model.observe('message', handler)
    controller.model = model
  }

  controller.setView = (el, dom) => {
    el.className = 'js-chat'
    controller.view = el
    controller.dom = dom // work around to pass the document object
  }
})()
