// tddjs namespace
// ==================================================
const tddjs = (function () {
  const tddjs = {}

  /**
   * namespace
   */
  tddjs.namespace = function (stringPath) {
    let object = this
    const paths = stringPath.split('.')

    for (let i = 0, l = paths.length; i < l; i++) {
      const path = paths[i]
      if (typeof object[path] === 'undefined') {
        object[path] = {}
      }

      object = object[path]
    }

    return object
  }

  /**
   * isHostMethod
   */
  tddjs.isHostMethod = function (object, property) {
    const type = typeof object[property]

    return type === 'function' ||
      (type === 'object' && !!object[property]) ||
      type === 'unknown'
  }

  /**
   * isEventSupported
   */
  tddjs.isEventSupported = (function () {
    const TAG_NAMES = {
      select: 'input',
      change: 'input',
      submit: 'form',
      reset: 'form',
      error: 'img',
      load: 'img',
      abort: 'img'
    }

    return function isEventSupported (eventName) {
      const tagName = TAG_NAMES[eventName]
      let el = document.createElement(tagName || 'div')
      const _eventName = `on${eventName}`
      let isSupported = (_eventName in el)

      if (!isSupported) {
        el.setAttribute(_eventName, 'return;')
        isSupported = typeof el[_eventName] === 'function'
      }

      el = null

      return isSupported
    }
  }())

  /**
   * isCSSPropertySupported
   */
  tddjs.isCSSPropertySupported = (function () {
    const el = document.createElement('div')

    return function isCSSPropertySupported (prop) {
      return typeof el.style[prop] === 'string'
    }
  }())

  /**
   * isLocal
   */
  tddjs.isLocal = function isLocal () {
    return !!(window.location && window.location.protocol.indexOf('file:') === 0)
  }

  /**
   * isOwnProperty
   */
  tddjs.isOwnProperty = (function () {
    const hasOwn = Object.prototype.hasOwnProperty

    if (typeof hasOwn === 'function') {
      return function (object, property) {
        return hasOwn.call(object, property)
      }
    } else {
      // provide an emulation
      throw new Error('isOwnProperty is not implemented')
    }
  }())

  /**
   * extend
   */
  tddjs.extend = function extend (target, source) {
    target = target || {}

    if (!source) return target

    tddjs.each(source, (prop, val) => {
      target[prop] = val
    })

    return target
  }

  /**
   * each
   */
  tddjs.each = (function () {
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
      for (const prop in object) {
        if (tddjs.isOwnProperty(object, prop)) {
          enumerated -= 1
          object[prop] = false
        }
      }

      // if there are no enumerated properties, exit.
      if (!enumerated) {
        return
      }

      const needsFix = []

      // check for the properties that should have appeared
      // as enumerable but they did not.
      for (let i = 0; i < len; i++) {
        if (object[properties[i]]) {
          needsFix.push(properties[i])
        }
      }

      return needsFix
    }

    const objectFixes = unEnumerated({}, [
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

    const needsFix = { function: functionFixes, object: objectFixes }

    return function (object, callback) {
      if (typeof callback !== 'function') {
        throw new TypeError('callback is not a function')
      }

      // normal loop, should expose all enumerable properties
      // in conforming browsers
      for (const prop in object) {
        if (tddjs.isOwnProperty(object, prop)) {
          callback(prop, object[prop])
        }
      }

      // loop additional properties in non-conforming browsers
      const fixes = needsFix[typeof object]

      if (fixes) {
        let prop
        for (let i = 0, len = fixes.length; i < len; i++) {
          prop = fixes[i]
          if (tddjs.isOwnProperty(object, prop)) {
            callback(prop, object[prop])
          }
        }
      }
    }
  }())

  /**
   * urlParams
   */
  tddjs.urlParams = function urlParams (object) {
    if (!object) {
      return ''
    }

    if (typeof object === 'string') {
      return encodeURI(object)
    }

    const pieces = []

    tddjs.each(object, (prop, val) => {
      pieces.push(`${encodeURIComponent(prop)}=${encodeURIComponent(val)}`)
    })

    return pieces.join('&')
  }

  // dom namespace
  // ==================================================
  tddjs.dom = (function () {
    const dom = {}

    /**
     * _addEventHandler
     */
    const _addEventHandler = (function () {
      if (!Function.prototype.call) throw new Error('`Function.prototype.call` not found.')

      function normalizeEvent (event) {
        event.preventDefault = function () {
          event.returnValue = false
        }

        event.target = event.srcElement

        // more normalization can go here

        return event
      }

      if (tddjs.isHostMethod(document, 'addEventListener')) {
        console.info('using `addEventListener` method')
        return function _addEventHandler (element, event, listener) {
          element.addEventListener(event, listener, false)
        }
      } else if (tddjs.isHostMethod(document, 'attachEvent')) {
        console.info('using `attachEvent` method')
        return function _addEventHandler (element, event, listener) {
          element.attachEvent('on' + event, function () {
            const _event = normalizeEvent(window.event)
            listener.call(element, _event)
            return _event.returnValue
          })
        }
      } else {
        throw new Error('Could not implement `_addEventHandler.`')
      }
    }())

    /**
     * addEventHandler
     */
    dom.addEventHandler = function addEventHandler (element, event, listener) {
      if (dom.customEvents && dom.customEvents[event]) {
        return dom.customEvents[event](element, listener)
      }

      return _addEventHandler(element, event, listener)
    }

    /**
     * contains
     */
    dom.contains = function contains (element, target) {
      // TODO
      return false
    }

    /**
     * mouseenter
     */
    function mouseenter (el, listener) {
      let current = null

      _addEventHandler(el, 'mouseover', function (event) {
        // when there's no current selected or
        // is different than the current element
        // trigger the listener
        if (current !== el) {
          current = el
          listener.call(el, event)
        }
      })

      _addEventHandler(el, 'mouseout', function (e) {
        let target = e.relatedTarget || e.toElement

        try {
          if (target && !target.nodeName) {
            target = target.parentNode
          }
        } catch (err) {
          return
        }

        if (el !== target && !dom.contains(el, target)) {
          current = null
        }
      })
    }

    // register custom events
    const custom = dom.customEvents = {}

    if (!tddjs.isEventSupported('mouseenter') &&
      tddjs.isEventSupported('mouseover') &&
      tddjs.isEventSupported('mouseout')) {
      console.info('registering custom events `mouseenter`')
      custom.mouseenter = mouseenter
    }

    dom.supportsEvent = function supportsEvent (event) {
      return tddjs.isEventSupported(event) || !!custom[event]
    }

    return dom
  }())

  return tddjs
}())

window.tddjs = tddjs
