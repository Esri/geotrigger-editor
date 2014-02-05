Geotrigger.Editor.module('util', function (util, App, Backbone, Marionette, $, _) {

  // Utility Functions
  // -----------------
  //
  // General purpose helper functions.

  util.removeEmptyStrings = function (obj) {
    for (var key in obj) {

      // value is empty string
      if (obj[key] === '') {
        delete obj[key];
      }

      // value is array with only empty strings
      if (obj[key] instanceof Array) {
        var empty = true;
        for (var i = 0; i < obj[key].length; i++) {
          if (obj[key][i] !== '') {
            empty = false;
            break;
          }
        }
        if (empty) {
          delete obj[key];
        }
      }

      // value is object with only empty strings or arrays of empty strings
      if (typeof obj[key] === "object") {
        obj[key] = util.removeEmptyStrings(obj[key]);
        var hasKeys = false;
        for (var objKey in obj[key]) {
          hasKeys = true;
          break;
        }
        if (!hasKeys) {
          delete obj[key];
        }
      }
    }

    return obj;
  };

  util.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  util.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

});
