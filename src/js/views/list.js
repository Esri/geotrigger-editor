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
      // 'click .gt-item-edit'           : 'editItem',
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    ui: {
      'deleteItem' : '.gt-item-delete',
      'confirm'    : '.gt-item-confirm-delete',
      'reset'      : '.gt-reset-delete'
    },

    modelEvents: {
      'change': 'modelChanged'
    },

    onShow: function() {
      // this.renderShape();
    },

    modelChanged: function() {
      this.render();
      // this.renderShape();
    },

    renderShape: function() {
      if (this.shape) {
        App.Map.clearShape(this.shape);
        this.shape = null;
      }
      var id = this.model.get('triggerId');
      var geo = this.model.get('condition').geo;
      if (geo.geojson) {
        this.shape = App.Map.polygon(geo.geojson, id);
      } else {
        this.shape = App.Map.circle(geo, id);
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
      App.vent.trigger('trigger:edit', { model: this.model, item: this });
    },

    confirmDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout');
    },

    resetDelete: function(e) {
      e.preventDefault();
      this.ui.confirm.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout');
    },

    destroyModel: function(e) {
      e.preventDefault();
      // App.Map.clearShape(this.shape);
      App.vent.trigger('trigger:destroy', this.model);
    }
  });

  // Trigger List Empty View
  // ----------------------
  //
  // Displays some helpful information when no triggers are found.

  Views.Empty = Marionette.ItemView.extend({
    template: App.Templates['empty'],
    className: 'gt-list-empty'
  });

  // Trigger List View
  // -----------------
  //
  // Controls the rendering of the list of items.

  Views.List = Marionette.CompositeView.extend({
    template: App.Templates['list'],
    className: 'gt-list gt-panel',
    itemView: Views.ListItem,
    itemViewContainer: '.gt-results',
    emptyView: Views.Empty,

    ui: {
      'header': '.gt-list-header'
    },

    onShow: function() {
      this.headerCheck();
      this.collection.on('change reset add remove', _.bind(this.headerCheck, this));
    },

    headerCheck: function() {
      if (!this.collection.length) {
        this.ui.header.addClass('gt-hide');
      } else {
        this.ui.header.removeClass('gt-hide');
      }
    }
  });

});