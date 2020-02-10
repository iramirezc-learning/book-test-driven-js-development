/* globals tddjs, Observable */

(function () {
  const chat = tddjs.namespace('chat')

  const controller = chat.userFormController = tddjs.extend({}, Observable)

  controller.handleSubmit = function handleSubmit (evt) {
    evt.preventDefault()

    if (controller.view) {
      const input = controller.view.getElementsByTagName('input')[0]
      const userName = input.value

      if (!userName) return

      if (controller.model) {
        controller.view.className = ''
        controller.model.currentUser = userName
        controller.notify('user', userName)
      }
    }
  }

  controller.setView = function setView (el) {
    if (!el) throw new SyntaxError('element is required')

    el.className = 'js-chat'
    const handler = controller.handleSubmit.bind(controller)
    tddjs.dom.addEventHandler(el, 'submit', handler)

    controller.view = el
  }

  controller.setModel = function setModel (model) {
    controller.model = model
  }
})()
