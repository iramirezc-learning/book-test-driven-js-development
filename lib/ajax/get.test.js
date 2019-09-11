const { assertIsFunction } = require('../assertions')
const { stubFn } = require('../stub')
const tddjs = require('../tddjs')
const Ajax = require('../ajax')
const fakeXHR = require('../fakes/xhr.fake')

describe('Ajax.get - unit tests', () => {
  beforeEach(() => {
    this.xhr = Object.create(fakeXHR)
    this.ajaxCreate = Ajax.create // backup original
    Ajax.create = stubFn(this.xhr) // replace original
    this.isLocal = tddjs.isLocal
  })

  afterEach(() => {
    Ajax.create = this.ajaxCreate // restore original
    tddjs.isLocal = this.isLocal
  })

  it('should define the get method', () => {
    assertIsFunction(Ajax.get)
  })
})
