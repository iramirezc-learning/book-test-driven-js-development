/* globals Ajax */

(function () {
  function writeResponse (el, body) {
    el.innerHTML = JSON.stringify(body, null, 4)
  }

  /**
   * GET
   */
  const getButton = document.getElementById('get-submit')
  const getBody = document.getElementById('get-body')

  getButton.addEventListener('click', (ev) => {
    const getEndpoint = document.getElementById('get-endpoint').value

    Ajax.get(getEndpoint, {
      success (xhr) {
        console.log('SUCCESS->', xhr.response)
        writeResponse(getBody, JSON.parse(xhr.response))
      },
      failure (data) {
        console.error('FAILURE->', data)
      },
      complete (data) {
        console.log('COMPLETE->', data)
      }
    })
  })

  /**
   * POST
   */
  const postButton = document.getElementById('post-submit')
  const postBody = document.getElementById('post-body')

  postButton.addEventListener('click', (ev) => {
    const postEndpoint = document.getElementById('post-endpoint').value

    Ajax.post(postEndpoint, {
      success (xhr) {
        console.log('SUCCESS->', xhr.response)
        writeResponse(postBody, JSON.parse(xhr.response))
      },
      failure (data) {
        console.error('FAILURE->', data)
      },
      complete (data) {
        console.log('COMPLETE->', data)
      }
    })
  })
})()
