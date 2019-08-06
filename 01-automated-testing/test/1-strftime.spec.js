// node core module 'assert'
const assert = require('assert')

require('../src/1-strftime')

const now = new Date(2008, 8, 27)

assert.strictEqual(now.strftime('%d-%m-%y'), '27-09-08')

assert.strictEqual(now.strftime('%F'), '2008-09-27')

assert.strictEqual(now.strftime('%D'), '09/27/08')

assert.strictEqual(now.strftime('%d %m %Y:%s'), '27 09 2008:s')

assert.strictEqual(now.strftime('%y'), '08')
