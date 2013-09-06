GeotriggerEditor.module('Config', function(Config) {

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
      stroke: true,
      color: '#00dcb1',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  };

  _.extend(Config, {

    Map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions,

    session: {
      clientId: 'rcMNAPBoIn2M1JoI',
      clientSecret: '77edd9c16dde46ad9a93b79c83229887'
    }

  });

});