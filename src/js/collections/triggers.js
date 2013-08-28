GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Trigger Collection
  // ------------------

  Collections.Triggers = Backbone.Collection.extend({
    model: App.Models.Trigger,
    url: '/dev/js/response.json',

    parse: function(response) {
      return response.triggers;
    }

    // override sync method to use geotrigger API
    // sync: function(method, model, options) {}
  });

});