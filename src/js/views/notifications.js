GeotriggerEditor.module('Views', function (Views, App, Backbone, Marionette, $, _) {

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

    render: function () {
      Marionette.ItemView.prototype.render.apply(this, arguments);

      var type = this.model.get('type') || 'info';
      this.$el.addClass(type);

      this.listenTo(App.vent, 'notify:clear', this.destroyNotification);
    },

    onShow: function () {
      this.$el.fadeIn();
      var timeout = this.model.get('timeout');
      if (typeof timeout === 'number') {
        setTimeout(_.bind(function () {
          this.destroyNotification();
        }, this), timeout);
      }
    },

    destroyNotification: function () {
      this.$el.fadeOut(_.bind(function () {
        this.model.destroy();
      }, this));
    }
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
