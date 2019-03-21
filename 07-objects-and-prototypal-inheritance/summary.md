# Summary - Part II: JavaScript for Programmers

## Chapter 7: Objects and Prototypal Inheritance

### 7.1 Objects & Properties

#### Object literal

example:

```js
var car = {
  model: {
    year: "1998",
    make: "Ford",
    model: "Mondeo"
  },
  color: 'Red',
  seats: 5,
  doors: 5,
  accessories: ['Air Condition', 'Electric Windows'],
  drive () {
    console.log('Vroooom!')
  }
}
```

### 7.2 Creating Objects with Constructors

#### constructors vs functions

> JavaScript does not make distinction between constructors and normal functions, any function can be called with the `new` operator, however there's a convention to capitalize the name of the functions that are used as constructors

example:

```js
function Car(model) {
  this.model = model;
}

function call(to) {
  // make a call
}

// function used as constructor
var car = new Car('ioniq');

call('mom');
```

#### detecting constructor misuse

```js
function Circle(radius) {
  if (!(this instanceof Circle)) {
    return new Circle(radius);
  }
  this.radius = radius;
}
```

### 7.3 Pseudo-Classical Inheritance

#### the intermediate constructor

```js
var Circle = function Circle (radius) {
  this.radius = radius
};
(function (p) {
  p.diameter = function () {
    return this.radius * 2
  }
}(Circle.prototype))

var Sphere = function Sphere (radius) {
  this.radius = radius
}
Sphere.prototype = (function () {
  function F () { }
  F.prototype = Circle.prototype
  return new F()
}())
Sphere.prototype.constructor = Sphere

var sphere = new Sphere(6)
sphere.diameter() // 12
```

#### the `inherit` function with `_super` implementation

```js
if (!Function.prototype.inherit) {
  (function () {
    function F () { /* intermediate constructor */ }
    Function.prototype.inherit = function (parentFunction) {
      F.prototype = parentFunction.prototype
      this.prototype = new F()
      this.prototype.constructor = this
      this.prototype._super = parentFunction.prototype
    }
  }())
}
var Circle = function Circle (radius) {
  this.radius = radius
};

(function (p) {
  p.diameter = function () {
    return this.radius * 2
  }
  p.circumference = function () {
    return this.diameter() * Math.PI
  }
  p.area = function () {
    return this.radius * this.radius * Math.PI
  }
}(Circle.prototype))

var Sphere = function Sphere (radius) {
  Circle.call(this, radius)
}

Sphere.inherit(Circle);

(function (p) {
  p.area = function () {
    return this._super.area.call(this) * 4
  }
}(Sphere.prototype))

var sphere = new Sphere(3)
sphere.diameter() // 6
sphere.area() // 113.09...
```

#### the `_super` method

> THIS IS NOT RECOMMENDED FOR PRODUCTION as it is not performant
>
> Downside for this is that inheritance is only static. if you would like to add more methods to the Person class, you will need to redefine that method again in the LoudPerson class. See the next note "the `_super` method helper"

```js
if (!Function.prototype.inheritFrom) {
  (function () {
    function F () { /* intermediate constructor */ }
    Function.prototype.inheritFrom = function (parentFunction, methods) {
      F.prototype = parentFunction.prototype
      this.prototype = new F()
      this.prototype.constructor = this
      var subProto = this.prototype
      tddjs.each(methods, (name, method) => {
        subProto[name] = function () {
          var returnValue
          var oldSuper = this._super
          this._super = parentFunction.prototype[name]
          try {
            returnValue = method.apply(this, arguments)
          } finally {
            this._super = oldSuper
          }
          return returnValue
        }
      })
    }
  }())
}
var Person = function (name) {
  this.name = name
}

Person.prototype = {
  constructor: Person,
  getName () {
    return this.name
  },
  speak () {
    return 'Hello'
  }
}

var LoudPerson = function (name) {
  Person.call(this, name)
}

LoudPerson.inheritFrom(Person, {
  getName () {
    return this._super().toUpperCase()
  },
  speak () {
    return this._super() + '!!!'
  }
})

var loudPerson = new LoudPerson('Rick')
loudPerson.getName() // 'RICK'
loudPerson.speak() // 'Hello!!!'
```

#### the `_super` method helper

> this `_super` method uses the implementation of the `inherit` (not the `inheritFrom`) function from the two previous examples

```js
function _super(object, methodName) {
  var method = object._super && object._super[methodName]

  if (typeof method !== 'function') {
    return
  }

  // cut the first two arguments (object and methodName)
  var args = Array.prototype.slice.call(arguments, 2)

  return method.apply(object, args)
}

// usage
function LoudPerson(name) {
  _super(this, 'constructor', name)
}
LoudPerson.inherit(Person)
LoudPerson.prototype.getName = function() {
  return _super(this, 'getName').toUpperCase()
}
LoudPerson.prototype.speak = function() {
  return _super(this, 'speak') + '!!!'
}
var loudPerson = new LoudPerson('Rick')
loudPerson.getName() // "RICK"
loudPerson.speak() // "Hello!!!"

```

### 7.4 Encapsulation & Information Hiding

#### `subtitle 7.4`

> definition

### 7.5 Object Composition & Mixins

#### `subtitle 7.5`

> definition
