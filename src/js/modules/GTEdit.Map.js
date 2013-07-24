GTEdit.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  var Draw = {
    drawnItems: null,

    init: function() {
      // Initialize the FeatureGroup to store editable layers
      this.drawnItems = new L.FeatureGroup();
      Map.instance.addLayer(this.drawnItems);

      var controlOptions = {
        position: 'topright',
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            // drawError: {
            //   color: '#e1e100', // Color the shape will turn when intersects
            //   message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            // },
            shapeOptions: {
              color: '#bada55'
            }
          },
          // circle: false, // Turns off this drawing tool
          rectangle: false
        },
        edit: {
          featureGroup: this.drawnItems // REQUIRED!!
          // remove: false
        }
      };

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      var drawControl = new L.Control.Draw(controlOptions);
      Map.instance.addControl(drawControl);

      Map.instance.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        layer.bindPopup(type);

        Map.Draw.drawnItems.addLayer(layer);
      });
    },

    polygon: function() {
      console.log("give me the polygon tool for a second");
    },

    radius: function() {
      console.log("give me the radius tool for a second");
    },

    drivetime: function() {
      console.log("give me the drivetime tool for a second");
    }
  };

  _.extend(Map, {
    init: function(el) {
      // L.Icon.Default.imagePath = App.Config.imagePath;
      this.instance = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
      this.instance.zoomControl.setPosition('topright');
      L.esri.basemapLayer("Topographic").addTo(this.instance);

      this.Draw.init();
    },

    Draw: Draw
  });

});