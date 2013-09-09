GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  API.addInitializer(function(options){
    try {
      if (!options ||
          !options.credentials ||
          !options.credentials.clientId ||
          !options.credentials.clientSecret) {
        throw new Error('GeotriggerEditor requires a `credentials` object with `clientId` and `clientSecret` properties');
      }

      this.session = new Geotriggers.Session({
        clientId: options.credentials.clientId, // required or session - this is the application id from developers.arcigs.com
        clientSecret: options.credentials.clientSecret, // optional - this will authenticate as your application with full permissions
        persistSession: false // optional - will attempt to persist the session and reload it on future page loads
      });

    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  });

});