/* globals describe it before after */

const assert = require('assert')

describe('Chapter 08', () => {
  describe('8.1 The close future of JavaScript', () => {
    it('should be nothing to test', () => {
      assert.strictEqual(true, true)
    })
  })

  describe('8.2 Updates to the Object model', () => {
    describe('property attributes', () => {
      describe('enumerable', () => {
        it('should be true by default and enumerable', () => {
          const circle = {}
          circle.radius = 5
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.enumerable, true)
          const enumerable = []
          for (const prop in circle) {
            enumerable.push(prop)
          }
          assert.strictEqual(enumerable.includes('radius'), true, 'radius should be enumerable')
        })

        it('should be false and not enumerable', () => {
          const circle = {}
          circle.radius = 5
          Object.defineProperty(circle, 'radius', {
            enumerable: false
          })
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.enumerable, false)
          const enumerable = []
          for (const prop in circle) {
            enumerable.push(prop)
          }
          assert.strictEqual(enumerable.includes('radius'), false, 'radius should not be enumerable')
        })
      })

      describe('configurable', () => {
        it('should be true by default and allow deletion', () => {
          const circle = {}
          circle.radius = 5
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.configurable, true)
          delete circle.radius
          assert.strictEqual(circle.radius, undefined, 'radius should be deleted')
        })

        it('should be false and not allow deletion', () => {
          const circle = {}
          circle.radius = 5
          Object.defineProperty(circle, 'radius', {
            configurable: false
          })
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.configurable, false)
          delete circle.radius
          assert.strictEqual(circle.radius, 5, 'radius should not be deleted')
          circle.radius = 6
          assert.strictEqual(circle.radius, 6, 'radius can be changed')
        })
      })

      describe('writable', () => {
        it('should be true by default and allow overriding', () => {
          const circle = {}
          circle.radius = 5
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.writable, true)
          circle.radius = 6
          assert.strictEqual(circle.radius, 6, 'radius should be changed')
        })

        it('should be false and not allow overriding but deletion', () => {
          const circle = {}
          circle.radius = 5
          Object.defineProperty(circle, 'radius', {
            writable: false
          })
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.writable, false)
          circle.radius = 6
          assert.strictEqual(circle.radius, 5, 'radius should not be changed')
          delete circle.radius
          assert.strictEqual(circle.radius, undefined, 'radius can be deleted')
        })
      })

      describe('set & get', () => {
        it('should use the set and get accessors', () => {
          const circle = {}
          Object.defineProperty(circle, '_radius', {
            writable: true
          })
          Object.defineProperty(circle, 'radius', {
            get () {
              return this._radius
            },
            set (val) {
              this._radius = val
            },
            enumerable: true
          })
          circle.radius = 5
          const descriptor = Object.getOwnPropertyDescriptor(circle, 'radius')
          assert.strictEqual(descriptor.enumerable, true)
          assert.strictEqual(descriptor.configurable, false)
          assert.strictEqual(descriptor.writable, undefined, 'writable is not compatible with set & get')
          assert.strictEqual(circle.radius, 5, 'radius should accessible and writable')
          const props = Object.getOwnPropertyNames(circle)
          assert.deepStrictEqual(props, ['_radius', 'radius'], 'two properties should exist')
          const keys = Object.keys(circle)
          assert.deepStrictEqual(keys, ['radius'], 'only radius should be enumerable')
          const _descriptor = Object.getOwnPropertyDescriptor(circle, '_radius')
          assert.deepStrictEqual(_descriptor, {
            value: 5,
            enumerable: false,
            configurable: false,
            writable: true
          })
        })
      })
    })

    describe('object extensible', () => {
      it('should allow extension of an object', () => {
        const circle = {}
        circle.radius = 5
        assert.strictEqual(circle.radius, 5, 'radius should be defined')
      })

      it('should not allow extension to an object', () => {
        const circle = { radius: 5 }
        Object.preventExtensions(circle)
        circle.diameter = 10
        assert.strictEqual(circle.radius, 5, 'radius should be defined')
        assert.strictEqual(circle.diameter, undefined, 'diameter should be undefined')
        const props = Object.getOwnPropertyNames(circle)
        assert.deepStrictEqual(props, ['radius'], 'object should have only properties before prevent extension')
      })
    })

    describe('object seal', () => {
      it('should seal an object', () => {
        const circle = { radius: 5 }
        Object.seal(circle)
        circle.diameter = 10
        assert.strictEqual(circle.radius, 5, 'radius should be defined')
        assert.strictEqual(circle.diameter, undefined, 'diameter should be undefined')
        const descriptors = Object.getOwnPropertyDescriptor(circle, 'radius')
        assert.deepStrictEqual(descriptors, {
          value: 5,
          configurable: false,
          enumerable: true,
          writable: true
        })
        const props = Object.getOwnPropertyNames(circle)
        assert.deepStrictEqual(props, ['radius'], 'object should have only properties before prevent extension')
        assert.strictEqual(Object.isExtensible(circle), false, 'object should not be extensible')
        circle.radius = 6
        assert.strictEqual(circle.radius, 6, 'radius can be changed')
      })
    })

    describe('object freeze', () => {
      it('should freeze an object', () => {
        const circle = { radius: 5 }
        Object.freeze(circle)
        circle.diameter = 10
        assert.strictEqual(circle.radius, 5, 'radius should be defined')
        assert.strictEqual(circle.diameter, undefined, 'diameter should be undefined')
        const descriptors = Object.getOwnPropertyDescriptor(circle, 'radius')
        assert.deepStrictEqual(descriptors, {
          value: 5,
          configurable: false,
          enumerable: true,
          writable: false
        })
        const props = Object.getOwnPropertyNames(circle)
        assert.deepStrictEqual(props, ['radius'], 'object should have only properties before prevent extension')
        assert.strictEqual(Object.isExtensible(circle), false, 'object should not be extensible')
        circle.radius = 6
        assert.strictEqual(circle.radius, 5, 'radius should not be changed')
      })
    })

    describe('Object.create and inheritance', () => {
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

      it('should create an instance of a Circle', () => {
        const circle = new Circle(3)
        assert.strictEqual(circle instanceof Circle, true)
        assert.strictEqual(circle.diameter, 6)
        circle.radius = 6
        assert.strictEqual(circle.diameter, 12)
        delete circle.radius
        assert.strictEqual(circle.radius, 6)
      })

      it('should create an instance of a Circle without the new keyword', () => {
        const circle = Circle(3)
        assert.strictEqual(circle instanceof Circle, true)
        assert.strictEqual(circle.diameter, 6)
        circle.radius = 6
        assert.strictEqual(circle.diameter, 12)
        delete circle.radius
        assert.strictEqual(circle.radius, 6)
      })
    })

    describe('Object.create and a function', () => {
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

      it('should create an instance of a Circle', () => {
        const circle = Circle.create(3)
        assert.strictEqual(circle.radius, 3)
        assert.strictEqual(Circle.isPrototypeOf(circle), true)
        assert.strictEqual(circle.diameter, 6)
        circle.radius = 6
        assert.strictEqual(circle.diameter, 12)
        delete circle.radius
        assert.strictEqual(circle.radius, 6)
      })

      it('should create an instance of a Circle when calling create on a previous instance', () => {
        const _circle = Circle.create(1)
        const circle = _circle.create(3)
        assert.strictEqual(_circle.radius, 1)
        assert.strictEqual(circle.radius, 3)
        assert.strictEqual(_circle.isPrototypeOf(circle), true)
        assert.strictEqual(_circle.diameter, 2)
        assert.strictEqual(circle.diameter, 6)
        _circle.radius = 2
        circle.radius = 6
        assert.strictEqual(_circle.diameter, 4)
        assert.strictEqual(circle.diameter, 12)
        delete _circle.radius
        delete circle.radius
        assert.strictEqual(_circle.radius, 2)
        assert.strictEqual(circle.radius, 6)
      })
    })
  })

  describe('8.3 Strict mode', () => {
    describe('global variables', () => {
      it('should allow the creation of a global var', () => {
        a123 = 2 // eslint-disable-line
        assert.strictEqual(a123, 2) // eslint-disable-line
      })

      it('should not allow the use of eval', () => {
        'use strict'
        assert.throws(() => {
          a456 = 2 // eslint-disable-line
        }, /ReferenceError/)
      })
    })

    describe('same parameters', () => {
      it('should get the last value provided', () => {
        const f = function (a, a, a) { // eslint-disable-line
          return a
        }
        assert.strictEqual(f(1, 2, 3), 3, 'should return the last value')
      })

      it('should throw a SyntaxError', () => {
        // NOTE: this can't be tested in unit tests, un-comment to see the error.
        // assert.throws(() => {
        //   'use strict'
        //   function f (a, a, a) { // eslint-disable-line
        //     return a
        //   }
        //   assert.strictEqual(f(1, 2, 3), 3, 'should return the last value')

        // }, /SyntaxError/)
      })
    })

    describe('arguments', () => {
      it('should interchange the arguments', () => {
        function switchArgs (a, b) {
          const c = a
          a = b
          b = c
          return [].slice.call(arguments)
        }

        assert.deepStrictEqual([2, 1], switchArgs(1, 2))
      })

      it('should not interchange the arguments', () => {
        function switchArgs (a, b) {
          'use strict'

          const c = a
          a = b
          b = c
          return [].slice.call(arguments)
        }

        assert.deepStrictEqual([1, 2], switchArgs(1, 2))
      })
    })

    describe('this', () => {
      it('should use global as this in a function', () => {
        global._myGlobal1 = 'Hello'

        function greet () {
          return this._myGlobal1
        }

        assert.strictEqual(greet.call(), 'Hello')
      })

      it('should use not use global as this in a function', () => {
        'use strict'
        global._myGlobal1 = 'Hello'

        function greet () {
          return this._myGlobal1
        }

        assert.throws(() => {
          greet.call()
        }, /TypeError/)
      })
    })

    describe('writable properties', () => {
      it('should not throw an error if trying to change a non-writable property', () => {
        const circle = {}
        Object.defineProperty(circle, 'radius', {
          value: 5
        })
        assert.strictEqual(circle.radius, 5)
        circle.radius = 10
        assert.strictEqual(circle.radius, 5, 'radius should not change')
      })

      it('should throw an error if trying to change a non-writable property', () => {
        'use strict'
        const circle = {}
        Object.defineProperty(circle, 'radius', {
          value: 5
        })
        assert.strictEqual(circle.radius, 5)
        assert.throws(() => {
          circle.radius = 10
        }, /TypeError/)
        assert.strictEqual(circle.radius, 5, 'radius should not change')
      })
    })

    describe('extending objects', () => {
      it('should not throw an error if trying to extend a seal object', () => {
        const circle = {}
        Object.preventExtensions(circle)
        circle.radius = 10
        assert.strictEqual(circle.radius, undefined, 'radius should not be defined')
      })

      it('should throw an error if trying to extend a seal object', () => {
        'use strict'
        const circle = {}
        Object.preventExtensions(circle)
        assert.throws(() => {
          circle.radius = 10
        }, /TypeError/)
        assert.strictEqual(circle.radius, undefined, 'radius should not be defined')
      })
    })

    describe('deleting properties', () => {
      it('should not throw an error if trying to delete a non-configurable property', () => {
        const circle = {}
        Object.defineProperty(circle, 'radius', {
          value: 5
        })
        assert.strictEqual(circle.radius, 5)
        delete circle.radius
        assert.strictEqual(circle.radius, 5, 'radius should not change')
      })

      it('should throw an error if trying to delete a non-configurable property', () => {
        'use strict'
        const circle = {}
        Object.defineProperty(circle, 'radius', {
          value: 5
        })
        assert.strictEqual(circle.radius, 5)
        assert.throws(() => {
          delete circle.radius
        }, /TypeError/)
        assert.strictEqual(circle.radius, 5, 'radius should not change')
      })
    })

    describe('the with statement', () => {
      it('should not throw an error if using with statement', () => {
        const circle = { radius: 5 }
        with (circle) {
          radius = 6
        }
        assert.strictEqual(circle.radius, 6, 'radius should be changed')
      })

      it('should throw an error if using the with statement', () => {
        // NOTE: this can't be tested in unit tests, un-comment to see the error.
        // 'use strict'
        // const circle = { radius: 5 }
        // assert.throws(() => {
        //   with (circle) {
        //     radius = 6
        //   }
        // }, /SyntaxError/)
      })
    })

    describe('octal number literals', () => {
      it('should not throw an error if using using an octal number literal', () => {
        const octal = 0377
        const decimal = parseInt(octal)
        assert.strictEqual(decimal, 255)
      })

      it('should throw an error if using an octal number literal', () => {
        // NOTE: this can't be tested in unit tests, un-comment to see the error.
        // 'use strict'
        // assert.throws(() => {
        //   const octal = 0377
        // }, /SyntaxError/)
      })
    })
  })

  describe('8.4 Various additions and improvements', () => {
    describe('JSON', () => {
      it('should parse an object to JSON', () => {
        const obj = {
          name: 'Isaac',
          age: 32
        }
        assert.strictEqual(JSON.stringify(obj), '{"name":"Isaac","age":32}')
      })

      it('should parse a JSON to an object', () => {
        assert.deepStrictEqual(JSON.parse('{"name":"Isaac","age":32}'), {
          name: 'Isaac',
          age: 32
        })
      })

      it('should parse a date to JSON', () => {
        const d = new Date('1987-09-27')
        assert.strictEqual(d.toJSON(), '1987-09-27T00:00:00.000Z')
        assert.strictEqual(d.toJSON(), d.toISOString())
      })
    })
  })
})
