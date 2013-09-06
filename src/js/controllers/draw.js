GeotriggerEditor.module('Map.Draw', function(Draw, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Draw Submodule
  // --------------

  _.extend(Draw, {

    editLayer: null,

    tools: {
      // drivetime: null,
      polygon: null,
      radius: null
    },

    _eventBindings: function() {
      App.vent.on('map:draw', this.enableTool, this);

      App.vent.on('trigger:new', function(layer) {
        if (layer) {
          this.editTrigger(layer);
        }
      }, this);

      App.vent.on('trigger:create trigger:update trigger:list trigger:edit', function(){
        this.clear();
      }, this);

      App.vent.on('trigger:edit', function(layer) {
        App.Map.clearShape(layer);
        this.editTrigger(layer);
        App.Map.zoomToLayer(layer);
      }, this);

      // Draw Created Event, fires once at the end of draw
      App.map.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        // if (type === 'marker') {
        //   layer.options.draggable = true;
        //   layer.on('dragend', function(){
        //     console.log('recalculate drivetime', [this._latlng.lat, this._latlng.lng]);
        //   });
        // } else {
        //   layer.editing.enable();
        // }

        App.vent.trigger('trigger:new', layer);
      });
    },

    editTrigger: function(layer) {
      this.clear();
      layer.editing.enable();
      this.editLayer.addLayer(layer);
    },

    clear: function() {
      this.editLayer.clearLayers();
    },

    enableTool: function(name) {
      this.disableTool();
      this.tools[name].enable();
    },

    disableTool: function(name) {
      for (var i in this.tools) {
        if (typeof name === 'undefined' || i === name) {
          this.tools[i].disable();
        }
      }
    }

  });

  // Draw Layer initializer
  // ----------------------

  Draw.addInitializer(function() {
    // Initialize the FeatureGroup to store existing and editable layers
    this.editLayer = new L.FeatureGroup();
    App.map.addLayer(this.editLayer);

    // Initialize new Draw Handlers
    this.tools.polygon = new L.Draw.Polygon(App.map, App.Config.polygonOptions);
    this.tools.radius = new L.Draw.Circle(App.map, App.Config.circleOptions);

    // drivetime tool will be enabled in later version
    // this.tools.drivetime = new L.Draw.Marker(App.map, App.Config.drivetimeOptions);

    this._eventBindings();
  });

});
