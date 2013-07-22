GTEdit.module('Editor.Views', function(Views, App, Backbone, Marionette, $, _) {

  // Controls View
  // -------------
  //
  // Display controls and handle state of drawer and tools.

  Views.ControlsView = Marionette.ItemView.extend({
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
      App.drawer.$el.toggleClass('closed');
      App.controls.$el.find('.gt-tool-list').toggleClass('active');
    },

    toggleNew: function(e) {
      e.preventDefault();
      console.log('toggle new trigger form');
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

  // Trigger Item View
  // -----------------
  //
  // Display an individual trigger list item, and respond to changes that are made to the trigger.

  Views.ItemView = Marionette.ItemView.extend({
    template: 'item',
    tagName: 'li',
    className: 'gt-result'
  });

  // Item List View
  // --------------
  //
  // Controls the rendering of the list of items, including the
  // filtering of activs vs completed items for display.

  Views.ListView = Backbone.Marionette.CompositeView.extend({
    template: 'list',
    className: 'gt-list',
    itemView: Views.ItemView,
    itemViewContainer: '.gt-result'
  });


  // Trigger Item View
  // -----------------
  //
  // Display an individual trigger item, and respond to changes that are made to the trigger.

  Views.EditView = Marionette.ItemView.extend({
    template: 'edit',
    className: 'gt-edit'
  });

  // Map Item View
  // -------------
  //
  // Manages the esri-leaflet map.

  Views.MapView = Marionette.ItemView.extend({
    template: 'map',
    id: 'gt-map',

    onShow: function() {
      var map = L.map(this.el).setView([37.75,-122.45], 12);
      map.zoomControl.setPosition('topright');
      L.esri.basemapLayer("Topographic").addTo(map);
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