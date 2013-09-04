GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Notification View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.Notification = Marionette.ItemView.extend({
    template: App.Templates['notification'],
    className: 'gt-notification',
    tagName: 'li',

    events: {
      'click .gt-close': 'destroyNotification'
    },

    render: function() {
      Marionette.ItemView.prototype.render.apply(this, arguments);
      this.$el.addClass(this.model.get('type'));
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
