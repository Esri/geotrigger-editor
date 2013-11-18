GeotriggerEditor.module('Map.Draw', function(Draw, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Draw Submodule
  // --------------

  _.extend(Draw, {

    _tools: {
      polygon: null,
      radius: null
    },

    _setup: function() {
      // Initialize new Draw Handlers
      this._tools.polygon = new L.Draw.Polygon(App.map, App.config.editOptions);
      this._tools.radius = new L.Draw.Circle(App.map, App.config.editOptions);

      this._eventBindings();
    },

    _eventBindings: function() {
      App.vent.on('draw:new', this.editLayer, this);
      App.vent.on('index trigger:list trigger:edit', this.clear, this);
      App.vent.on('trigger:new:ready', this.panToNewTrigger, this);
      App.vent.on('trigger:edit', this.panToTrigger, this);
      App.vent.on('draw:enable', this.enableTool, this);
      App.vent.on('draw:disable', this.disableTool, this);

      App.map.on('draw:created', this.broadcastLayer);

      App.reqres.setHandler('draw:layer', this.getEditLayer, this);
      App.commands.setHandler('draw:clear', this.clear, this);
    },

    panToNewTrigger: function() {
      var layer = App.request('draw:layer');
      if (layer) {
        App.Map.panToLayer(layer);
      }
    },

    panToTrigger: function (triggerId) {
      var layer = this.newShape(triggerId);
      this.editLayer(layer);
      App.Map.panToLayer(layer);
    },

    broadcastLayer: function (e) {
      var type = e.layerType;
      var layer = e.layer;

      App.vent.trigger('draw:new', layer);
    },

    getEditLayer: function() {
      return App.Map.Layers.edit.getLayers()[0];
    },

    newShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.config.editOptions.shapeOptions, false).getLayers()[0];
      } else {
        shape = App.Map.circle(geo, App.config.editOptions.shapeOptions, false);
      }

      return shape;
    },

    editLayer: function(layer) {
      this.clear();
      layer.editing.enable();
      App.Map.Layers.edit.addLayer(layer);
    },

    clear: function() {
      App.Map.Layers.edit.clearLayers();
    },

    enableTool: function(name) {
      this.disableTool();
      this._tools[name].enable();
    },

    disableTool: function(name) {
      for (var i in this._tools) {
        if (typeof name === 'undefined' || i === name) {
          this._tools[i].disable();
        }
      }
    }

  });

  // Draw Layer initializer
  // ----------------------

  Draw.addInitializer(function() {
    this._setup();
  });

});
