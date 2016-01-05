Geotrigger.Editor.module('Map.Draw', function (Draw, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Draw Submodule
  // --------------

  _.extend(Draw, {

    _tools: {
      polygon: null,
      radius: null
    },

    _setup: function () {
      // Initialize new Draw Handlers
      this._tools.polygon = new L.Draw.Polygon(App.map, App.config.editOptions);
      this._tools.radius = new L.Draw.Circle(App.map, App.config.editOptions);

      this._eventBindings();
    },

    _eventBindings: function () {
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

    panToNewTrigger: function () {
      var layer = App.request('draw:layer');
      if (layer) {
        App.Map.panToLayer(layer);
      }
    },

    panToTrigger: function (triggerId) {
      var layer = this.newShape(triggerId);
      this.editLayer(layer);
      if (App._zoomToLayer) {
        delete App._zoomToLayer;
        App.Map.zoomToLayer(layer);
      } else {
        App.Map.panToLayer(layer);
      }
    },

    broadcastLayer: function (e) {
      var type = e.layerType;
      var layer = e.layer;
      var triggerArea;

      if (type == 'circle') {
        var origin = layer.getLatLng(); //center of drawn circle
        var radius = layer.getRadius(); //radius of drawn circle
        var projection = L.CRS.EPSG4326;
        var polys = App.util.createGeodesicPolygon(origin, radius, 60, 0, projection); //these are the points that make up the circle
        var polygon = []; // store the geometry
        for (var i = 0; i < polys.length; i++) {
            var geometry = [polys[i].lat, polys[i].lng];
            polygon.push(geometry);
        }
        triggerArea = turf.area(L.polygon(polygon).toGeoJSON());
      }

      else {
        triggerArea = turf.area(e.layer.toGeoJSON());
      }

      if (triggerArea < 2500) {
        App.vent.trigger('notify', 'we recommend triggers have an area greater than 50sq/m');

        window.setTimeout(function () {
          App.vent.trigger('notify:clear');
        }, 5000);

      }
      App.vent.trigger('draw:new', layer);
    },

    getEditLayer: function () {
      return App.Map.Layers.edit.getLayers()[0];
    },

    newShape: function (triggerId) {
      var model = App.collections.triggers.findWhere({
        'triggerId': triggerId
      });
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      // circle
      if (geo.distance) {
        shape = App.Map.circle(geo, App.config.editOptions.shapeOptions, false);
      }

      // polygon
      else if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.config.editOptions.shapeOptions, false).getLayers()[0];
      }

      // invalid shape
      else {
        if (console && console.error) {
          console.error('invalid geo data', geo);
        }
        return;
      }

      return shape;
    },

    editLayer: function (layer) {
      this.clear();

      var isMultiPolygon = (function(){
        if (layer &&
          layer.feature &&
          layer.feature.geometry &&
          layer.feature.geometry.type) {
          return layer.feature.geometry.type === 'MultiPolygon';
        } else {
          return false;
        }
      })();

      if (isMultiPolygon) {
        window.layer = layer;
        App.vent.trigger('notify', 'Editing multipolygon trigger boundaries is not yet supported');
        return App.Map.Layers.edit.addLayer(layer);
      }

      if (layer.editing) {
        layer.editing.enable();
        return App.Map.Layers.edit.addLayer(layer);
      }

      App.vent.trigger('notify', {
        type: 'error',
        message: 'Unknown error while trying to enable editing'
      });

      console.error('LayerError', layer);
    },

    clear: function () {
      App.Map.Layers.edit.clearLayers();
    },

    enableTool: function (name) {
      this.disableTool();
      this._tools[name].enable();
    },

    disableTool: function (name) {
      for (var i in this._tools) {
        if (typeof name === 'undefined' || i === name) {
          this._tools[i].disable();
        }
      }
    }

  });

  // Draw Layer initializer
  // ----------------------

  Draw.addInitializer(function () {
    this._setup();
  });

});
