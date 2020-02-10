/* globals tddjs, Observable */

(function () {
  const chat = tddjs.namespace('chat')

  const controller = chat.userFormController = tddjs.extend(Object.create(chat.formController), Observable)

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
})()
