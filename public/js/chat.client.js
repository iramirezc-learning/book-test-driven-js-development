/* globals tddjs, alert, Ajax */

/**
 * This is the Chat Client implementation from Chapter 15
 */

(function () {
  if (typeof tddjs === 'undefined' || typeof document === 'undefined') {
    return
  }

  const chat = tddjs.namespace('chat')

  if (!document.getElementById || !Object.create ||
    !chat.userFormController || !chat.messageListController) {
    alert('Browser is not supported')
    return
  }

  const model = Object.create(Ajax.cometClient)
  model.url = '/comet'

  const userForm = document.getElementById('userForm')

  chat.userFormController.setModel(model)
  chat.userFormController.setView(userForm)
  chat.userFormController.observe('user', function (user) {
    alert('Welcome, ' + user)
    const messages = document.getElementById('messages')
    chat.messageListController.setModel(model)
    chat.messageListController.setView(messages, document)

    model.connect()
  })
}())
