GTEdit.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // Layout Map View
  // ---------------

  Layout.Map = Backbone.Marionette.Layout.extend({
    template: '#template-gt-map',

    ui: {},

    events: {},

    initialize : function() {
      console.log('Layout.Map initialize');
    },

    onRender: function() {
      console.log('Layout.Map onRender');
    }
  });

  // Layout Controls View
  // --------------------

  Layout.Controls = Backbone.Marionette.Layout.extend({
    template: '#template-gt-controls',

    ui: {
      tools: '.gt-draw-tool'
    },

    events: {
      'click .gt-draw-tool': 'switchDrawTool'
    },

    initialize : function() {
      console.log('Layout.Controls initialize');
    },

    onRender: function() {
      console.log('Layout.Controls onRender');
    },

    switchDrawlTool: function(e) {
      // switch active draw tool based on click target
      console.log(e.target);
    }
  });

  // Layout Panel View
  // -----------------

  Layout.Panel = Backbone.Marionette.ItemView.extend({
    template: '#template-gt-panel',

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {
      input: '#gt-new',
      search: '#gt-search'
    },

    events : {
      'click #gt-new': 'showNewTriggerForm',
      'keypress #gt-search': 'onSearchKeypress'
    },

    showNewTriggerForm: function(e) {
      // show new trigger form
    },

    onSearchKeypress: function(e) {
      var ENTER_KEY = 13;
      var text = this.ui.search.val().trim();

      if ( e.which === ENTER_KEY && text ) {
        this.searchTriggers(text);
      }
    },

    searchTriggers: function(text) {
      // perform search using text as query parameter for tags or locations
    }
  });

});
