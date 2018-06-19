Object.defineProperties(String.prototype, {
  red: {
    get: function () {
      return '\x1b[31m' + this + '\x1b[39m';
    }
  },
  green: {
    get: function () {
      return '\x1b[32m' + this + '\x1b[39m';
    }
  }
});

function output(text, color) {
  text = String(text);

  switch (color) {
    case 'red':
      console.log(text.red);
      break;
    case 'green':
    default:
      console.log(text.green);
  }
}

module.exports = output;