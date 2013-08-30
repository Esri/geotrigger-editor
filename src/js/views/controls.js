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
      App.vent.on('controls:tools:disable-draw', this.disableDrawTool, this);
      App.vent.on('trigger:new', this.showNew, this);
      App.vent.on('controls:list:toggle', this.toggleList, this);
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