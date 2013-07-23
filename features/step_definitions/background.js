module.exports = function () {
  this.World = require('../support/world.js').World;

  this.Given(/^I am viewing the editor$/, function(callback) {
    // express the regexp above with the code you wish you had
    this.browser.get("http://localhost:8081", callback);
  });

  this.Given(/^an application named "([^"]*)"$/, function(arg1, callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

};