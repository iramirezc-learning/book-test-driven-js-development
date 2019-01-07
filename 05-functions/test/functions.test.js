/* globals describe it after */
/* eslint-disable no-extend-native */

const assert = require('assert')

var _self = this

describe('Chapter 05', () => {
  describe('5.1 Defining Function', () => {
    describe('#name', () => {
      describe('function declarations', () => {
        it('should have a "name" when declared', () => {
          function sum () { }
          assert.strictEqual(sum.name, 'sum')
        })
        it('should not have a "name" when declared as anonymous', () => {
          assert.strictEqual(function () { }.name, '')
        })
      })

      describe('function expressions', () => {
        it('should have a "name" when assigned as an expression', () => {
          var a = function sum () { }
          assert.strictEqual(a.name, 'sum')
        })
        it('should have a "name" when assigned as an expression and anonymous', () => {
          var sum = function () { }
          assert.strictEqual(sum.name, 'sum')
        })
      })
    })
    describe('#length', () => {
      it('should return 0 for console.log', () => {
        assert.strictEqual(console.log.length, 0)
      })
      it('should return 2 for custom function with 2 arguments', () => {
        function sum (a, b) { return a + b }
        assert.strictEqual(sum.length, 2)
      })
      it('should return 2 when created with "Function" constructor', () => {
        var sum = Function('a', 'b', 'return a + b') // eslint-disable-line
        assert.strictEqual(sum.length, 2)
        assert.strictEqual(sum(5, 5), 10)
      })
      it('should return 2 when created with "Function" constructor and arguments separated by comma', () => {
        var sum = Function('a,b', 'return a + b') // eslint-disable-line
        assert.strictEqual(sum.length, 2)
        assert.strictEqual(sum(5, 5), 10)
      })
    })
  })

  describe('5.2 Calling Functions', () => {
    describe('addToArray', () => {
      function addToArray () {
        const array = arguments[0]
        const items = Array.prototype.slice.call(arguments, 1)
        return array.concat(items)
      }
      it('should add [1, 2, 3] to a new array', () => {
        const resultArray = addToArray([], 1, 2, 3)
        assert.deepStrictEqual(resultArray, [1, 2, 3])
      })
      it('should add [4, 5, 6] to array [1, 2, 3]', () => {
        const resultArray = addToArray([1, 2, 3], 4, 5, 6)
        assert.deepStrictEqual(resultArray, [1, 2, 3, 4, 5, 6])
      })
    })
    describe('dynamic relationship', () => {
      it('should alter formal arguments', () => {
        function modify (a, b) {
          b = 42
          arguments[0] = arguments[1] // a = b
          return a
        }
        assert.strictEqual(modify(1, 2), 42)
      })
      it('should return undefined if "b" is not provided', () => {
        function modify (a, b) {
          b = 42
          arguments[0] = arguments[1] // a = undefined
          return a
        }
        assert.strictEqual(modify(1), undefined)
      })
    })
  })

  describe('5.3 Scope & Execution Context', () => {
    it('should test scope', () => {
      function sum () {
        // var 'i' will be defined in the for loop
        assert.strictEqual(i, undefined) // eslint-disable-line

        // 'someVar' will never be defined
        assert.throws(function () {
          assert.strictEqual(someVar, undefined) // eslint-disable-line
        }, /ReferenceError/)

        var total = arguments[0] // 1

        if (arguments.length > 1) {
          for (var i = 1, l = arguments.length; i < l; i++) {
            total += arguments[i]
          }
        }

        assert.strictEqual(i, 5) // incremented in the for-loop

        return total
      }

      assert.strictEqual(sum(1, 2, 3, 4, 5), 15)
    })
    describe('global object', () => {
      it('"myGlobal" should be "global"', () => {
        var myGlobal
        (function a () {
          // this function will be executed in the global context
          myGlobal = this
        })()
        assert.strictEqual(myGlobal, global)
      })
    })

    describe('"exports" & "this" & "module.exports"', () => {
      it('exports should be the same as _self', () => {
        assert.strictEqual(_self, exports)
      })
      it('should add a new property on _self', () => {
        _self.f = () => { }
        assert.strictEqual(_self, exports)
      })
      it('should add a new property on exports', () => {
        exports.a = () => { }
        assert.strictEqual(_self, exports)
      })
      it('should add a new property on module.exports', () => {
        module.exports.c = () => { }
        assert.strictEqual(module.exports, exports)
        assert.strictEqual(module.exports, _self)
      })
    })

    describe('adder: the scope chain', () => {
      function adder (base) {
        return function (num) {
          return base + num
        }
      }

      it('should add or subtract one from arg', () => {
        var inc = adder(1)
        var dec = adder(-1)

        assert.strictEqual(inc(2), 3)
        assert.strictEqual(dec(5), 4)
        assert.strictEqual(inc(dec(4)), 4)
      })
    })

    describe('String.prototype.trim: function expressions revisited', () => {
      let originalTrim = String.prototype.trim

      describe('trim function conditional assignment', () => {
        let trim

        if (String.prototype.trim) {
          trim = function (str) {
            return str.trim()
          }
        } else {
          trim = function (str) {
            return str.replace(/^\s+|\s+$/g, '')
          }
        }

        it('should trim a text', () => {
          assert.strictEqual(trim('   hola   '), 'hola')
        })
      })

      describe('trim function conditional declaration', () => {
        it('should trim a text', () => {
          if (String.prototype.trim) {
            function trim (str) { // eslint-disable-line
              return str.trim()
            }
          } else {
            function trim (str) { // eslint-disable-line
              return str.replace(/^\s+|\s+$/g, '')
            }
          }
          assert.strictEqual(trim('   hola   '), 'hola') // eslint-disable-line
        })
      })
      describe('String.prototype.trim', () => {
        if (String.prototype.trim) {
          String.prototype.trim = function trim () {
            return this.replace(/^\s+|\s+$/g, '')
          }
        }
        it('should trim a text', () => {
          assert.strictEqual('   hola   '.trim(), 'hola')
          assert.notStrictEqual(String.prototype.trim, originalTrim)
        })
        after(() => {
          // reestablish String.prototype.trim
          String.prototype.trim = originalTrim
        })
      })

      describe('reestablish String.prototype.trim', () => {
        it('String.prototype.trim should be reestablished to the original', () => {
          assert.strictEqual(originalTrim, String.prototype.trim)
        })
      })
    })
  })

  describe('5.4 the "this" keyword', () => {
    describe('circle test', () => {
      var circle = {
        radius: 6,
        diameter: function () {
          return this.radius * 2
        }
      }

      it('should implicit bind to object', () => {
        assert.strictEqual(circle.diameter(), 12)
      })

      it('should implicit bind to the "global" object', () => {
        var diameter = circle.diameter

        assert.strictEqual(Number.isNaN(diameter()), true)
      })

      it('should implicit bind to the "global" object', () => {
        var diameter = circle.diameter
        // declare radius in the global scope
        radius = 5 // eslint-disable-line

        assert.strictEqual(diameter(), 10)
      })

      after(() => {
        // remove radius from global
        delete global['radius']
      })
    })

    describe('implicitly setting "this"', () => {
      function addToArray () {
        var targetArray = arguments[0]
        arguments.slice = Array.prototype.slice
        var items = arguments.slice(1)
        // the two lines above are equivalent to this:
        // const items = Array.prototype.slice.call(arguments, 1)
        return targetArray.concat(items)
      }

      it('should add [1, 2, 3] to a new array', () => {
        const resultArray = addToArray([], 1, 2, 3)
        assert.deepStrictEqual(resultArray, [1, 2, 3])
      })
    })

    describe('explicitly setting "this"', () => {
      var circle = {
        radius: 6,
        diameter: function () {
          return this.radius * 2
        }
      }

      it('should explicit change "this"', () => {
        assert.strictEqual(circle.diameter.call({ radius: 5 }), 10)
      })
    })

    describe('using primitives as "this"', () => {
      describe('boolean test', () => {
        Boolean.prototype.not = function () {
          return !this
        }

        it('should flip the value of true', () => {
          assert.strictEqual(true.not(), false)
          assert.strictEqual(Boolean.prototype.not.call(true), false)
        })

        it('should flip the value of false', () => {
          // this actually does not work since primitive is converted to a Boolean
          // and doing !Boolean will always return false.
          // because is the same as doing !{}
          // assert.strictEqual(false.not(), true)
          // assert.strictEqual(Boolean.prototype.not.call(false), true)
          // however here is a possible solution
          Boolean.prototype.not = function () {
            return !this.valueOf()
          }
          assert.strictEqual(false.not(), true)
          assert.strictEqual(Boolean.prototype.not.call(false), true)
        })
      })

      describe('summing numbers from arguments', () => {
        function sum () {
          var total = 0
          for (var i = 0, l = arguments.length; i < l; i++) {
            total += arguments[i]
          }
          return total
        }

        it('should sum all numbers passed as arguments', () => {
          assert.strictEqual(sum(1, 2, 3, 4, 5), 15)
          assert.strictEqual(sum.call(null, 1, 2, 3, 4, 5), 15) // eslint-disable-line
          assert.strictEqual(sum.apply(null, [1, 2, 3, 4, 5]), 15) // eslint-disable-line
          assert.strictEqual(sum.apply(null, { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, length: 5 }), 15) // eslint-disable-line
        })
      })
    })
  })
})
