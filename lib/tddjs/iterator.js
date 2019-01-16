function iterator (collection) {
  let index = 0
  const length = collection.length

  function next () {
    const item = collection[index++]
    return item
  }

  function hasNext () {
    return index < length
  }

  return {
    next,
    hasNext
  }
}

/* Functional iterator approach */
function __iterator (collection) { // eslint-disable-line
  let index = 0
  const length = collection.length

  function next () {
    const item = collection[index++]
    next.hasNext = index < length
    return item
  }

  next.hasNext = index < length

  return next
}

module.exports = iterator
