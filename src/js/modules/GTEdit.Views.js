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
      'click .gt-tool-polygon'    : 'polygon',
      'click .gt-tool-radius'     : 'radius',
      'click .gt-tool-drivetime'  : 'drivetime'
    },

    toggleList: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      // make sure new drawer is closed
      App.newDrawerRegion.currentView.closeDrawer();

      // toggle active state of list drawer
      App.listDrawerRegion.$el.toggleClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-list').toggleClass('gt-active');
      this.resetAllDelete();
    },

    toggleNew: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      // make sure list drawer is closed
      App.listDrawerRegion.currentView.closeDrawer();

      // toggle active state of new drawer
      App.newDrawerRegion.$el.toggleClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').toggleClass('gt-active');
      this.resetAllDelete();
    },

    showNew: function(e) {
      // make sure list drawer is closed
      App.listDrawerRegion.currentView.closeDrawer();

      // toggle active state of new drawer
      App.newDrawerRegion.$el.addClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').addClass('gt-active');
      this.resetAllDelete();
    },

    polygon: function(e) {
      e.preventDefault();
      this.enableDrawTool('polygon');
    },

    radius: function(e) {
      e.preventDefault();
      this.enableDrawTool('radius');
    },

    drivetime: function(e) {
      e.preventDefault();
      this.enableDrawTool('drivetime');
    },

    enableDrawTool: function(str) {
      this.disableDrawTool();
      App.Map.Draw.enableTool(str);
      App.controlsRegion.$el.find('.gt-tool-' + str).addClass('gt-active');
      this.resetAllDelete();
    },

    disableDrawTool: function(str) {
      if (str) {
        App.Map.Draw.disableTool(str);
      }
      App.controlsRegion.$el.find('.gt-draw-tools .gt-tool').removeClass('gt-active');
    },

    resetAllDelete: function(e) {
      App.Editor.Controller.drawerLayout.$el.find('.gt-item-confirm-delete').removeClass("gt-item-confirm-delete");
      App.Editor.Controller.drawerLayout.$el.find('.gt-reset-delete').removeClass('gt-reset-flyout');
    }
  });

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

    onShow: function() {
      App.listDrawerRegion.$el.find('.gt-list-header').removeClass('gt-hide');
    },

    editItem: function(e) {
      e.preventDefault();
      var editView = new App.Views.Edit({ model: this.model });
      App.Editor.Controller.drawerLayout.editRegion.show(editView);
      App.Editor.Controller.drawerLayout.$el.addClass('gt-panel-editing');
      App.Editor.Controller.controlsView.resetAllDelete();
    },

    confirmDelete: function(e) {
      e.preventDefault();
      console.log("confirm delete");
      console.log(e.currentTarget);
      this.$el.find('.gt-item-delete').addClass("gt-item-confirm-delete");
      this.$el.find('.gt-reset-delete').addClass('gt-reset-flyout');
    },
    // use conrim delete to flyout reset delete button

    resetDelete: function(e) {
      e.preventDefault();
      console.log("reset delete");
      this.$el.find('.gt-item-confirm-delete').removeClass("gt-item-confirm-delete");
      this.$el.find('.gt-reset-delete').removeClass('gt-reset-flyout');
    },

    destroyModel: function(e) {
      e.preventDefault();
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

    onShow: function() {
      App.listDrawerRegion.$el.find('.gt-list-header').addClass('gt-hide');
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
    className: 'gt-new gt-panel-wrap',

    events: {
      'click .gt-close-drawer': 'closeDrawer'
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      App.Map.Draw.clear();
      App.newDrawerRegion.$el.removeClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').removeClass('gt-active');
    }
  });

  // Map Item View
  // -------------
  //
  // Manages the esri-leaflet map.

  Views.Map = Marionette.ItemView.extend({
    id: 'gt-map',

    render: function() {
      this.isClosed = false;

      this.triggerMethod("before:render", this);
      this.triggerMethod("item:before:render", this);

      this.triggerMethod("render", this);
      this.triggerMethod("item:rendered", this);

      return this;
    },

    onShow: function() {
      App.Map.init(this.el);
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