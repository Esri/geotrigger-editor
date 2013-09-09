GeotriggerEditor.module('Map.Layers', function(Layers, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Layers Submodule
  // ----------------

  _.extend(Layers, {

    _setup: function() {
      this.main = new L.FeatureGroup();
      App.map.addLayer(this.main);

      this.edit = new L.FeatureGroup();
      App.map.addLayer(this.edit);
    }

  });

  // Layers initializer
  // ------------------

  Layers.addInitializer(function() {
    this._setup();
  });

});
