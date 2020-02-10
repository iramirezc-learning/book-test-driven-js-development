const controller = Object.create(require('./formController'))

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

module.exports = controller
