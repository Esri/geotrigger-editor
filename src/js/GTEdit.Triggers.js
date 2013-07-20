GTEdit.module('Triggers', function(Triggers, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Triggers.Trigger = Backbone.Model.extend({

    defaults: {
      'triggerId': null,
      'condition': {
        'direction': 'enter',
        'geo': {
          'geocode': '920 SW 3rd Ave, Portland, OR',
          'driveTime': 600,
          'context': {
            'locality': 'Portland',
            'region': 'Oregon',
            'country': 'USA',
            'zipcode': '97204'
          }
        }
      },
      'action': {
        'message': 'Welcome to Portland - The Mayor',
        'callback': 'http://pdx.gov/welcome'
      },
      'tags': ['foodcarts', 'citygreetings']
    },

    // inherit sync method from collection
    sync: this.collection.sync
  });

  // Trigger Collection
  // ------------------

  Triggers.TriggerList = Backbone.Collection.extend({
    model: Triggers.Trigger

    // override sync method to use geotrigger API
    // sync: function(method, model, options) {}
  });

});