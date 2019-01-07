/* eslint-disable no-extend-native */
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    // /^\s+/: replaces leading white-spaces with empty strings
    // /\s+$/: replaces trailing white-spaces with empty strings
    return this.replace(/^\s+|\s+$/g, '')
  }
}
/* eslint-enable no-extend-native */
