const tddjs = (function () {
  // dom
  // ==================================================
  const dom = {}

  function addClassName (element, className) {
    // replace all whitespace after start of line OR whitespace before the end of line
    className = className.replace(/^\s+|\s+$/g, '')
    // start of line OR whitespace + className + whitespace OR end of line
    const regexp = new RegExp('(^|\\s)' + className + '(\\s|$)')

    if (element && !regexp.test(element.className)) {
      className = element.className + ' ' + className
      element.className = className.replace(/^\s+|\s+$/g, '')
    }
  }

  function removeClassName (element, className) {
    className = className.replace(/^\s+|\s+$/g, '')

    const regexp = new RegExp('(^|\\s)' + className + '(\\s|$)')

    if (element && element.className) {
      element.className = element.className.replace(regexp, '')
    }
  }

  dom.addClassName = addClassName
  dom.removeClassName = removeClassName

  // tabController
  // ==================================================
  function create (element) {
    if (typeof element !== 'object' || typeof element.className !== 'string') {
      throw new TypeError('element should be an object with a string property className')
    }

    dom.addClassName(element, 'js-tab-controller')


    const tabs = Object.create(this) // 'this' point to tabController object

    element.onclick = function (event) {
      tabs.handleTabClick(event || window.event || {}) // the book specifies window.event
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

  return {
    dom,
    ui: {
      tabController: {
        TAB_TAG_NAME: 'a',
        create,
        handleTabClick,
        activateTab,
        onTabChange: () => { /* noop */ }
      }
    }
  }
}())
