GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Trigger Collection
  // ------------------

  Collections.Triggers = Backbone.Collection.extend({
    model: App.Models.Trigger,

    fetch: function(options) {
      var callback = _.bind(function(error, response) {
        if(options.reset){
          this.reset(this.parse(response));
        } else {
          this.set(this.parse(response));
        }

        if (options.success) {
          options.success(this, this.parse(response), options);
        }
      }, this);

      App.API.session.request('trigger/list', callback);
    },

    parse: function(response) {
      return response.triggers;
    }
  });

});
