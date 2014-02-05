Geotrigger.Editor.module('Config', function (Config, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // App Configuration
  // -----------------

  // default shape options

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

  // default configuration

  var defaults = {

    el: '#gt-editor',

    session: {},

    map: {
      basemap: 'Streets',
      center: [0, 0],
      zoom: 2,
      options: {}
    },

    fitOnLoad: true,

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions,
    highlightOptions: highlightOptions

  };

  // merge options into defaults on initialization

  function setup(options) {
    App.config = _.deepExtend(defaults, options);
  }

  Config.addInitializer(setup);

});
