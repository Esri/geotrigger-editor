GeotriggerEditor.module('Map.Draw', function(Draw, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Draw Submodule
  // --------------

  _.extend(Draw, {

    _editLayer: null,

    _tools: {
      polygon: null,
      radius: null
    },

    _setup: function() {
      // Initialize the FeatureGroup to store existing and editable layers
      this._editLayer = new L.FeatureGroup();
      App.map.addLayer(this._editLayer);

      // Initialize new Draw Handlers
      this._tools.polygon = new L.Draw.Polygon(App.map, App.Config.editOptions);
      this._tools.radius = new L.Draw.Circle(App.map, App.Config.editOptions);

      this._eventBindings();
    },

    _eventBindings: function() {
      App.vent.on('draw:new', function(layer) {
        this.editTrigger(layer);
      }, this);

      App.vent.on('index trigger:new trigger:list trigger:edit', function(){
        this.clear();
      }, this);

      App.vent.on('trigger:edit', function(triggerId) {
        var layer = this.newShape(triggerId);
        this.editTrigger(layer);
        // App.Map.panToLayer(layer);
      }, this);

      App.map.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        App.vent.trigger('draw:new', layer);
      });

      App.reqres.setHandler('draw:layer', _.bind(function(){
        return this._editLayer.getLayers()[0];
      }, this));

      App.commands.setHandler('draw:clear', _.bind(function(){
        this.clear();
      }, this));

      App.commands.setHandler('draw:enable', _.bind(function(tool){
        this.enableTool(tool);
      }, this));

      App.commands.setHandler('draw:disable', _.bind(function(tool){
        this.disableTool(tool);
      }, this));
    },

    newShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.Config.editOptions.shapeOptions, false).getLayers()[0];
      } else {
        shape = App.Map.circle(geo, App.Config.editOptions.shapeOptions, false);
      }

      return shape;
    },

    editTrigger: function(layer) {
      this.clear();
      layer.editing.enable();
      this._editLayer.addLayer(layer);
    },

    clear: function() {
      this._editLayer.clearLayers();
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