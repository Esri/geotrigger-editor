GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    zoomToLayer: function(layer) {
      this.map.fitBounds(layer.getBounds(), {
        padding: [100, 100]
      });
    },

    clearShape: function(shape) {
      this.map.removeLayer(shape);
    },

    polygon: function(geo, triggerId) {
      var polygon = new L.GeoJSON(geo, {
        style: function(feature) {
          return App.Config.polygonOptions.shapeOptions;
        }
      });

      this.mainLayer.addLayer(polygon);

      polygon.triggerId = triggerId;

      polygon.on('click', function(e){
        console.log(e.target.triggerId);
      });

      return polygon;
    },

    circle: function(geo, triggerId) {
      var circle = L.circle(
        [geo.latitude, geo.longitude],
        geo.distance,
        App.Config.circleOptions.shapeOptions
      );

      this.mainLayer.addLayer(circle);

      circle.triggerId = triggerId;

      circle.on('click', function(e){
        console.log(e.target.triggerId);
      });

      return circle;
    },
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    var el = options.el;

    // L.Icon.Default.imagePath = App.Config.imagePath;
    App.map = this.map = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
    this.map.zoomControl.setPosition('topright');
    L.esri.basemapLayer(App.Config.Map.basemap).addTo(App.map);

    this.mainLayer = new L.FeatureGroup();
    App.map.addLayer(this.mainLayer);

    this.Draw.start();
  });

});