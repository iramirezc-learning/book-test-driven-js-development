/* globals tddjs */

(function () {
  const chat = tddjs.namespace('chat')

  if (!chat.formController) throw new Error('chat.formController not found.')

  const controller = chat.messageFormController = Object.create(chat.formController)

  controller.handleSubmit = function (evt) {
    evt.preventDefault()

    const input = this.view.getElementsByTagName('input')[0]

    if (!input.value) return

    this.model.notify('message', {
      user: this.model.currentUser,
      message: input.value
    })

    input.value = ''
  }
})()
