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

module.exports = {
  addClassName,
  removeClassName
}
