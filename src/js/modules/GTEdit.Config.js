GTEdit.module('Config', function(Config, App, Backbone, Marionette, $, _) {

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

  var icon = L.icon({
    iconUrl: 'img/blue-dot.png',
    iconRetinaUrl: 'img/blue-dot@2x.png',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowRetinaUrl: null,
    shadowSize: [0, 0],
    shadowAnchor: [0, 0]
  });

  _.extend(Config, {

    Map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    imagePath: '/images',

    polygonOptions: sharedOptions,

    circleOptions: sharedOptions,

    drivetimeOptions: {
      icon: icon
    }

  });

});