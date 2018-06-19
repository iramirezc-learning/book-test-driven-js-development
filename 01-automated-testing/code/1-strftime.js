Date.prototype.strftime = (function () {
  function strftime(format) {
    const date = this;

    // (format + '') will coerce format to be a string
    // /%[a-zA-Z]/g regex will replace strings like '% + any alphabetic char'
    // replace callback function takes four arguments:
    // consider function is called with '%d-%m-%y'
    // - first argument 'm': the string that matched the regex - value: '%d'
    // - second argument 'f': the string sorrounded by parenthesis (group) - value: 'd'
    // - third argument 'o': the offset where the match occurred - value: 0
    // - fourth argument 's': the complete string - value: '%d-%m-%y'
    return (format + '').replace(/%([a-zA-Z])/g, function (m, f, o, s) {

      // look if there is a formatter for the match
      const formatter = Date.formats && Date.formats[f];

      // if is a function, return the result of that function
      if (typeof formatter == 'function') {
        // Function.prototype.call receives:
        // - first argument: this context
        // - n arugments: arguments for object
        return formatter.call(Date.formats, date);
        // in case that formatter is a string, then call recursively
      } else if (typeof formatter == 'string') {
        // recursive call
        return date.strftime(formatter);
      }

      // if there is not a match, return the string as it is.
      return f;
    });
  }

  // Internal helper
  // concatenates a '0' to numbers less than 10
  function zeroPad(num) {
    // +num coerces num to be number
    return (+num < 10 ? '0' : '') + num;
  }

  // formatting methods
  Date.formats = {
    // day
    d: function (date) {
      return zeroPad(date.getDate());
    },
    // month
    m: function (date) {
      return zeroPad(date.getMonth() + 1);
    },
    // short year
    y: function (date) {
      return zeroPad(date.getYear() % 100);
    },
    // full year
    Y: function (date) {
      return date.getFullYear();
    },
    // fullYear-month-day
    F: '%Y-%m-%d',
    // month/day/shortYear
    D: '%m/%d/%y',
    // day of the year
    // implemented later in the book
    j: function (date) {
      // january 1st of that date.year
      const jan1 = new Date(date.getFullYear(), 0, 1);
      // get the difference
      var diff = date.getTime() - jan1.getTime();
      // 86400000 == 24 * 60 * 60 * 1000
      // hours * minutes * seconds * milliseconds
      return Math.ceil(diff / 86400000);
    }
  };

  return strftime;
}());