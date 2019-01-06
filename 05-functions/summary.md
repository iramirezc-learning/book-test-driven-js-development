# Summary - Part II: JavaScript for Programmers

## Chapter 5: Functions

### 5.1 Defining Functions

#### `first class objects`

> functions that can be stored in variables or as properties or passed as arguments to other functions

#### `function definition` aka `function declaration`

```js
function assert(message, expr) {
  if (!expr) {
    throw new Error(message)
  }
  assert.count++

  return true
}

assert.count = 0
```

> function definitions start with the `function` keyword
>
> `assert` is the function identifier
>
> functions can have one or more formal parameters called `arguments`
>
> functions have a *body* between `{}`
>
> functions may `return` something or `undefined` by default
>
> functions can have properties like `count`

#### `function expression`

##### anonymous function assigned to a variable

```js
var sum = function(a, b) {
  return a + b
}
```

##### anonymous function called immediately

```js
(function () {
  console.log('Hello!')
})()
```

##### anonymous function as object property

```js
var calculator = {
  sum: function (a, b) {
    return a + b
  },
  times(a, b) { // ES6 Syntax
    return a * b
  }
}
console.log(calculator.sum(5, calculator.times(3, 5))) // 20
```

##### anonymous function passed as argument to another function

```js
function say(something) {
  if (typeof something == 'function') something()
}

say(function() {
  console.log('Hi!')
})
```

##### anonymous function returned from another function

```js
function times(n) {
  return function (m) {
    return n * m
  }
}

console.log(times(3)(5)) // 15
```

### 5.2 Calling Functions

#### `formal parameters`

> are those specified when declaring a function. `a` and `b` are the formal parameters in the function below

```js
function sum(a, b) { return a + b }
```

#### `arguments` object

> every function has an Array-like object called `arguments` containing the arguments passed to a function

```js
function sum() { return arguments[0] + arguments[1] }
console.log(sum(2, 3)) // 5
```

### 5.3 Scope and Execution Context

#### types of scope

> global
>
> function
>
> block (new in ECMAScript 6)

### 5.4 The `this` Keyword

#### this trick to implicitly set `this` is awesome

```js
function addToArray() {
  var targetArr = arguments[0];
  arguments.slice = Array.prototype.slice;
  var add = arguments.slice(1);
  return targetArr.concat(add);
}
```
