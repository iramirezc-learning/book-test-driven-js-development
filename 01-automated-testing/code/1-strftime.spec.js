// node core module 'assert'
const assert = require('assert');

require('./1-strftime');

const now = new Date(2008, 08, 27);

assert.equal(now.strftime('%d-%m-%y'), '27-09-08');

assert.equal(now.strftime('%F'), '2008-09-27')

assert.equal(now.strftime('%D'), '09/27/08');

assert.equal(now.strftime('%d %m %Y:%s'), '27 09 2008:s');

assert.equal(now.strftime('%y'), '08');
