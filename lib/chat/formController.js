const tddjs = require('../tddjs')

const controller = {}

controller.setView = function setView (el) {
  if (!el) throw new SyntaxError('element is required')

  el.className = 'js-chat'
  const handler = this.handleSubmit.bind(this)
  tddjs.dom.addEventHandler(el, 'submit', handler)
  this.view = el
}

controller.setModel = function setModel (model) {
  this.model = model
}

module.exports = controller
