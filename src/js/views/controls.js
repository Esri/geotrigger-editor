GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

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

    initialize: function() {
      App.vent.on('controls:deactivate', this.hideControl, this);
      App.vent.on('controls:restore-shape', this.restoreShape, this);
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

      // make sure new drawer is closed
      if (App.newDrawerRegion.currentView) {
        App.newDrawerRegion.currentView.closeDrawer();
      }

      // toggle active state of list drawer
      App.vent.trigger('list:toggle');
      this.toggleControl('list');
      App.vent.trigger('list:buttons:reset');
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
      App.vent.trigger('new:toggle');
      this.toggleControl('create');
      App.vent.trigger('list:buttons:reset');
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
      App.vent.trigger('list:buttons:reset');
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
      App.vent.trigger('list:buttons:reset');
    },

    disableDrawTool: function(str) {
      if (str) {
        App.Map.Draw.disableTool(str);
      }
      App.controlsRegion.$el.find('.gt-draw-tools .gt-tool').removeClass('gt-active');
    },

    restoreShape: function() {
      if (App.Editor.Controller.drawerLayout.editRegion.currentView) {
        App.Editor.Controller.drawerLayout.editRegion.currentView.restoreShape();
      }
    }
  });

});