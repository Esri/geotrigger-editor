GTEdit.module('Views', function(Views, App, Backbone, Marionette, $, _) {

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
      'click .gt-tool-polygon'    : 'togglePolygon',
      'click .gt-tool-distance'   : 'toggleDistance',
      'click .gt-tool-drivetime'  : 'toggleDrivetime'
    },

    toggleList: function(e) {
      e.preventDefault();

      // make sure new drawer is closed
      App.newDrawerRegion.currentView.closeDrawer();

      // toggle active state of list drawer
      App.listDrawerRegion.$el.toggleClass('open');
      App.controlsRegion.$el.find('.gt-tool-list').toggleClass('active');
    },

    toggleNew: function(e) {
      e.preventDefault();

      // make sure list drawer is closed
      App.listDrawerRegion.currentView.closeDrawer();

      // toggle active state of new drawer
      App.newDrawerRegion.$el.toggleClass('open');
      App.controlsRegion.$el.find('.gt-tool-create').toggleClass('active');
    },

    togglePolygon: function(e) {
      e.preventDefault();
      console.log('toggle polygon tool');
    },

    toggleDistance: function(e) {
      e.preventDefault();
      console.log('toggle distance tool');
    },

    toggleDrivetime: function(e) {
      e.preventDefault();
      console.log('toggle drivetime tool');
    },
  });

  // Trigger List View
  // -----------------
  //
  // Controls the rendering of the list of items, including the
  // filtering of activs vs completed items for display.

  Views.List = Backbone.Marionette.CompositeView.extend({
    template: 'list',
    className: 'gt-list',
    itemView: Views.ListItem,
    itemViewContainer: '.gt-result'
  });

  // Trigger List Item View
  // ----------------------
  //
  // Displays an individual trigger list item, and responds to changes that are made to the trigger.

  Views.ListItem = Marionette.ItemView.extend({
    template: 'item',
    tagName: 'li',
    className: 'gt-result'
  });

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Edit = Marionette.ItemView.extend({
    template: 'edit',
    className: 'gt-edit'
  });

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.

  Views.New = Marionette.ItemView.extend({
    template: 'new',
    className: 'gt-panel gt-new',

    events: {
      'click .gt-close-drawer': 'closeDrawer'
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      App.newDrawerRegion.$el.removeClass('open');
      App.controlsRegion.$el.find('.gt-tool-create').removeClass('active');
    }
  });

  // Map Item View
  // -------------
  //
  // Manages the esri-leaflet map.

  Views.Map = Marionette.ItemView.extend({
    template: 'map',
    id: 'gt-map',

    onShow: function() {
      var map = L.map(this.el).setView([37.75,-122.45], 12);
      map.zoomControl.setPosition('topright');
      L.esri.basemapLayer("Topographic").addTo(map);

      // Initialize the FeatureGroup to store editable layers
      var drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Control Options
      var controlOptions = {
          position: 'topright',
          draw: {
              polyline: false,
              polygon: {
                  allowIntersection: false, // Restricts shapes to simple polygons
                  drawError: {
                      //color: '#e1e100', // Color the shape will turn when intersects
                      //message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                  },
                  shapeOptions: {
                      color: '#bada55'
                  }
              },
              //circle: false, // Turns off this drawing tool
              rectangle: false
          },
          edit: {
              featureGroup: drawnItems //REQUIRED!!
              //remove: false
          }
      };

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      var drawControl = new L.Control.Draw(controlOptions);
      map.addControl(drawControl);
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

});