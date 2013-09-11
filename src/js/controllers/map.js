GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    _setup: function(options) {
      // L.Icon.Default.imagePath = App.config.imagePath;
      App.map = this.map = L.map(options.el).setView(App.config.map.center, App.config.map.zoom);
      this.map.zoomControl.setPosition('topright');
      L.esri.basemapLayer(App.config.map.basemap).addTo(App.map);

      this.Layers.start();
      this._eventBindings();
    },

    _eventBindings: function() {
      App.commands.setHandler('map:fit', _.bind(function(){
        this.map.fitBounds(this.Layers.main.getBounds(), {
          animate: false
        });
      }, this));
    },

    panToLayer: function(layer) {
      var latlng;

      if (layer.getLatLng) {
        latlng = layer.getLatLng();
      } else if (layer.getCenter) {
        latlng = layer.getCenter();
      }

      if (latlng) {
        this.map.panTo(latlng, {
          animate: false
        });
      }
    },

    zoomToLayer: function(layer) {
      this.map.fitBounds(layer.getBounds(), {
        padding: [60, 60]
      });
    },

    removeShape: function(shape) {
      this.map.removeLayer(shape);
    },

    polygon: function(geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
      var polygon = new L.GeoJSON(geo, {
        style: function(feature) {
          return shapeOptions;
        }
      });

      if (add !== false) {
        this.Layers.main.addLayer(polygon);
      }

      return polygon;
    },

    circle: function(geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
      var circle = L.circle(
        [geo.latitude, geo.longitude],
        geo.distance,
        shapeOptions
      );

      if (add !== false) {
        this.Layers.main.addLayer(circle);
      }

      return circle;
    },
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    this._setup(options);
    this.Draw.start();
  });

});