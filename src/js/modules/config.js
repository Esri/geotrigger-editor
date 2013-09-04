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
      icon: L.icon({
        iconUrl: 'img/blue-dot.png',
        iconRetinaUrl: 'img/blue-dot@2x.png',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowRetinaUrl: null,
        shadowSize: [0, 0],
        shadowAnchor: [0, 0]
      })
    },

    session: {
      clientId: 'rcMNAPBoIn2M1JoI',
      clientSecret: '77edd9c16dde46ad9a93b79c83229887'
    }

  });

});