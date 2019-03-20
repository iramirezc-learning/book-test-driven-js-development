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

  })

  describe('7.3 Pseudo-Classical Inheritance', () => {

  })

  describe('7.4 Encapsulation and Information Hiding', () => {

  })

  describe('7.5 Object Composition and Mixins', () => {

  })
})
