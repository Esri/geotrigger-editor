GTEdit.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // Layout Map View
  // ---------------

  Layout.Map = Backbone.Marionette.Layout.extend({
    template: 'map',

    ui: {},

    events: {},

    initialize: function() {
      console.log('Layout.Map initialize');
    },

    onRender: function() {
      console.log('Layout.Map onRender');
    }
  });

  // Layout Controls View
  // --------------------

  Layout.Controls = Backbone.Marionette.Layout.extend({
    template: 'controls',

    ui: {
      tools: '.gt-draw-tool'
    },

    events: {
      'click .gt-tool-list': 'toggleList'
    },

    initialize: function() {
      console.log('Layout.Controls initialize');
    },

    onRender: function() {
      console.log('Layout.Controls onRender');
    },

    toggleList: function(e) {
      // switch active draw tool based on click target
      App.drawer.$el.toggleClass('closed');
      App.controls.$el.find('.gt-tool-list').toggleClass('active');
    }
  });

  // Layout Drawer View
  // ------------------

  Layout.Drawer = Backbone.Marionette.ItemView.extend({
    template: 'list-panel',

    events: {
      'click .gt-close-drawer': 'onCloseClick'
    },

    initialize: function() {
      console.log('Layout.Drawer initialize');
    },

    onRender: function() {
      console.log('Layout.Drawer onRender');
    },

    onCloseClick: function(e) {
      e.preventDefault();
      App.drawer.$el.addClass('closed');
    }
  });

});
