function removeClassName (element, className) {
  className = className.replace(/^\s+|\s+$/g, '')

  const regexp = new RegExp('(^|\\s)' + className + '(\\s|$)')

  if (element && element.className) {
    element.className = element.className.replace(regexp, '')
  }
}

module.exports = removeClassName
