GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  API.addInitializer(function(){
    this.session = new Geotriggers.Session({
      clientId: App.Config.session.clientId, // required or session - this is the application id from developers.arcigs.com
      clientSecret: App.Config.session.clientSecret, // optional - this will authenticate as your application with full permissions
      persistSession: false // optional - will attempt to persist the session and reload it on future page loads
    });
  });

});