GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    defaults: {
      // 'triggerId': null,
      'condition': {
        'direction': 'enter',
        'geo': {
          // 'geocode': '920 SW 3rd Ave, Portland, OR',
          // 'driveTime': 600,
          // 'context': {
          //   'locality': 'Portland',
          //   'region': 'Oregon',
          //   'country': 'USA',
          //   'zipcode': '97204'
          // }
          'latitude': 45.5165,
          'longitude': -122.6764,
          'distance': 240
        }
      },
      'action': {
        'message': 'Welcome to Portland'
        // 'callback': 'http://pdx.gov/welcome'
      },
      'tags': ['foodcarts', 'citygreetings']
    }

    // inherit sync method from collection
    //sync: this.collection.sync
  });

});