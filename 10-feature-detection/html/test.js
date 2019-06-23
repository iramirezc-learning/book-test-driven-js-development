console.log('is `boxShadow` supported?', tddjs.isCSSPropertySupported('boxShadow'))
console.log('is `circleShadow` supported?', tddjs.isCSSPropertySupported('circleShadow'))
console.log('browser supports `mouseenter` event?', tddjs.dom.supportsEvent('mouseenter'))

const magic = document.getElementById('magic')

tddjs.dom.addEventHandler(magic, 'mouseenter', function (e) {
  console.log('Hey! You did it!', e)
})
