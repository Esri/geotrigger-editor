(function(Handlebars, $) {

  Handlebars.registerHelper('select', function(value, options) {
    // Create a select element
    var select = document.createElement('select');

    // Populate it with the option HTML
    select.innerHTML = options.fn(this);

    // Set the value
    select.value = value;

    // Find the selected node, if it exists, add the selected attribute to it
    if (select.children[select.selectedIndex]) {
      select.children[select.selectedIndex].setAttribute('selected', 'selected');
    }

    return select.innerHTML;
  });

}(Handlebars, $));;//
// Use internal $.serializeArray to get list of form elements which is
// consistent with $.serialize
//
// From version 2.0.0, $.serializeObject will stop converting [name] values
// to camelCase format. This is *consistent* with other serialize methods:
//
//   - $.serialize
//   - $.serializeArray
//
// If you require camel casing, you can either download version 1.0.4 or map
// them yourself.
//

(function($){
  $.fn.serializeObject = function () {
    "use strict";

    var result = {};
    var extend = function (i, element) {
      var node = result[element.name];

  // If node with same name exists already, need to convert it to an array as it
  // is a multi-value field (i.e., checkboxes)

      if ('undefined' !== typeof node && node !== null) {
        if ($.isArray(node)) {
          node.push(element.value);
        } else {
          result[element.name] = [node, element.value];
        }
      } else {
        result[element.name] = element.value;
      }
    };

    $.each(this.serializeArray(), extend);
    return result;
  };
})(jQuery);;L.Tooltip.prototype.updatePosition = function(latlng) {
  var pos = this._map.latLngToLayerPoint(latlng);

  L.DomUtil.setPosition(this._container, pos);
  this._container.style.display = 'inline-block';

  return this;
};;// @TODO: investigate handlebars precompilation: http://handlebarsjs.com/precompilation.html

var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addRegions({
  controlsRegion: '#gt-controls-region',
  listDrawerRegion: '.gt-drawer-list',
  newDrawerRegion: '.gt-drawer-new',
  mapRegion: '#gt-map-region'
});

GeotriggerEditor.on('initialize:after', function() {
  Backbone.history.start();
});
;GeotriggerEditor.module('Config', function(Config, App, Backbone, Marionette, $, _) {

  var sharedOptions = {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#00b1dc',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  };

  var icon = L.icon({
    iconUrl: 'img/blue-dot.png',
    iconRetinaUrl: 'img/blue-dot@2x.png',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, 0],
    shadowUrl: null,
    shadowRetinaUrl: null,
    shadowSize: [0, 0],
    shadowAnchor: [0, 0]
  });

  _.extend(Config, {

    Map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    imagePath: '/images',

    polygonOptions: sharedOptions,

    circleOptions: sharedOptions,

    drivetimeOptions: {
      icon: icon
    }

  });

});;GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  Editor.Router = Marionette.AppRouter.extend({
    appRoutes: {}
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function() {
    this.triggerCollection = new App.Collections.Triggers();
  };

  _.extend(Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function() {
      this.showMap();
      this.showControls();
      this.setupDrawers(this.triggerCollection);

      this.triggerCollection.fetch({
        success: function(collection, response, options) {
          // console.log('success', arguments);
        },
        error: function(collection, response, options) {
          // console.log('error', arguments);
        },
        complete: function(xhr, textStatus) {
          // console.log('complete', arguments);
        }
      });
    },

    showMap: function() {
      var map = new App.Views.Map();
      App.mapRegion.show(map);
    },

    showControls: function() {
      App.Editor.Controller.controlsView = new App.Views.Controls();
      App.controlsRegion.show(App.Editor.Controller.controlsView);
    },

    setupDrawers: function(triggers) {
      this.drawerLayout = new App.Layout.Drawer();
      var listView = new App.Views.List({ collection: triggers });
      var emptyView = new App.Views.Empty();
      // var newView = new App.Views.New();

      // populate list drawer
      App.listDrawerRegion.show(this.drawerLayout);
      this.drawerLayout.listRegion.show(listView);

      // populate new drawer
      // App.newDrawerRegion.show(newView);

      // open list drawer
      App.Editor.Controller.controlsView.toggleList();
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing geotriggers and displaying them.

  Editor.addInitializer(function() {
    Editor.Controller = new Controller();
    new Editor.Router({
      controller: Editor.Controller
    });

    Editor.Controller.start();
  });

});;GeotriggerEditor.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layout.Drawer = Backbone.Marionette.Layout.extend({
    template: 'drawer-list',
    className: 'gt-panel-wrap',

    events: {
      'click .gt-back-to-list' : 'backToList',
      'click .gt-close-drawer' : 'closeDrawer'
    },

    regions: {
      listRegion : '.gt-panel-list',
      editRegion : '.gt-panel-edit'
    },

    backToList: function(e) {
      e.preventDefault();
      this.$el.removeClass('gt-panel-editing');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }
      App.Editor.Controller.controlsView.restoreShape();
      App.listDrawerRegion.$el.removeClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-list').removeClass('gt-active');
    }
  });

});
;GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  // Draw Submodule
  // --------------

  var Draw = {
    editLayer: null,

    tools: {
      polygon: null,
      radius: null
      // drivetime: null
    },

    // Draw Layer initializer
    // ----------------------

    init: function() {
      // Initialize the FeatureGroup to store editable layers
      this.editLayer = new L.FeatureGroup();
      Map.instance.addLayer(this.editLayer);

      //Initialize new Draw Handlers
      this.tools.polygon = new L.Draw.Polygon(Map.instance, App.Config.polygonOptions);
      this.tools.radius = new L.Draw.Circle(Map.instance, App.Config.circleOptions);

      // drivetime tool will be enabled in later version
      // this.tools.drivetime = new L.Draw.Marker(Map.instance, App.Config.drivetimeOptions);

      //Draw Created Event, fires once at the end of draw
      Map.instance.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        // layer.bindPopup(type);

        // if (type === 'marker') {
        //   layer.options.draggable = true;
        //   layer.on('dragend', function(){
        //     console.log('recalculate drivetime', [this._latlng.lat, this._latlng.lng]);
        //   });
        // } else {
        //   layer.editing.enable();
        // }

        layer.editing.enable();

        Map.Draw.clear();
        Map.Draw.editLayer.addLayer(layer);

        App.controlsRegion.currentView.disableDrawTool();
        App.controlsRegion.currentView.showNew();
      });
    },

    polygon: function(geo) {
      polygon = new L.GeoJSON(geo, {
        style: function(feature) {
            return App.Config.polygonOptions.shapeOptions;
        }
      });
      polygon.addTo(Map.instance);
      return polygon;
    },

    radius: function(geo) {
      var circle = L.circle(
        [geo.latitude,geo.longitude],
        geo.distance,
        App.Config.circleOptions.shapeOptions
      );
      circle.addTo(Map.instance);
      return circle;
    },

    clearShape: function(shape) {
      Map.instance.removeLayer(shape);
    },

    clear: function() {
      Map.Draw.editLayer.clearLayers();
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

  };

  // Map Module
  // ----------

  _.extend(Map, {

    // Map Initializer
    // ---------------

    init: function(el) {
      // L.Icon.Default.imagePath = App.Config.imagePath;
      this.instance = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
      this.instance.zoomControl.setPosition('topright');
      L.esri.basemapLayer(App.Config.Map.basemap).addTo(this.instance);

      this.Draw.init();
    },

    zoomToLayer: function(layer) {
      this.instance.fitBounds(layer.getBounds(), {
        paddingTopLeft: [App.listDrawerRegion.$el.width(), 0]
      });
    },

    Draw: Draw
  });

});;GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    defaults: {
      // 'triggerId': null,
      'condition': {
        'direction': 'enter',
        'geo': {
          // 'geocode': '920 SW 3rd Ave, Portland, OR',
          // 'driveTime': 600,
          // 'context': {
          //   'locality': 'Portland',
          //   'region': 'Oregon',
          //   'country': 'USA',
          //   'zipcode': '97204'
          // }
          'latitude': 45.5165,
          'longitude': -122.6764,
          'distance': 240
        }
      },
      'action': {
        'message': 'Welcome to Portland'
        // 'callback': 'http://pdx.gov/welcome'
      },
      'tags': ['foodcarts', 'citygreetings']
    }

    // inherit sync method from collection
    //sync: this.collection.sync
  });

});;GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Trigger Collection
  // ------------------

  Collections.Triggers = Backbone.Collection.extend({
    model: App.Models.Trigger,
    url: '/dev/js/response.json',

    parse: function(response) {
      return response.triggers;
    }

    // override sync method to use geotrigger API
    // sync: function(method, model, options) {}
  });

});;GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Controls View
  // -------------
  //
  // Displays controls and handles state of drawer and tools.

  Views.Controls = Marionette.ItemView.extend({
    template: 'controls',
    className: 'gt-control-group',

    events: {
      'click .gt-tool-list'       : 'toggleList',
      'click .gt-tool-create'     : 'toggleNew',
      'click .gt-tool-polygon'    : 'polygon',
      'click .gt-tool-radius'     : 'radius'
      // 'click .gt-tool-drivetime'  : 'drivetime'
    },

    toggleList: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      // make sure new drawer is closed
      if (App.newDrawerRegion.currentView) {
        App.newDrawerRegion.currentView.closeDrawer();
      }

      // toggle active state of list drawer
      App.listDrawerRegion.$el.toggleClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-list').toggleClass('gt-active');
      this.resetDeleteButtons();
      this.restoreShape();
    },

    toggleNew: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      // make sure list drawer is closed
      App.listDrawerRegion.currentView.closeDrawer();

      if (!App.newDrawerRegion.currentView || !App.newDrawerRegion.$el.hasClass('gt-open')) {
        var newView = new App.Views.New();
        App.newDrawerRegion.show(newView);
      }
      // toggle active state of new drawer
      App.newDrawerRegion.$el.toggleClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').toggleClass('gt-active');
      this.resetDeleteButtons();
      this.restoreShape();
    },

    showNew: function(layer) {
      var newView = new App.Views.New({ layer: App.Map.Draw.editLayer });
      App.newDrawerRegion.show(newView);

      // make sure list drawer is closed
      App.listDrawerRegion.currentView.closeDrawer();

      // toggle active state of new drawer
      App.newDrawerRegion.$el.addClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').addClass('gt-active');
      this.resetDeleteButtons();
      this.restoreShape();
    },

    polygon: function(e) {
      e.preventDefault();
      this.enableDrawTool('polygon');
    },

    radius: function(e) {
      e.preventDefault();
      this.enableDrawTool('radius');
    },

    // drivetime: function(e) {
    //   e.preventDefault();
    //   this.enableDrawTool('drivetime');
    // },

    enableDrawTool: function(str) {
      this.disableDrawTool();
      App.Map.Draw.enableTool(str);
      App.controlsRegion.$el.find('.gt-tool-' + str).addClass('gt-active');
      this.resetDeleteButtons();
    },

    disableDrawTool: function(str) {
      if (str) {
        App.Map.Draw.disableTool(str);
      }
      App.controlsRegion.$el.find('.gt-draw-tools .gt-tool').removeClass('gt-active');
    },

    resetDeleteButtons: function(e) {
      App.Editor.Controller.drawerLayout.$el.find('.gt-item-confirm-delete').removeClass("gt-item-confirm-delete");
      App.Editor.Controller.drawerLayout.$el.find('.gt-reset-delete').removeClass('gt-reset-flyout');
    },

    restoreShape: function() {
      if (App.Editor.Controller.drawerLayout.editRegion.currentView) {
        App.Editor.Controller.drawerLayout.editRegion.currentView.restoreShape();
      }
    }
  });

});;GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Edit = Marionette.ItemView.extend({
    template: 'edit',
    className: 'gt-edit',

    onShow: function() {
      var item = this.options.item;
      var layer;
      if (item.shape.getLayers) {
        layer = item.shape.getLayers()[0];
      } else if (item.shape.editing) {
        layer = item.shape;
      } else {
        throw new Error('Unknown Layer Error');
      }

      App.Map.Draw.clearShape(layer);
      layer.editing.enable();
      App.Map.Draw.editLayer.addLayer(layer);
      App.Map.zoomToLayer(layer);
    },

    restoreShape: function() {
      this.options.item.restoreShape();
    }
  });

  // Application Event Handlers
  // --------------------------
  //
  // Handler for filtering the list of items by showing and
  // hiding through the use of various CSS classes

  // App.vent.on('item:event', function(eventData) {
  //   // event handler logic
  // });

});;GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger List Item View
  // ----------------------
  //
  // Displays an individual trigger list item, and responds to changes that are made to the trigger.

  Views.ListItem = Marionette.ItemView.extend({
    template: 'item',
    tagName: 'li',
    className: 'gt-result',

    events: {
      'click .gt-item-edit'           : 'editItem',
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    initialize: function() {
      // THIS
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change', this.renderShape);
    },

    onShow: function() {
      App.listDrawerRegion.$el.find('.gt-list-header').removeClass('gt-hide');
      this.renderShape();
    },

    renderShape: function() {
      if (this.shape) {
        App.Map.Draw.clearShape(this.shape);
        this.shape = null;
      }
      var geo = this.model.get('condition').geo;
      if (geo.geojson){
        this.shape = App.Map.Draw.polygon(geo.geojson);
      } else {
        this.shape = App.Map.Draw.radius(geo);
      }
    },

    restoreShape: function() {
      // should start using App.vent instead of this restoreShape mess
      if (!App.Map.instance.hasLayer(this.shape)) {
        App.Map.Draw.clear();
        this.renderShape();
      }
    },

    editItem: function(e) {
      e.preventDefault();
      var editView = new App.Views.Edit({ model: this.model, item: this });
      App.Editor.Controller.drawerLayout.editRegion.show(editView);
      App.Editor.Controller.drawerLayout.$el.addClass('gt-panel-editing');
      App.Editor.Controller.controlsView.resetDeleteButtons();
    },

    confirmDelete: function(e) {
      e.preventDefault();
      this.$el.find('.gt-item-delete').addClass('gt-item-confirm-delete');
      this.$el.find('.gt-reset-delete').addClass('gt-reset-flyout');
    },

    resetDelete: function(e) {
      e.preventDefault();
      this.$el.find('.gt-item-confirm-delete').removeClass('gt-item-confirm-delete');
      this.$el.find('.gt-reset-delete').removeClass('gt-reset-flyout');
    },

    destroyModel: function(e) {
      e.preventDefault();
      App.Map.Draw.clearShape(this.shape);
      this.model.destroy();
    }
  });

  // Trigger List Empty View
  // ----------------------
  //
  // Displays some helpful information when no triggers are found.

  Views.Empty = Marionette.ItemView.extend({
    template: 'empty',
    className: 'gt-list-empty',

    events: {
      'click .gt-tool-create': 'newTrigger'
    },

    onShow: function() {
      App.listDrawerRegion.$el.find('.gt-list-header').addClass('gt-hide');
    },

    newTrigger: function(e) {
      e.preventDefault();
      App.Editor.Controller.controlsView.toggleNew();
    }

  });

  // Trigger List View
  // -----------------
  //
  // Controls the rendering of the list of items, including the
  // filtering of activs vs completed items for display.

  Views.List = Marionette.CompositeView.extend({
    template: 'list',
    className: 'gt-list',
    itemView: Views.ListItem,
    itemViewContainer: '.gt-results',
    emptyView: Views.Empty
  });

});;GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Map Item View
  // -------------
  //
  // Manages the esri-leaflet map.

  Views.Map = Marionette.ItemView.extend({
    id: 'gt-map',

    render: function() {
      this.isClosed = false;

      this.triggerMethod('before:render', this);
      this.triggerMethod('item:before:render', this);

      this.triggerMethod('render', this);
      this.triggerMethod('item:rendered', this);

      return this;
    },

    onShow: function() {
      App.Map.init(this.el);
    }
  });

});;GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.

  Views.New = Marionette.ItemView.extend({
    template: 'new',
    className: 'gt-new gt-panel-wrap',

    events: {
      'click .gt-close-drawer': 'closeDrawer',
      'click .gt-submit': 'parseForm'
    },

    initialize: function(options) {
      if (typeof options !== 'undefined' && options.layer) {
        App.Map.zoomToLayer(options.layer);
        // then convert layer information into something the form can display
      }
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      App.Map.Draw.clear();
      App.newDrawerRegion.$el.removeClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').removeClass('gt-active');
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();
      // console.log(data);
      if (data) {
        this.createTrigger(data);
        App.Editor.Controller.controlsView.toggleList();
      }
    },

    createTrigger: function(data) {
      var newLayer = App.Map.Draw.editLayer.getLayers()[0];
      var dummydata = {
        "condition": {
          "direction": "enter",
          "geo": {
            "geojson": newLayer.toGeoJSON()
          }
        },
        "action": {
          "message": "Welcome to Portland - The Mayor",
          "callback": "http://pdx.gov/welcome"
        },
        "tags": ["newtags"]
      };

      App.Map.Draw.clear();
      App.Editor.Controller.triggerCollection.add(new App.Models.Trigger(dummydata));
    }
  });

});