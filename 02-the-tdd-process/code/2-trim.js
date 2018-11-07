/* eslint-disable no-extend-native */

String.prototype.trim = function () {
  // /^\s+/: replaces leading white-spaces with empty strings
  // /\s+$/: replaces trailing white-spaces with empty strings
  return this.replace(/^\s+|\s+$/g, '')
}
