/* globals tddjs */

(function () {
  const chat = tddjs.namespace('chat')

  if (!chat.formController) throw new Error('chat.formController not found.')

  const controller = chat.messageFormController = Object.create(chat.formController)

  controller.handleSubmit = function (evt) {
    evt.preventDefault()

    const message = this.view.getElementsByTagName('input')[0].value

    if (!message) return

    this.model.notify('message', {
      user: this.model.currentUser,
      message
    })
  }
})()
