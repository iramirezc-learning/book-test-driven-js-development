# Summary - Part II: JavaScript for Programmers

## Chapter 8: ECMAScript 5th Edition

### 8.1 The Close Future of JavaScript

> there is no relevant technical info to remember.

### 8.2 Updates to the Object Model

#### Inheritance using Object.create and prototypes

```js
const Circle = function (radius) {
  let _radius

  const circle = Object.create(Circle.prototype, {
    radius: {
      enumerable: true,
      get () {
        return _radius
      },
      set (newRadius) {
        if (typeof newRadius !== 'number' || newRadius <= 0) {
          throw new Error('radius should be > 0')
        }

        _radius = newRadius
      }
    }
  })

  circle.radius = radius

  return circle
}

Circle.prototype = Object.create(Circle.prototype, {
  diameter: {
    enumerable: true,
    get () {
      return this.radius * 2
    }
  }
})

```

#### Inheritance using Object.create and functions

```js
const Circle = Object.create({}, {
  diameter: {
    enumerable: true,
    get () {
      return this.radius * 2
    }
  },
  create: {
    value: function (radius) {
      const _circle = Object.create(this, {
        radius: {
          value: radius,
          enumerable: true,
          writable: true
        }
      })
      return _circle
    }
  }
})

```

### 8.3 Strict Mode

#### important features supported by strict mode

> * not allowing creation of global variables
> * not allowing parameters with the same name in a function
> * not allowing the mutation of the parameters
> * not coercing the `this` to the global object when not provided
> * throwing an error when trying to change a non-writable property
> * throwing an error when trying to extend a sealed object
> * throwing an error when trying to delete a non-configurable property
> * not allowing the with operator
> * not allowing octal literals

### 8.4 Various Additions and Improvements

#### other new features included in ECMAScript 5

> * native support for JSON (stringify, parse, and dates)
> * Function.prototype.bind
> * more static methods for Arrays (isArray)
> * more instance methods for Arrays (filter, indexOf, lastIndexOf, every, some, forEach, map, reduce, reduceRight)
