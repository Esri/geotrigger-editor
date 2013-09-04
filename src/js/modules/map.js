GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    zoomToLayer: function(layer) {
      App.map.fitBounds(layer.getBounds(), {
        padding: [100, 100]
      });
    }
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    var el = options.el;

    // L.Icon.Default.imagePath = App.Config.imagePath;
    App.map = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
    App.map.zoomControl.setPosition('topright');
    L.esri.basemapLayer(App.Config.Map.basemap).addTo(App.map);

    this.Draw.start();
  });

});