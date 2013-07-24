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
      // var drawControl = new L.Control.Draw(controlOptions);
      // Map.instance.addControl(drawControl);

      this._polygon = new L.Draw.Polygon(Map.instance);
      this._radius = new L.Draw.Circle(Map.instance);
      this._drivetime = new L.Draw.Marker(Map.instance);

      Map.instance.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        console.log(e);

        layer.bindPopup(type);

        Map.Draw.drawnItems.addLayer(layer);
      });
    },

    polygon: function() {
      this._radius.disable();
      this._drivetime.disable();
      this._polygon.enable();
    },

    _polygon: null,

    radius: function() {
      this._polygon.disable();
      this._drivetime.disable();
      this._radius.enable();
    },

    _radius: null,

    drivetime: function() {
      this._radius.disable();
      this._polygon.disable();
      this._drivetime.enable();
    },

    _drivetime: null
  };

  _.extend(Map, {
    init: function(el) {
      // L.Icon.Default.imagePath = App.Config.imagePath;
      this.instance = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
      this.instance.zoomControl.setPosition('topright');
      L.esri.basemapLayer(App.Config.Map.basemap).addTo(this.instance);

      this.Draw.init();
    },

    Draw: Draw
  });

});