GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Main View
  // ---------
  //
  // Instantiates the basic structure of the app.

  Views.Main = Marionette.ItemView.extend({
    id: 'gt-regions',
    template: App.Templates['main']
  });

});
