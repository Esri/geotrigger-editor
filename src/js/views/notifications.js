GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Modal Feedback View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.NotificationList = Marionette.ItemView.extend({
    template: 'notifications',
    className: 'gt-notifications',

    showFeedback: function(){
      var newFeedback = new App.Views.Feedback();
      App.feedbackRegion.show(feedback);
      console.log("pow");
    }
  });
});
