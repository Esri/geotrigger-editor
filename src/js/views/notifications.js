GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Modal Feedback View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.Notification = Marionette.ItemView.extend({
    template: 'notification',
    className: 'gt-notification',
    tagName: 'li',
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
