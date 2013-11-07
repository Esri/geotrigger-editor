GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Geotrigger API
  // --------------

  function createSession () {
    if (!App.config.session ||
        !App.config.session.clientId ||
        !App.config.session.clientSecret) {
      throw new Error('GeotriggerEditor requires a `session` object with `clientId` and `clientSecret` properties');
    }

    this.session = new Geotriggers.Session(App.config.session);
  }

  API.addInitializer(createSession);

});
