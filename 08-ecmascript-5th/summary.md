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

#### `subtitle 8.3`

> definition

### 8.4 Various Additions and Improvements

#### `subtitle 8.4`

> definition
