/* eslint-disable no-unused-vars */

exports.forLoop = (array) => {
  for (var i = 0, item; i < array.length; i++) {
    item = array[i]
  }
}

exports.letForLoop = (array) => {
  for (let i = 0, item; i < array.length; i++) {
    item = array[i]
  }
}

exports.forLoopCachedLength = (array) => {
  for (var i = 0, l = array.length, item; i < l; i++) {
    item = array[i]
  }
}

exports.letForLoopCachedLength = (array) => {
  for (let i = 0, l = array.length, item; i < l; i++) {
    item = array[i]
  }
}

exports.forLoopDirectAccess = (array) => {
  for (var i = 0, item; (item = array[i]); i++);
}

exports.letForLoopDirectAccess = (array) => {
  for (let i = 0, item; (item = array[i]); i++);
}

exports.forEachLoop = (array) => {
  var item
  array.forEach((i) => { item = i })
}

exports.letForEachLoop = (array) => {
  let item
  array.forEach((i) => { item = i })
}

exports.whileLoop = (array) => {
  var i = 0
  var item

  while (i < array.length) {
    item = array[i]
    i++
  }
}

exports.letWhileLoop = (array) => {
  let i = 0
  let item

  while (i < array.length) {
    item = array[i]
    i++
  }
}

exports.whileLoopCachedLength = (array) => {
  var i = 0
  var l = array.length
  var item

  while (i < l) {
    item = array[i]
    i++
  }
}

exports.letWhileLoopCachedLength = (array) => {
  let i = 0
  let l = array.length
  let item

  while (i < l) {
    item = array[i]
    i++
  }
}

exports.reversedWhileLoop = (array) => {
  var l = array.length
  var item

  while (l--) {
    item = array[l]
  }
}

exports.letReversedWhileLoop = (array) => {
  let l = array.length
  let item

  while (l--) {
    item = array[l]
  }
}

exports.doubleReversedWhileLoop = (array) => {
  var l = array.length
  var i = l
  var item

  while (i--) {
    item = array[l - i - 1]
  }
}

exports.letDoubleReversedWhileLoop = (array) => {
  let l = array.length
  let i = l
  let item

  while (i--) {
    item = array[l - i - 1]
  }
}
