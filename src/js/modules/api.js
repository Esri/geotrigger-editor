GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Geotrigger API
  // --------------

  function createSession () {
    if (!App.config.credentials ||
        !App.config.credentials.clientId ||
        !App.config.credentials.clientSecret) {
      throw new Error('GeotriggerEditor requires a `credentials` object with `clientId` and `clientSecret` properties');
    }

    var sessionOptions = {
      clientId: App.config.credentials.clientId,
      clientSecret: App.config.credentials.clientSecret,
      persistSession: App.config.persistSession,
      proxy: App.config.proxy
    };

    this.session = new Geotriggers.Session(sessionOptions);
  }

  API.addInitializer(createSession);

});
