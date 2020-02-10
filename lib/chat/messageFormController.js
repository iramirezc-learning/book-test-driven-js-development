const controller = Object.create(require('./formController'))

controller.handleSubmit = function (evt) {
  evt.preventDefault()

  const message = this.view.getElementsByTagName('input')[0].value

  if (!message) return

  this.model.notify('message', {
    user: this.model.currentUser,
    message
  })
}

module.exports = controller
