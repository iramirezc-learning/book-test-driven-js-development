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
  })

  describe('8.4 Various additions and improvements', () => {
  })
})
