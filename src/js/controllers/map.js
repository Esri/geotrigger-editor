Geotrigger.Editor.module('Map', function (Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    _setup: function (options) {
      // force L.esri to use JSONP if proxy is set
      if (App.config.session.proxy) {
        L.esri.get = L.esri.Request.get.JSONP;
      }

      var basemap = this._getDefaultBasemap();

      App.map = this.map = L.map(options.el, {
        center: App.config.map.center,
        zoom: App.config.map.zoom,
        layers: [basemap]
      });

      this.map.zoomControl.setPosition('topright');

      L.control.layers(this.basemaps).addTo(App.map);

      if (L.esri && L.esri.Geocoding.Controls && L.esri.Geocoding.Controls.Geosearch) {
        var searchControl = new L.esri.Geocoding.Controls.Geosearch({
          position: 'topright'
        }).addTo(App.map);
      }

      this.Layers.start();
      this._eventBindings();
    },

    _getDefaultBasemap: function() {
      this._setupBasemaps();

      if (App.config.map.basemap && this.basemaps.hasOwnProperty(App.config.map.basemap)) {
        return this.basemaps[App.config.map.basemap];
      }

      // allow default basemap to be an array of esri basemap layers
      if (App.util.isArray(App.config.map.basemaps)) {
        var group = L.layerGroup();
        for (var i = 0; i < App.config.map.basemaps.length; i++) {
          group.addLayer(App.config.map.basemaps[i], App.config.map.options);
        }
        return group;
      }

      else {
        return L.esri.basemapLayer(App.config.map.basemap, App.config.map.options);
      }
    },

    _eventBindings: function () {
      App.commands.setHandler('map:fit', _.bind(function () {
        if (this.Layers.main.getLayers().length === 0) {
          return;
        }

        var bounds = this.Layers.main.getBounds();
        var drawerWidth = this.getDrawerWidth();

        this.map.fitBounds(bounds, {
          animate: false,
          paddingTopLeft: [drawerWidth, 0]
        });
      }, this));
    },

    _setupBasemaps: function() {
      var streets = L.esri.basemapLayer('Streets', App.config.map.options);
      var topo = L.esri.basemapLayer('Topographic', App.config.map.options);
      var oceans = L.esri.basemapLayer('Oceans', App.config.map.options);
      var natgeo = L.esri.basemapLayer('NationalGeographic', App.config.map.options);

      var gray = L.layerGroup([
        L.esri.basemapLayer('Gray', App.config.map.options),
        L.esri.basemapLayer('GrayLabels', App.config.map.options)
      ]);
      var darkgray = L.layerGroup([
        L.esri.basemapLayer('DarkGray', App.config.map.options),
        L.esri.basemapLayer('DarkGrayLabels', App.config.map.options)
      ]);
      var imagery = L.layerGroup([
        L.esri.basemapLayer('Imagery', App.config.map.options),
        L.esri.basemapLayer('ImageryLabels', App.config.map.options)
      ]);
      var shadedrelief = L.layerGroup([
        L.esri.basemapLayer('ShadedRelief', App.config.map.options),
        L.esri.basemapLayer('ShadedReliefLabels', App.config.map.options)
      ]);

      this.basemaps = {
        'Streets': streets,
        'Topographic': topo,
        'Oceans': oceans,
        'NationalGeographic': natgeo,
        'Gray': gray,
        'DarkGray': darkgray,
        'Imagery': imagery,
        'ShadedRelief': shadedrelief
      };
    },

    getDrawerWidth: function () {
      var $content = App.mainRegion.$el.find('#gt-content');
      var $drawer = $content.find('#gt-drawer-region');

      if ($content.hasClass('gt-active')) {
        return $drawer.width();
      } else {
        return 0;
      }
    },

    panToLayer: function (layer) {
      var latlng;

      if (layer.getLatLng) {
        latlng = layer.getLatLng();
      } else if (layer.getCenter) {
        latlng = layer.getCenter();
      }

      var drawerWidth = this.getDrawerWidth();

      if (drawerWidth) {
        var projected = this.map.project(latlng);
        projected.x = projected.x - (drawerWidth / 2);
        latlng = this.map.unproject(projected);
      }

      if (latlng) {
        this.map.panTo(latlng, {
          animate: true
        });
      }
    },

    zoomToLayer: function (layer) {
      var bounds = layer.getBounds();
      var drawerWidth = this.getDrawerWidth();

      this.map.fitBounds(bounds, {
        animate: false,
        paddingTopLeft: [drawerWidth, 0]
      });
    },

    removeShape: function (shape) {
      this.map.removeLayer(shape);
    },

    focusShape: function (shape) {
      shape.setStyle(App.config.highlightOptions.shapeOptions);
    },

    unfocusShape: function (shape) {
      shape.setStyle(App.config.sharedOptions.shapeOptions);
    },

    polygon: function (geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
      var polygon = new L.GeoJSON(geo, {
        style: function (feature) {
          return shapeOptions;
        }
      });

      if (add !== false) {
        this.Layers.main.addLayer(polygon);
      }

      return polygon;
    },

    circle: function (geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
      var circle = L.circle(
        [geo.latitude, geo.longitude],
        geo.distance,
        shapeOptions
      );

      if (add !== false) {
        this.Layers.main.addLayer(circle);
      }

      return circle;
    }
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function (options) {
    this._setup(options);
    this.Draw.start();
  });

});
