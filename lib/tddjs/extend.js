const each = require('./each')

function extend (target, source) {
  target = target || {}

  if (!source) return target

  each(source, (prop, val) => {
    target[prop] = val
  })

  return target
}

module.exports = extend
