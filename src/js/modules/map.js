GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    zoomToLayer: function(layer) {
      this.instance.fitBounds(layer.getBounds(), {
        paddingTopLeft: [App.listDrawerRegion.$el.width(), 0]
      });
    }
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    var el = options.el;

    // L.Icon.Default.imagePath = App.Config.imagePath;
    this.instance = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
    this.instance.zoomControl.setPosition('topright');
    L.esri.basemapLayer(App.Config.Map.basemap).addTo(this.instance);

    this.Draw.start();
  });

});