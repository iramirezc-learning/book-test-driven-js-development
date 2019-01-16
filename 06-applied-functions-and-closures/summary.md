# Summary - Part II: JavaScript for Programmers

## Chapter 6: Applied Functions & Closures

### 6.1 Binding Functions

#### implementation of `curry`

> curry is similar to bind. The difference is that curry will always have at least one argument, so no need for optimization.

```js
if (!Function.prototype.curry) {
  (function () {
    var slice = Array.prototype.slice

    Function.prototype.curry = function () {
      var target = this
      var args = slice.call(arguments)
      return function () {
        var allArgs = args
        if (arguments.length > 0) {
          allArgs = args.concat(slice.call(arguments))
        }
        return target.apply(this, allArgs)
      }
    }
  }())
}
```

use-case:

```js
String.prototype.trim = String.prototype.replace.curry(/^\s+|\s+$/g, '')
```

### 6.2 Immediately Called Anonymous Functions

#### ... aka `IIFE` Immediately Invoked Function Expression

Example:

```js
(function(){
  /* your code goes here */
}())
```

> **Benefits:**
> * Does not pollute the global scope
> * Simulates block scope

#### namespaces in JS

> JS does not support namespaces natively but it doesn't need them. To create a namespace all you have to do is create a global object with a name and attach it properties, just like a module.

example:

```js
var calculator = {
  add: () => { /* ... */ },
  times: () => {},
  subtract: () => {},
  divideBy: () => {}
}
```

### 6.3 Stateful Functions

#### a stateful function

> is a function that can "preserve" state
>
> in JavaScript this can be achieved using closures

example:

```js
function Counter() {
  let _count = 0

  function count () {
    return ++_count
  }

  function getCount () {
    return _count
  }

  return {
    count,
    getCount
  }
}

const counter = Counter()
counter.count() // 1
counter.count() // 2
counter.count() // 3
console.log(counter.getCount()) // 3
```

### 6.4 Memoization

#### What is Memoization?

> is a technique that can be employed to avoid carrying out expensive operations repeatedly, thus speeding up programs.

example:

```js
// Fibonacci using memoization
const fibonacciMemoized = (function () {
  const cache = {
    0: 0,
    1: 1
  }

  function _fibonacci (n) {
    if (!(n in cache)) {
      cache[n] = _fibonacci(n - 2) + _fibonacci(n - 1)
    }

    return cache[n]
  }

  return _fibonacci
}())

console.log(fibonacciMemoized(78)) // 8944394323791464 (very fast!)
// NOTE: after fibonacciMemoized(79) results will be invalid due to number overflow.
// fibonacciMemoized(79) will ouput: 14472334024676220 and correct is: 14472334024676221
```
