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
      App.vent.on('map:draw:tool:enable', this.enableTool, this);

      App.vent.on('trigger:new', function(layer) {
        if (layer) {
          this.editTrigger(layer);
          App.vent.trigger('controls:tools:disable-draw');
        }
      }, this);

      App.vent.on('trigger:create trigger:update trigger:new:cancel', function(){
        this.clear();
      }, this);

      App.vent.on('trigger:edit', function(layer) {
        this.clearShape(layer);
        layer.editing.enable();
        this.editLayer.addLayer(layer);
        App.Map.zoomToLayer(layer);
      }, this);

      // Draw Created Event, fires once at the end of draw
      App.Map.instance.on('draw:created', function(e) {
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

        layer.editing.enable();
        App.vent.trigger('trigger:new', layer);
      });
    },

    editTrigger: function(layer) {
      this.clear();
      this.editLayer.addLayer(layer);
    },

    polygon: function(geo, id) {
      polygon = new L.GeoJSON(geo, {
        style: function(feature) {
          return App.Config.polygonOptions.shapeOptions;
        }
      });

      polygon.addTo(App.Map.instance);

      polygon.triggerId = id;

      polygon.on('click', function(e){
        console.log(e.target.triggerId);
      });

      return polygon;
    },

    radius: function(geo, id) {
      var circle = L.circle(
        [geo.latitude, geo.longitude],
        geo.distance,
        App.Config.circleOptions.shapeOptions
      );

      circle.addTo(App.Map.instance);

      circle.triggerId = id;

      circle.on('click', function(e){
        console.log(e.target.triggerId);
      });

      return circle;
    },

    clearShape: function(shape) {
      App.Map.instance.removeLayer(shape);
    },

    clear: function() {
      this.editLayer.clearLayers();
    },

    enableTool: function(str) {
      this.disableTool();
      this.tools[str].enable();
    },

    disableTool: function(str) {
      for (var i in this.tools) {
        if (typeof str === 'undefined' || i === str) {
          this.tools[i].disable();
        }
      }
    }

  });

  // Draw Layer initializer
  // ----------------------

  Draw.addInitializer(function() {
    // Initialize the FeatureGroup to store editable layers
    this.editLayer = new L.FeatureGroup();
    App.Map.instance.addLayer(this.editLayer);

    //Initialize new Draw Handlers
    this.tools.polygon = new L.Draw.Polygon(App.Map.instance, App.Config.polygonOptions);
    this.tools.radius = new L.Draw.Circle(App.Map.instance, App.Config.circleOptions);

    // drivetime tool will be enabled in later version
    // this.tools.drivetime = new L.Draw.Marker(Map.instance, App.Config.drivetimeOptions);

    this._eventBindings();
  });

});
