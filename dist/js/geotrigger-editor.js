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

}(Handlebars, $));

//
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
})(jQuery);

L.Tooltip.prototype.updatePosition = function(latlng) {
  var pos = this._map.latLngToLayerPoint(latlng);

  L.DomUtil.setPosition(this._container, pos);
  this._container.style.display = 'inline-block';

  return this;
};

var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  var el = options && options.el ? options.el : '#gt-editor';
  var mainView = new this.Views.Main();

  this.addRegions({ mainRegion: el });
  this.mainRegion.show(mainView);
  this.addRegions({
    controlsRegion: '#gt-controls-region',
    listDrawerRegion: '#gt-drawer-list',
    newDrawerRegion: '#gt-drawer-new',
    mapRegion: '#gt-map-region',
    notificationsRegion: '#gt-notifications'
  });
});

GeotriggerEditor.on('initialize:after', function() {
  Backbone.history.start();
});


this["GeotriggerEditor"] = this["GeotriggerEditor"] || {};
this["GeotriggerEditor"]["Templates"] = this["GeotriggerEditor"]["Templates"] || {};

this["GeotriggerEditor"]["Templates"]["controls"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<a href=\"#\" class=\"gt-tool gt-tool-list active gt-tooltip\"><span>List</span></a>\n<a href=\"#\" class=\"gt-tool gt-tool-create gt-tooltip\"><span>Create</span></a>\n\n<div class=\"gt-draw-tools\">\n  <a href=\"#\" class=\"gt-tool gt-tool-polygon gt-tooltip\"><span>Polygon</span></a>\n  <a href=\"#\" class=\"gt-tool gt-tool-radius gt-tooltip\"><span>Radius</span></a>\n  <!-- <a href=\"#\" class=\"gt-tool gt-tool-drivetime gt-tooltip\"><span>Drivetime</span></a> -->\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["drawer-list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel gt-panel-list\">\n  <!-- templates/list.hbs -->\n</div>\n\n<div class=\"gt-panel gt-panel-edit\">\n  <!-- templates/edit.hbs -->\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["drawer-new"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel gt-panel-new\">\n  <!-- templates/new.hbs -->\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + ", ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n        <option value=\"enter\">enters inside</option>\n        <option value=\"exit\">exits</option>\n        ";
  }

  buffer += "<div class=\"gt-panel-top-bar\">\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-back-to-list\"></a>\n  <h3>Edit</h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n<div class=\"gt-panel-content\">\n  <form>\n    <input type=\"text\" name=\"title\" placeholder=\"Title\" class=\"gt-trigger-title-input\">\n    <span class=\"gt-tag-label\">When a device tagged</span>\n    <input type=\"text\" placeholder=\"enter tags\" class=\"gt-tag-input\" value=\"";
  stack1 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n    <label for=\"event\" class=\"left\">\n      <select name=\"event\" class=\"gt-event\">\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n      <select name=\"geometry-type\" class=\"gt-geometry-type\">\n        <option value=\"polygon\" selected>a polygon</option>\n        <option value=\"radius\">a distance of</option>\n        <!-- <option value=\"drivetime\">a drivetime of</option> -->\n      </select>\n    </label>\n    <select name=\"action\" class=\"gt-action\">\n      <option value=\"message\" selected>send the device a message</option>\n      <option value=\"server\">post to a server</option>\n      <option value=\"log\">log the event</option>\n      <option value=\"profile\">change tracking profile</option>\n    </select>\n    <span>:</span>\n    <label for=\"message\">\n      <textarea name=\"message\" placeholder=\"message\"></textarea>\n    </label>\n    <label for=\"url\">\n      <input type=\"text\" placeholder=\"url (optional)\">\n    </label>\n    <label for=\"date\">\n      This will start\n      <select name=\"date-start\" class=\"gt-date-start\">\n        <option value=\"now\">now</option>\n        <option value=\"future\">in the future</option>\n      </select>\n      and persist\n      <select name=\"date-end\" class=\"gt-date-end\">\n        <option value=\"never\">indefinitely</option>\n        <option value=\"future\">until a future date</option>\n      </select>\n    </label>\n    <a href=\"#\" class=\"gt-button gt-button-blue gt-submit\">Update</a>\n  </form>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel-top-bar\">\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-new-trigger\"></a>\n  <h3>No Geotriggers</h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n\n<div class=\"gt-panel-no-triggers\">\n  <h5>This application doesn't have any Geotriggers yet.</h5>\n   <a href=\"#\" class=\"gt-tool gt-tool-create gt-button gt-button-green\">Create A New Trigger</a>\n</div>\n\n<ul class=\"gt-tool-descriptions\">\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-create\"></span>\n    <h5><a class=\"gt-tool gt-tool-create\"href=\"#\">New Geotrigger Tool</a></h5>\n    <p>Create a new Geotrigger by first entering it's information, than defining an area on the map.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-polygon\"></span>\n    <h5><a class=\"gt-tool gt-tool-polygon\"href=\"#\">Polygon Tool</a></h5>\n    <p>Click to start drawing on the map, creating each point of a polygon. Click on the first point to close the shape and enter the Geotrigger information.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-radius\"></span>\n    <h5><a class=\"gt-tool gt-tool-radius\"href=\"#\">Radius Tool</a></h5>\n    <p>Select a point on the map, than hold and drag to define a radius around that point. You can edit this radius later, if you want.</p>\n  </li>\n\n  <!-- <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-drivetime\"></span>\n    <h5><a class=\"gt-tool gt-tool-drivetime\"href=\"#\">Drivetime Tool</a></h5>\n    <p>Drop a marker on the map, and then enter your desired drive time from that marker. We'll compute that polygon for you.</p>\n  </li> -->\n</ul>\n\n";
  });

this["GeotriggerEditor"]["Templates"]["item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n  <li>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</li>\n  ";
  return buffer;
  }

  buffer += "<span class=\"gt-item-edit gt-icon gt-icon-enter gt-icon-polygon\"></span>\n<h5><a class=\"gt-item-edit\" href=\"#\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Polygon 442 SE 42nd</a></h5>\n<ul class=\"gt-tags\">\n  ";
  stack2 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>\n<ul class=\"gt-item-controls\">\n	<li><a class=\"gt-reset-delete\" href=\"#\">&#x2716;</a></li>\n	<li><a class=\"gt-item-delete gt-button-small\" href=\"#\"></a></li>\n</ul>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-list-header gt-hide\">\n  <div class=\"gt-panel-top-bar\">\n    <h3 class=\"gt-panel-top-bar-left\">List</h3>\n    <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n  </div>\n  <div class=\"gt-search\">\n    <input type=\"search\"></input>\n  </div>\n</div>\n<ul class=\"gt-results\"></ul>";
  });

this["GeotriggerEditor"]["Templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gt-controls-region\"></div>\n<div id=\"gt-drawer-list\" class=\"gt-drawer\"></div>\n<div id=\"gt-drawer-new\" class=\"gt-drawer\"></div>\n<div id=\"gt-map-region\"></div>\n<div id=\"gt-notifications\"></div>";
  });

this["GeotriggerEditor"]["Templates"]["new"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel-top-bar\">\n  <h3 class=\"gt-panel-top-bar-left\">Create</h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n<div class=\"gt-panel-content\">\n  <form>\n    <input type=\"text\" name=\"title\" placeholder=\"Title\" class=\"gt-trigger-title-input\">\n    <span class=\"gt-tag-label\">When a device tagged</span>\n    <input type=\"text\" name=\"tags\" placeholder=\"enter tags\" class=\"gt-tag-input\">\n    <label for=\"event\" class=\"left\">\n      <select name=\"event\" class=\"gt-event\">\n        <option value=\"enter\" selected>enters inside</option>\n        <option value=\"exit\">exits</option>\n      </select>\n      <select name=\"geometry-type\" class=\"gt-geometry-type\">\n        <option value=\"default\" disabled=\"disabled\" selected>select a geometry --</option>\n        <option value=\"polygon\">a polygon</option>\n        <option value=\"radius\">a distance of</option>\n        <!-- <option value=\"drivetime\">a drivetime of</option> -->\n      </select>\n    </label>\n    <select name=\"action\" class=\"gt-action\">\n      <option value=\"message\" selected>send the device a message</option>\n      <option value=\"server\">post to a server</option>\n      <option value=\"log\">log the event</option>\n      <option value=\"profile\">change tracking profile</option>\n    </select>\n    <span>:</span>\n    <label for=\"message\">\n      <textarea name=\"message\" placeholder=\"message\"></textarea>\n    </label>\n    <label for=\"url\">\n      <input type=\"text\" name=\"callback_url\" placeholder=\"url (optional)\">\n    </label>\n    <label for=\"date\">\n      This will start\n      <select name=\"date-start\" class=\"gt-date-start\">\n        <option value=\"now\">now</option>\n        <option value=\"future\">in the future</option>\n      </select>\n      and persist\n      <select name=\"date-end\" class=\"gt-date-end\">\n        <option value=\"never\">indefinitely</option>\n        <option value=\"future\">until a future date</option>\n      </select>\n    </label>\n    <a href=\"#\" class=\"gt-button gt-button-blue gt-submit\">Submit</a>\n  </form>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["notification"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button class=\"gt-close\">&times;</button> ";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  API.addInitializer(function(){
    this.session = new Geotriggers.Session({
      clientId: App.Config.session.clientId, // required or session - this is the application id from developers.arcigs.com
      clientSecret: App.Config.session.clientSecret, // optional - this will authenticate as your application with full permissions
      persistSession: false // optional - will attempt to persist the session and reload it on future page loads
    });
  });

});

GeotriggerEditor.module('Config', function(Config) {

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
      icon: L.icon({
        iconUrl: 'img/blue-dot.png',
        iconRetinaUrl: 'img/blue-dot@2x.png',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
        popupAnchor: [0, 0],
        shadowUrl: null,
        shadowRetinaUrl: null,
        shadowSize: [0, 0],
        shadowAnchor: [0, 0]
      })
    },

    session: {
      clientId: 'rcMNAPBoIn2M1JoI',
      clientSecret: '77edd9c16dde46ad9a93b79c83229887'
    }

  });

});

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

      polygon.addTo(App.map);

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

      circle.addTo(App.map);

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
    // Initialize the FeatureGroup to store editable layers
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


GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

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
    this.notificationCollection = new App.Collections.Notifications();
  };

  _.extend(Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function() {
      this.showMap();
      this.showControls();
      this.setupDrawers(this.triggerCollection);
      this.setupNotifications();

      this.triggerCollection.fetch({ reset: true });

      App.vent.on('trigger:create', this.createTrigger, this);
      App.vent.on('trigger:update', this.updateTrigger, this);
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
      this.drawerLayout = new App.Layouts.Drawer();
      var listView = new App.Views.List({ collection: triggers });
      // var emptyView = new App.Views.Empty();
      // var newView = new App.Views.New();

      // populate list drawer
      App.listDrawerRegion.show(this.drawerLayout);
      this.drawerLayout.listRegion.show(listView);

      // populate new drawer
      // App.newDrawerRegion.show(newView);

      // open list drawer
      App.vent.trigger('controls:list:toggle');
    },

    setupNotifications: function() {
      var noteList = new App.Views.NotificationList({
        collection: this.notificationCollection
      });

      App.notificationsRegion.show(noteList);

      App.vent.on('notifications:new', function(attributes){
        var note = new App.Models.Notification(attributes);
        this.notificationCollection.add(note);
      }, this);
    },

    createTrigger: function(triggerData) {
      this.triggerCollection.create(triggerData);
    },

    updateTrigger: function(triggerData) {
      var model = this.triggerCollection.get(triggerData.triggerId);
      model.set(triggerData);
      model.save();
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

});

GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    zoomToLayer: function(layer) {
      App.map.fitBounds(layer.getBounds(), {
        paddingTopLeft: [App.listDrawerRegion.$el.width(), 0]
      });
    }
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    var el = options.el;

    // L.Icon.Default.imagePath = App.Config.imagePath;
    App.map = L.map(el).setView(App.Config.Map.center, App.Config.Map.zoom);
    App.map.zoomControl.setPosition('topright');
    L.esri.basemapLayer(App.Config.Map.basemap).addTo(App.map);

    this.Draw.start();
  });

});

GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Notification Model
  // ------------------

  Models.Notification = Backbone.Model.extend({

    defaults: {
      'type': 'info',
      'message': 'everything\'s fine'
    }

  });

});

GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    idAttribute: 'triggerId',

    // override sync method to use geotrigger API
    sync: function(method, model, options) {
      console.log('sync:' + method);
      var triggerId = this.get('triggerId');

      function callback(error, response) {
        if (error) {
          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else if (options && options.success) {
          options.success(response);
        }
      }

      switch (method) {
        case 'read':
          App.API.session.request('trigger/list', {
            params: {
              'triggerIds': [triggerId]
            },
            callback: callback
          });
          break;
        case 'create':
          App.API.session.request('trigger/create', {
            params: model.toJSON(),
            callback: callback
          });
          break;
        case 'update':
          App.API.session.request('trigger/update', {
            params: {
              'triggerIds': triggerId,
              'condition': this.get('condition'),
              'action': this.get('action'),
              'setTags': this.get('tags')
            },
            callback: callback
          });
          break;
        case 'delete':
          App.API.session.request('trigger/delete', {
            params: {
              'triggerIds': triggerId
            },
            callback: callback
          });
          break;
      }
    }

  });

});

GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Notifications Collection
  // ------------------------

  Collections.Notifications = Backbone.Collection.extend({
    model: App.Models.Notification
  });

});

GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Trigger Collection
  // ------------------

  Collections.Triggers = Backbone.Collection.extend({
    model: App.Models.Trigger,

    fetch: function(options) {
      App.API.session.request('trigger/list', {
        callback: _.bind(function(error, response) {
          if(options.reset){
            this.reset(this.parse(response));
          } else {
            this.set(this.parse(response));
          }
        }, this)
      });
    },

    parse: function(response) {
      return response.triggers;
    }
  });

});


GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layouts.Drawer = Backbone.Marionette.Layout.extend({
    template: App.Templates['drawer-list'],
    className: 'gt-panel-wrap',

    events: {
      'click .gt-back-to-list' : 'backToList',
      'click .gt-close-drawer' : 'closeDrawer'
    },

    regions: {
      listRegion : '.gt-panel-list',
      editRegion : '.gt-panel-edit'
    },

    initialize: function() {
      this.listenTo(App.vent, 'drawer:list:toggle', this.toggleDrawer);
      this.listenTo(App.vent, 'drawer:list:reset-buttons', this.resetButtons);
      this.listenTo(App.vent, 'drawer:close', this.closeDrawer);
    },

    toggleDrawer: function() {
      this.resetButtons();
      this.$el.parent().toggleClass('gt-open');
    },

    backToList: function(e) {
      e.preventDefault();
      this.$el.removeClass('gt-panel-editing');
    },

    resetButtons: function() {
      this.$el.find('.gt-item-confirm-delete').removeClass('gt-item-confirm-delete');
      this.$el.find('.gt-reset-delete').removeClass('gt-reset-flyout');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      this.$el.parent().removeClass('gt-open');

      App.vent.trigger('controls:restore-shape');
      App.vent.trigger('controls:deactivate', 'list');
    }
  });

});


GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Controls View
  // -------------
  //
  // Displays controls and handles state of drawer and tools.

  Views.Controls = Marionette.ItemView.extend({
    template: App.Templates['controls'],
    className: 'gt-control-group',

    events: {
      'click .gt-tool-list'       : 'toggleList',
      'click .gt-tool-create'     : 'toggleNew',
      'click .gt-tool-polygon'    : 'polygon',
      'click .gt-tool-radius'     : 'radius'
      // 'click .gt-tool-drivetime'  : 'drivetime'
    },

    initialize: function() {
      this.listenTo(App.vent, 'controls:deactivate', this.hideControl);
      this.listenTo(App.vent, 'controls:restore-shape', this.restoreShape);
      this.listenTo(App.vent, 'controls:tools:disable-draw', this.disableDrawTool);
      this.listenTo(App.vent, 'trigger:new', this.showNew);
      this.listenTo(App.vent, 'controls:list:toggle', this.toggleList);
    },

    hideControl: function(name) {
      this.$el.find('.gt-tool-' + name).removeClass('gt-active');
    },

    showControl: function(name) {
      this.$el.find('.gt-tool-' + name).addClass('gt-active');
    },

    toggleControl: function(name) {
      this.$el.find('.gt-tool-' + name).toggleClass('gt-active');
    },

    toggleList: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      App.vent.trigger('drawer:new:close');
      App.vent.trigger('drawer:list:toggle');

      this.toggleControl('list');

      this.restoreShape();
    },

    toggleNew: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      // make sure list drawer is closed
      App.vent.trigger('drawer:close');

      if (!App.newDrawerRegion.currentView || !App.newDrawerRegion.$el.hasClass('gt-open')) {
        var newView = new App.Views.New();
        App.newDrawerRegion.show(newView);
      }

      // toggle active state of new drawer
      App.vent.trigger('drawer:new:toggle');
      App.vent.trigger('drawer:list:reset-buttons');
      this.toggleControl('create');
      this.restoreShape();
    },

    showNew: function() {
      var newView = new App.Views.New({ layer: App.Map.Draw.editLayer });
      App.newDrawerRegion.show(newView);

      // make sure list drawer is closed
      App.vent.trigger('drawer:close');

      // show new drawer
      App.vent.trigger('drawer:new:open');
      this.showControl('create');
      App.vent.trigger('drawer:list:reset-buttons');
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
      App.vent.trigger('map:draw:tool:enable', str);
      this.showControl(str);
      App.vent.trigger('drawer:list:reset-buttons');
    },

    disableDrawTool: function(str) {
      if (str) {
        App.Map.Draw.disableTool(str);
      }
      this.$el.find('.gt-draw-tools .gt-tool').removeClass('gt-active');
    },

    restoreShape: function() {
      if (App.Editor.Controller.drawerLayout.editRegion.currentView) {
        App.Editor.Controller.drawerLayout.editRegion.currentView.restoreShape();
      }
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Edit = Marionette.ItemView.extend({
    template: App.Templates['edit'],
    className: 'gt-edit',

    events: {
      'click .gt-submit': 'parseForm'
    },

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

      App.vent.trigger('trigger:edit', layer);
    },

    restoreShape: function() {
      this.options.item.restoreShape();
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();

      if (data) {
        this.updateTrigger(data);
        App.vent.trigger('controls:list:toggle');
      }
    },

    updateTrigger: function(data) {
      console.log(data);
      var geo;
      var layer = App.Map.Draw.editLayer.getLayers()[0];

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      var trigger = {
        'triggerId': this.model.get('triggerId'),
        'condition': {
          'direction': 'enter',
          'geo': geo
        },
        'action': {
          'notification': {
            'text': 'Welcome to Portland'
          },
          'callbackUrl': 'http://pdx.gov/welcome'
        },
        'setTags': ['newtags']
      };

      App.vent.trigger('trigger:update', trigger);
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger List Item View
  // ----------------------
  //
  // Displays an individual trigger list item, and responds to changes that are made to the trigger.

  Views.ListItem = Marionette.ItemView.extend({
    template: App.Templates['item'],
    tagName: 'li',
    className: 'gt-result',

    events: {
      'click .gt-item-edit'           : 'editItem',
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'change', this.renderShape);
    },

    onShow: function() {
      this.renderShape();
    },

    renderShape: function() {
      if (this.shape) {
        App.Map.Draw.clearShape(this.shape);
        this.shape = null;
      }
      var id = this.model.get('triggerId');
      var geo = this.model.get('condition').geo;
      if (geo.geojson) {
        this.shape = App.Map.Draw.polygon(geo.geojson, id);
      } else {
        this.shape = App.Map.Draw.radius(geo, id);
      }
    },

    restoreShape: function() {
      // should start using App.vent instead of this restoreShape mess
      if (!App.map.hasLayer(this.shape)) {
        App.Map.Draw.clear();
        this.renderShape();
      }
    },

    editItem: function(e) {
      e.preventDefault();
      var editView = new App.Views.Edit({ model: this.model, item: this });
      App.Editor.Controller.drawerLayout.editRegion.show(editView);
      App.Editor.Controller.drawerLayout.$el.addClass('gt-panel-editing');
      App.vent.trigger('drawer:list:reset-buttons');
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
      window.test = this.model;
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
    template: App.Templates['empty'],
    className: 'gt-list-empty',

    events: {
      'click .gt-tool-create': 'newTrigger'
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
    template: App.Templates['list'],
    className: 'gt-list',
    itemView: Views.ListItem,
    itemViewContainer: '.gt-results',
    emptyView: Views.Empty,

    initialize: function() {
      var list = this;
      this.collection.on('change reset add remove', function(){
        if (!list.collection.length) {
          list.$el.find('.gt-list-header').addClass('gt-hide');
        } else {
          list.$el.find('.gt-list-header').removeClass('gt-hide');
        }
      });
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Main View
  // ---------
  //
  // Instantiates the basic structure of the app.

  Views.Main = Marionette.ItemView.extend({
    id: 'gt-regions',
    template: App.Templates['main']
  });

});


GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

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
      App.Map.start({ el: this.el });
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.

  Views.New = Marionette.ItemView.extend({
    template: App.Templates['new'],
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

      this.listenTo(App.vent, 'drawer:new:open', this.openDrawer);
      this.listenTo(App.vent, 'drawer:new:close', this.closeDrawer);
      this.listenTo(App.vent, 'drawer:new:toggle', this.toggle);
    },

    openDrawer: function() {
      this.$el.parent().addClass('gt-open');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      this.$el.parent().removeClass('gt-open');
      App.vent.trigger('controls:deactivate', 'create');
      App.vent.trigger('trigger:new:cancel');
    },

    toggle: function() {
      this.$el.parent().toggleClass('gt-open');
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();

      if (data) {
        this.createTrigger(data);
        App.vent.trigger('controls:list:toggle');
      }
    },

    createTrigger: function(data) {
      console.log(data);
      var geo;
      var layer = App.Map.Draw.editLayer.getLayers()[0];

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      var trigger = {
        // 'triggerId': 'fake-trigger-id',
        'condition': {
          'direction': 'enter',
          'geo': geo
        },
        'action': {
          'notification': {
            'text': 'Welcome to Portland'
          },
          'callbackUrl': 'http://pdx.gov/welcome'
        },
        'setTags': ['newtags']
      };

      App.vent.trigger('trigger:create', trigger);
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Notification View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.Notification = Marionette.ItemView.extend({
    template: App.Templates['notification'],
    className: 'gt-notification',
    tagName: 'li',

    events: {
      'click .gt-close': 'destroyNotification'
    },

    render: function() {
      Marionette.ItemView.prototype.render.apply(this, arguments);
      this.$el.addClass(this.model.get('type'));
    },

    destroyNotification: function() {
      this.model.destroy();
    }
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
