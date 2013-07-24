GTEdit.module('Config', function(Config, App, Backbone, Marionette, $, _) {

  _.extend(Config, {

    Map: {
      basemap: 'Streets',
      center: [45.516484,-122.676339],
      zoom: 12
    },

    imagePath: '/images'

  });

});