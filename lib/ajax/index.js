const Ajax = {}

Ajax.noop = require('./noop')(Ajax)
Ajax.create = require('./create')(Ajax)

if (Ajax.create) {
  Ajax.request = require('./request')(Ajax)
  Ajax.get = require('./get')(Ajax)
  Ajax.post = require('./post')(Ajax)
  Ajax.poller = require('./poller')(Ajax)
  Ajax.poll = require('./poll')(Ajax)
}

module.exports = Ajax
