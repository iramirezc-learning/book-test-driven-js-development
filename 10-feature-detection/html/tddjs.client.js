// tddjs namespace
// ==================================================
const tddjs = (function () {
  const tddjs = {}

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
