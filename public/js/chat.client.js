/* globals tddjs, alert, Ajax */

/**
 * This is the Chat Client implementation from Chapter 15
 */

(function () {
  if (typeof tddjs === 'undefined' || typeof document === 'undefined') {
    return
  }

  if (!document.getElementById || !Object.create) {
    alert('Browser is not supported')
    return
  }

  const chat = tddjs.namespace('chat')

  if (
    !chat.formController ||
    !chat.userFormController ||
    !chat.messageFormController ||
    !chat.messageListController
  ) {
    alert('Missing chat controllers')
    return
  }

  const model = Object.create(Ajax.cometClient)

  model.url = '/comet'

  const userForm = document.getElementById('userForm')
  const userFormController = Object.create(chat.userFormController)

  userFormController.setModel(model)
  userFormController.setView(userForm)
  userFormController.observe('user', function (user) {
    alert('Welcome, ' + user)
    const messages = document.getElementById('messagesList')
    const messageListController = Object.create(chat.messageListController)

    messageListController.setModel(model)
    messageListController.setView(messages, document)

    const messagesForm = document.getElementById('messagesForm')
    const messagesFormController = Object.create(chat.messageFormController)

    messagesFormController.setModel(model)
    messagesFormController.setView(messagesForm)

    model.connect()
  })
}())
