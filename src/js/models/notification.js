Geotrigger.Editor.module('Models', function (Models, App, Backbone, Marionette, $, _) {

  // Notification Model
  // ------------------

  Models.Notification = Backbone.Model.extend({

    defaults: {
      'type': 'info',
      'message': 'everything\'s fine'
    }

  });

  // Notification Collection
  // -----------------------

  Models.Notifications = Backbone.Collection.extend({
    model: Models.Notification
  });

});
