GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  API.addInitializer(function(options){
    try {
      if (!options ||
          !options.credentials ||
          !options.credentials.clientId ||
          !options.credentials.clientSecret) {
        throw new Error('GeotriggerEditor requires a `credentials` object with `clientId` and `clientSecret` properties');
      }

      var sessionOptions = {
        clientId: options.credentials.clientId,
        clientSecret: options.credentials.clientSecret,
        persistSession: false
      };

      if (options.proxy) {
        sessionOptions.proxy = options.proxy;
      }

      this.session = new Geotriggers.Session(sessionOptions);

    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  });

});