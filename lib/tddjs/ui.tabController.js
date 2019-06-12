const dom = require('./dom')

function create (element) {
  if (typeof element !== 'object' || typeof element.className !== 'string') {
    throw new TypeError('element should be an object with a string property className')
  }

  dom.addClassName(element, 'js-tab-controller')


  const tabs = Object.create(this) // 'this' point to tabController object

  element.onclick = function (event) {
    tabs.handleTabClick(event || {}) // the book specifies window.event
  }

  element = null

  return tabs
}

function handleTabClick (event) {
  let target = event.target || event.srcElement

  while (target && target.nodeType !== 1) { // if the node is of type text, go to the parents
    target = target.parentNode
  }

  this.activateTab(target)
}

function activateTab (element) {
  if (!element || !element.tagName || String(element.tagName).toLowerCase() !== this.TAB_TAG_NAME) return

  const className = 'active-tab'

  dom.removeClassName(this.prevTab, className)
  dom.addClassName(element, className)

  let prev = this.prevTab

  this.prevTab = element
  this.onTabChange(element, prev)
}

module.exports = {
  TAB_TAG_NAME: 'a',
  create,
  handleTabClick,
  activateTab,
  onTabChange: () => { /* noop */ }
}
