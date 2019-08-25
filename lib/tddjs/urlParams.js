const each = require('./each')

function urlParams (object) {
  if (!object) {
    return ''
  }

  if (typeof object === 'string') {
    return encodeURI(object)
  }

  const pieces = []

  each(object, (prop, val) => {
    pieces.push(`${encodeURIComponent(prop)}=${encodeURIComponent(val)}`)
  })

  return pieces.join('&')
}

module.exports = urlParams
