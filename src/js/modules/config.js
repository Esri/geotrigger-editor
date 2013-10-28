GeotriggerEditor.module('Config', function(Config, App, Backbone, Marionette, $, _) {

  var sharedOptions = {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#00b1dc',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  };

  var editOptions = {
    showArea: false,
    shapeOptions: {
      color: '#00dcb1',
      opacity: 0.8,
      dashArray: '10, 10',
      weight: 2,
      fill: true,
      fillOpacity: 0.2
    }
  };

  var highlightOptions = {
    showArea: false,
    shapeOptions: {
      color: '#00dcb1',
      opacity: 0.8,
      stroke: true,
      weight: 2,
      fill: true,
      fillOpacity: 0.2
    }
  };

  var defaults = {
    map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    fitOnLoad: true,
    proxy: false,

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions,
    highlightOptions: highlightOptions

  };

  Config.addInitializer(function(options) {
    App.config = _.deepExtend(defaults, options);
  });

});