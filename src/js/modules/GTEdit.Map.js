GTEdit.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  var Draw = {
    editLayer: null,

    tools: {
      polygon: null,
      radius: null,
      drivetime: null
    },

    init: function() {
      // Initialize the FeatureGroup to store editable layers
      this.editLayer = new L.FeatureGroup();
      Map.instance.addLayer(this.editLayer);

      var controlOptions = {
        position: 'topright',
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            // drawError: {
            //   color: '#e1e100', // Color the shape will turn when intersects
            //   message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            // },
            shapeOptions: {
              color: '#bada55'
            }
          },
          // circle: false, // Turns off this drawing tool
          rectangle: false
        },
        edit: {
          featureGroup: this.editLayer // REQUIRED!!
          // remove: false
        }
      };

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      // var drawControl = new L.Control.Draw(controlOptions);
      // Map.instance.addControl(drawControl);

      this.tools.polygon = new L.Draw.Polygon(Map.instance);
      this.tools.radius = new L.Draw.Circle(Map.instance);
      this.tools.drivetime = new L.Draw.Marker(Map.instance);

      Map.instance.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        console.log(e);
        // layer.bindPopup(type);

        if (type === 'marker') {
          layer.options.draggable = true;
          layer.on('dragend', function(){
            console.log('recalculate drivetime', [this._latlng.lat, this._latlng.lng]);
          });
        } else {
          layer.editing.enable();
        }

        Map.Draw.editLayer.addLayer(layer);

        App.controlsRegion.currentView.disableDrawTool();
        App.controlsRegion.currentView.toggleNew();
      });
    },

    enableTool: function(str) {
      for (var prop in this.tools) {
        if (this.tools.hasOwnProperty(prop)) {
          if (prop === str) {
            this.tools[prop].enable();
          } else {
            this.tools[prop].disable();
          }
        }
      }
    },

    disableTool: function(str) {
      for (var prop in this.tools) {
        if (this.tools.hasOwnProperty(prop)) {
          if (typeof str === 'undefined' || prop === str) {
            this.tools[prop].disable();
          }
        }
      }
    }
  };

  _.extend(Map, {
    init: function(el) {
      // L.Icon.Default.imagePath = App.Config.imagePath;
      this.instance = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
      this.instance.zoomControl.setPosition('topright');
      L.esri.basemapLayer(App.Config.Map.basemap).addTo(this.instance);

      this.Draw.init();
    },

    Draw: Draw
  });

});