GTEdit.module('Config', function(Config, App, Backbone, Marionette, $, _) {

  _.extend(Config, {

    Map: {
      center: [37.75,-122.45],
      zoom: 12
    },

    imagePath: '/images'

  });

});