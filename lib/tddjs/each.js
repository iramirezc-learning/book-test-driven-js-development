const isOwnProperty = require('./isOwnProperty')
// Returns an array of properties that are not
// exposed in a for-in loop on the provided object

const each = (function () {
  function unEnumerated (object, properties) {
    const len = properties.length

    // set all properties (in the array) to the object as true.
    for (let i = 0; i < len; i++) {
      object[properties[i]] = true
    }

    let enumerated = len

    // check if properties appear as enumerated
    // and set them as false
    // decrement the count of enumerated properties.
    for (let prop in object) {
      if (isOwnProperty(object, prop)) {
        enumerated -= 1
        object[prop] = false
      }
    }

    // if there are no enumerated properties, exit.
    if (!enumerated) {
      return
    }

    let needsFix = []

    // check for the properties that should have appeared
    // as enumerable but they did not.
    for (let i = 0; i < len; i++) {
      if (object[properties[i]]) {
        needsFix.push(properties[i])
      }
    }

    return needsFix
  }

  let objectFixes = unEnumerated({}, [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'constructor',
    'propertyIsEnumerable'
  ])

  let functionFixes = unEnumerated(function noop () { }, [
    'call',
    'apply',
    'prototype'
  ])

  if (functionFixes && objectFixes) {
    functionFixes = objectFixes.concat(functionFixes)
  }

  const needsFix = { 'function': functionFixes, 'object': objectFixes }

  return function (object, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback is not a function')
    }

    // normal loop, should expose all enumerable properties
    // in conforming browsers
    for (let prop in object) {
      if (isOwnProperty(object, prop)) {
        callback(prop, object[prop])
      }
    }

    // loop additional properties in non-conforming browsers
    let fixes = needsFix[typeof object]

    if (fixes) {
      let prop
      for (let i = 0, len = fixes.length; i < len; i++) {
        prop = fixes[i]
        if (isOwnProperty(object, prop)) {
          callback(prop, object[prop])
        }
      }
    }
  }
}())

module.exports = each
