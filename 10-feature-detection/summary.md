# Summary - Part II: JavaScript for Programmers

## Chapter 10: Feature Detection

### 10.1 Browser Sniffing

#### `there are two ways of browser sniffing:`

> * user agent
> * object detection

#### `state about browser detection`

> Browser detection, in any form, does not scale, is not maintainable, and is inadequate as a cross-browser scripting strategy.

### 10.2 Using Object Detection for Good

#### `testing for existence`

```js
function addEventHandler(element, type, listener) {
  if (element.addEventListener) {
    element.addEventListener(type, listener, false)
  } else if (element.attachEvent && listener.call) {
    element.attachEvent("on" + type, function () {
      return listener.call(element, window.event)
    })
  } else {
    // Possibly fall back to event properties or abort
  }
}
```

#### `type checking`

```js
function addEventHandler(element, type, listener) {
  if (typeof element.addEventListener == "function") {
    element.addEventListener(type, listener, false)
  } else if (typeof element.attachEvent == "function"
    && typeof listener.call == "function") {
    element.attachEvent("on" + type, function () {
      return listener.call(element, window.event)
    })
  } else {
    // Possibly fall back to DOM0 event properties or abort
  }
}
```

#### `native and host objects`

```js
function isHostMethod(object, property) {
  var type = typeof object[property]
  return type == "function"
    || (type == "object" && !!object[property])
    || type == "unknown"
}

function addEventHandler(element, type, listener) {
  if (isHostMethod(element, "addEventListener")) {
    element.addEventListener(type, listener, false)
  } else if (isHostMethod(element, "attachEvent")
    && listener.call) {
    element.attachEvent("on" + type, function () {
      return listener.call(element, window.event)
    })
  } else {
    // Possibly fall back to DOM0 event properties or abort
  }
}
```

#### `sample testing`

> Test that the feature you would like to use actually does what you expect to do. See the following script that tests the `String.prototype.replace` method.

```js
// test for existence
if (!String.prototype.replace) return

// test for correctness
const str = '%a %b'
const regexp = /%([a-zA-Z])/g
const replaced = str.replace(regexp, (m, c) => {
  return `[${m} ${c}]` // m -> match, c -> current
})
if (replaced !== '[%a a] [%b b]') return

// now is safe to be used
```

### 10.3 Feature Testing DOM Events

```js
// utility implemented by Juriy Zaytsev.
const TAG_NAMES = {
  select: 'input',
  change: 'input',
  submit: 'form',
  reset: 'form',
  error: 'img',
  load: 'img',
  abort: 'img'
}

function isEventSupported (eventName) {
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
```

### 10.4 Feature Testing CSS Properties

```js
const isCSSPropertySupported = (function () {
  const el = document.createElement('div')

  return function isCSSPropertySupported (prop) {
    return typeof el.style[prop] === 'string'
  }
}())
```

### 10.5 Cross-Browser Event Handlers

> See [html test file](./html/index.html)

### 10.6 Using Feature Detection

> Feature detection is a powerful tool in cross-browser scripting. It can allow many features to be implemented for a very wide array of browsers; old, current, and future ones.
>
> That doesn't mean you should support every browser, you can always provide with the basic functionality of your app if the feature is not in the browser, or you can always abort the implementation of your fallback.
