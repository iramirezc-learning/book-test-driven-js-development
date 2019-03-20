/* globals describe it before after */

const assert = require('assert')

const tddjs = require('../../lib/tddjs')

describe('Chapter 07', () => {
  describe('7.1 Objects and Properties', () => {
    describe('property access', () => {
      it('should return the value of an object when accessing both dot and brackets notation', () => {
        const val = 'some value'
        const obj = { value: val }

        assert.strictEqual(obj.value, obj['value'])
      })
    })

    describe('ObjectPropertyTest', () => {
      it('should shadow a property', () => {
        const obj1 = {}
        const obj2 = {}
        // Both objects inherit Object.prototype.toString
        assert.strictEqual(obj1.toString, obj2.toString)

        const isaac = {
          name: 'Isaac',
          toString () { // this is shadowing Object.prototype.toString
            return this.name
          }
        }

        assert.notStrictEqual(obj1.toString, isaac.toString)

        delete isaac.toString // this un-shadows Object.prototype.toString

        assert.strictEqual(obj1.toString, isaac.toString)
      })
    })

    describe('Array.prototype.sum', () => {
      describe('set up & implementation', () => {
        before(() => {
          /* eslint-disable no-extend-native */
          Array.prototype.sum = function () {
            let sum = 0
            for (let i = 0; i < this.length; i++) {
              sum += this[i]
            }
            return sum
          }
          /* eslint-enable no-extend-native */
        })

        after(() => {
          delete Array.prototype.sum
        })

        it('should sum all the numbers in the array', () => {
          const array = [1, 2, 3, 4, 5]

          assert.strictEqual(array.sum(), 15)
        })
      })

      describe('clean up', () => {
        it('should be cleaned up', () => {
          assert.strictEqual(Array.prototype.sum, undefined)
        })
      })
    })

    describe('ArrayLoopTest', () => {
      describe('set up & implementation', () => {
        before(() => {
          /* eslint-disable no-extend-native */
          Array.prototype.sum = function () {
            let sum = 0
            for (let i = 0; i < this.length; i++) {
              sum += this[i]
            }
            return sum
          }
          /* eslint-enable no-extend-native */
        })

        after(() => {
          delete Array.prototype.sum
        })

        it('should iterate over all items in the array using a for-loop', () => {
          const array = [1, 2, 3, 4, 5]
          const result = []

          for (let i = 0; i < array.length; i++) {
            result.push(array[i])
          }

          assert.strictEqual(result.join(''), '12345')
        })

        it('should iterate over all items in the array using a for-in loop including "sum" in the prototype', () => {
          const array = [1, 2, 3, 4, 5]
          const result = []

          for (let i in array) {
            result.push(array[i])
          }

          assert.strictEqual(result.length, 6) // [1, 2, 3, 4, 5, function sum]
        })

        it('should iterate over all items in the array using a for-in loop NOT including "sum" in the prototype', () => {
          const array = [1, 2, 3, 4, 5]
          const result = []

          for (let i in array) {
            if (array.hasOwnProperty(i)) {
              result.push(array[i])
            }
          }

          assert.strictEqual(result.join(''), '12345')
        })

        it('should only iterate over own properties', () => {
          const person = {
            name: 'Isaac',
            profession: 'Developer',
            location: 'Mexico'
          }
          const result = []

          for (let prop in person) {
            if (person.hasOwnProperty(prop)) {
              result.push(prop)
            }
          }

          const expected = ['location', 'name', 'profession']
          assert.deepStrictEqual(result.sort(), expected)
        })
      })

      describe('clean up', () => {
        it('should be cleaned up', () => {
          assert.strictEqual(Array.prototype.sum, undefined)
        })
      })
    })

    describe('Property Attributes', () => {
      it('should enumerate shadowed object properties', () => {
        // this is not supposed to pass on IE
        const object = {
          toString: 'toString',
          toLocaleString: 'toLocaleString',
          valueOf: 'valueOf',
          hasOwnProperty: 'hasOwnProperty',
          isPrototypeOf: 'isPrototypeOf',
          propertyIsEnumerable: 'propertyIsEnumerable',
          constructor: 'constructor'
        }

        const result = []

        for (let prop in object) {
          result.push(prop)
        }

        assert.strictEqual(result.length, 7)
      })

      it('should enumerate shadowed function properties', () => {
        // this is not supposed to pass on IE
        const func = function noop () { }

        func.prototype = 'prototype'
        func.call = 'call'
        func.apply = 'apply'

        const result = []

        for (let prop in func) {
          result.push(prop)
        }

        assert.strictEqual(result.length, 3)
      })

      it('should enumerate shadowed object properties using tddjs.each', () => {
        const object = {
          toString: 'toString',
          toLocaleString: 'toLocaleString',
          valueOf: 'valueOf',
          hasOwnProperty: 'hasOwnProperty',
          isPrototypeOf: 'isPrototypeOf',
          propertyIsEnumerable: 'propertyIsEnumerable',
          constructor: 'constructor'
        }

        const result = []

        tddjs.each(object, (prop, value) => {
          result.push(prop)
        })

        assert.strictEqual(result.length, 7)
      })

      it('should enumerate shadowed function properties using tddjs.each', () => {
        const func = function noop () { }

        func.prototype = 'prototype'
        func.call = 'call'
        func.apply = 'apply'

        const result = []

        tddjs.each(func, (prop, value) => {
          result.push(prop)
        })

        assert.strictEqual(result.length, 3)
      })
    })
  })

  describe('7.2 Creating objects with constructors', () => {
    describe('prototype vs [[Prototype]]', () => {
      /* eslint-disable no-proto */
      describe('functions and constructors', () => {
        it('should have a property "protoype" that is a blank object', () => {
          var call = function () { /* noop */ }
          assert.deepStrictEqual(call.prototype, {})
        })

        it('should have a "__proto__" that points to Function.prototype', () => {
          var car = function () { /* noop */ }
          assert.strictEqual(car.__proto__, Function.prototype)
        })

        describe('methods in the prototype', () => {
          it('should share methods in the prototype', () => {
            var Circle = function (radius) {
              this.radius = radius
            }
            Circle.prototype.diameter = function () {
              return this.radius * 2
            }
            Circle.prototype.circumference = function () {
              return this.diameter() * Math.PI
            }
            Circle.prototype.area = function () {
              return this.radius * this.radius * Math.PI
            }
            var circle = new Circle(6)
            assert.strictEqual(circle.diameter(), 12)
            assert.strictEqual(circle.constructor, Circle)
          })

          it('should share methods in the prototype when is overridden', () => {
            var Circle = function (radius) {
              this.radius = radius
            }
            Circle.prototype = {
              diameter: function () {
                return this.radius * 2
              },
              circumference: function () {
                return this.diameter() * Math.PI
              },
              area: function () {
                return this.radius * this.radius * Math.PI
              }
            }
            var circle = new Circle(6)
            assert.strictEqual(circle.diameter(), 12)
            assert.strictEqual(circle.constructor, Object, 'constructor is Object when prototype is overridden')
          })

          it('should preserve constructor when prototype is overridden', () => {
            var Circle = function (radius) {
              this.radius = radius
            }
            Circle.prototype = {
              constructor: Circle,
              diameter: function () {
                return this.radius * 2
              },
              circumference: function () {
                return this.diameter() * Math.PI
              },
              area: function () {
                return this.radius * this.radius * Math.PI
              }
            }
            var circle = new Circle(6)
            assert.strictEqual(circle.diameter(), 12)
            assert.strictEqual(circle.constructor, Circle, 'constructor should be restored')
            // the downside of this approach is that Constructor will be enumerable
            assert.strictEqual(Object.keys(Circle.prototype).length, 4, 'constructor will be enumerable')
          })

          it('should share methods when extending the prototype', () => {
            var Circle = function (radius) {
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

            var circle = new Circle(6)
            assert.strictEqual(circle.diameter(), 12)
            assert.strictEqual(circle.constructor, Circle, 'constructor should not be affected')
            assert.strictEqual(Object.keys(Circle.prototype).length, 3, 'constructor should not be enumerable')
          })
        })
      })

      describe('objects', () => {
        it('should not have a property "prototype"', () => {
          var obj = {}
          assert.strictEqual(obj.prototype, undefined)
        })

        it('should have a property "__proto__" that points to its Constructor prototype', () => {
          var obj = {}
          assert.strictEqual(obj.__proto__, Object.prototype)
          var Car = function () { /* noop */ }
          var car = new Car()
          assert.strictEqual(car.__proto__, Car.prototype)
        })

        it('should have a property "__proto__" that has a property "__proto__" that points to parents [[Prototype]]', () => {
          var obj = {}
          assert.strictEqual(obj.__proto__.__proto__, null, 'Object.prototype is null')
          var Car = function () { /* noop */ }
          var car = new Car()
          assert.strictEqual(car.__proto__.__proto__, Object.prototype)
          assert.strictEqual(car.__proto__.__proto__.__proto__, null)
        })

        it('should have a property "constructor" that points to its Constructor function', () => {
          var obj = {}
          assert.strictEqual(obj.constructor, Object)
          var Car = function () { /* noop */ }
          var car = new Car()
          assert.strictEqual(car.constructor, Car)
        })

        it('should be instance of its Constructor', () => {
          var Car = function (model) {
            this.model = model
          }
          var car1 = new Car('ioniq')
          var car2 = { model: 'prius' }

          // car1 instanceof Car
          // is the same as comparing
          // car.__proto__ (or any __proto__ in the chain) === Car.prototype
          assert.strictEqual(car1 instanceof Car, true)
          assert.strictEqual(car1 instanceof Object, true)
          assert.strictEqual(car2 instanceof Car, false)
          assert.strictEqual(car2 instanceof Object, true)
        })

        it('should create an object of the same kind', () => {
          var Car = function () { /* noop */ }
          var car1 = new Car()
          var car2 = new car1.constructor()
          assert.strictEqual(car1 instanceof Car, true)
          assert.strictEqual(car2 instanceof Car, true)
          assert.strictEqual(car1.constructor, car2.constructor)
        })

        it('should return undefined when constructor is not called with "new" keyword', () => {
          var Car = function (model) {
            this.model = model
          }
          var car = Car('ioniq')
          assert.strictEqual(car instanceof Car, false)
          assert.strictEqual(car, undefined, 'car should be undefined because constructor was not called with "new"')
          assert.strictEqual(model, 'ioniq', 'model var was declared in the global scope!') // eslint-disable-line
          delete global.model
          assert.throws(function () {
            assert.strictEqual(model, undefined) // eslint-disable-line
          }, /ReferenceError/)
        })

        it('should prevent issue when calling constructor without "new" keyword', () => {
          var Car = function (model) {
            if (!(this instanceof Car)) {
              return new Car(model)
            }
            this.model = model
          }
          var car = Car('ioniq')
          assert.strictEqual(car instanceof Car, true)
          assert.strictEqual(car.model, 'ioniq')
        })
      })
      /* eslint-enable no-proto */
    })
  })

  describe('7.3 Pseudo-Classical Inheritance', () => {

  })

  describe('7.4 Encapsulation and Information Hiding', () => {

  })

  describe('7.5 Object Composition and Mixins', () => {

  })
})
