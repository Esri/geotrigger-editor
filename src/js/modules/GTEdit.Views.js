GTEdit.module('Views', function(Views, App, Backbone, Marionette, $, _) {

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
      App.Editor.Controller.triggerCollection.add(new App.Triggers.Model(dummydata));
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

  // Application Event Handlers
  // --------------------------
  //
  // Handler for filtering the list of items by showing and
  // hiding through the use of various CSS classes

  // App.vent.on('item:event', function(eventData) {
  //   // event handler logic
  // });

});