const tddjs = require('../tddjs')

const controller = tddjs.extend(Object.create(require('./formController')), require('../observable'))

controller.handleSubmit = function handleSubmit (evt) {
  evt.preventDefault()

  if (this.view) {
    const input = this.view.getElementsByTagName('input')[0]
    const userName = input.value

    if (!userName) return

    if (this.model) {
      this.view.className = ''
      this.model.currentUser = userName
      this.notify('user', userName)
    }
  }
}

module.exports = controller
