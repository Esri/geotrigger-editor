module.exports = function () {
  this.World = require('../support/world.js').World;

  this.When(/^I edit a geotrigger$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

  this.Then(/^the geotrigger has been modified$/, function(callback) {
    // express the regexp above with the code you wish you had
    callback.pending();
  });

};