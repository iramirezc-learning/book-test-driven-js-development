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

#### `subtitle 7.3`

> definition

### 7.4 Encapsulation & Information Hiding

#### `subtitle 7.4`

> definition

### 7.5 Object Composition & Mixins

#### `subtitle 7.5`

> definition
