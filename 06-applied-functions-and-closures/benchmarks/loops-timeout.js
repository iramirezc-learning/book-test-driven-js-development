const loops = require('../../lib/loops')

function init (cb = () => { }, { loopLength }) {
  const ARRAY = []

  for (let i = 0; i < loopLength; i++) {
    ARRAY[i] = `item ${i}`
  }

  cb(ARRAY)
}

function bench (func) {
  var start = new Date().getTime()
  for (var i = 0; i < 10000; i++) {
    func()
  }
  console.log(func, new Date().getTime() - start)
}

init((data) => {
  var benchmarks = [
    function forLoop () { loops.forLoop(data) },
    function whileLoop () { loops.whileLoop(data) }
  ]
  // this line
  setTimeout(benchmarks.forEach.bind(benchmarks, bench), 500)
  // is equivalent to:
  // setTimeout(function () {
  //   benchmarks.forEach((f) => {
  //     bench(f)
  //   })
  // }, 5000)
}, { loopLength: 100000 })
