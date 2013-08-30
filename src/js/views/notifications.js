GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Modal Feedback View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.Notification = Marionette.ItemView.extend({
    template: 'notification',
    // className: 'gt-notification',

    events: {
      'click .gt-close': 'destroyNotification'
    },

    destroyNotification: function() {
      this.model.destroy();
    }
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
