/* globals tddjs, alert */

(function () {
  if (typeof tddjs === 'undefined' ||
    typeof document === 'undefined' ||
    !document.getElementById ||
    !Object.create ||
    !tddjs.namespace('chat').userFormController) {
    alert('Browser is not supported')
    return
  }

  const chat = tddjs.chat
  const model = {}
  const userForm = document.getElementById('userForm')
  const userController = Object.create(chat.userFormController)

  userController.setModel(model)
  userController.setView(userForm)
  userController.observe('user', function (user) {
    alert('Welcome, ' + user)
  })
}())
