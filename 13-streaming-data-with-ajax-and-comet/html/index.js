/* globals Ajax */

(function () {
  function writeResponse (el, body) {
    const date = new Date()
    const newData = String(date) + '\n' + JSON.stringify(body, null, 4) + '\n'
    el.innerHTML = el.innerHTML += newData
  }

  /**
   * Polling
   */
  const reqMethod = document.getElementById('req-method')
  const reqUrl = document.getElementById('req-url')
  const reqInterval = document.getElementById('req-interval')
  const submit = document.getElementById('req-submit')
  const reqBody = document.getElementById('req-body')

  submit.addEventListener('click', (ev) => {
    Ajax.poll(reqUrl.value, {
      method: reqMethod.value,
      interval: Number(reqInterval.value),
      success (xhr) {
        console.log('SUCCESS->', xhr.response)
        writeResponse(reqBody, JSON.parse(xhr.response))
      },
      failure (data) {
        console.error('FAILURE->', data)
      },
      complete () {
        console.log('COMPLETE!')
      }
    })
  })
})()
