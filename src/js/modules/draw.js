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

    polygon: function(geo, id) {
      polygon = new L.GeoJSON(geo, {
        style: function(feature) {
          return App.Config.polygonOptions.shapeOptions;
        }
      });

      this.mainLayer.addLayer(polygon);

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

      this.mainLayer.addLayer(circle);

      circle.triggerId = id;

      circle.on('click', function(e){
        console.log(e.target.triggerId);
      });

      return circle;
    },

    clearShape: function(shape) {
      App.map.removeLayer(shape);
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
    // Initialize the FeatureGroup to store existing and editable layers
    this.editLayer = new L.FeatureGroup();
    this.mainLayer = new L.FeatureGroup();
    App.map.addLayer(this.editLayer);
    App.map.addLayer(this.mainLayer);

    // Initialize new Draw Handlers
    this.tools.polygon = new L.Draw.Polygon(App.map, App.Config.polygonOptions);
    this.tools.radius = new L.Draw.Circle(App.map, App.Config.circleOptions);

    // drivetime tool will be enabled in later version
    // this.tools.drivetime = new L.Draw.Marker(App.map, App.Config.drivetimeOptions);

    this._eventBindings();
  });

});
