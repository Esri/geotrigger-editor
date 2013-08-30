GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layouts.Drawer = Backbone.Marionette.Layout.extend({
    template: 'drawer-list',
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
      App.vent.on('drawer:list:empty', this.hideListHeader, this);
      App.vent.on('drawer:list:item:added', this.showListHeader, this);
      App.vent.on('drawer:list:toggle', this.toggleDrawer, this);
      App.vent.on('drawer:list:reset-buttons', this.resetButtons, this);
      App.vent.on('drawer:close', this.closeDrawer, this);
    },

    hideListHeader: function() {
      this.$el.find('.gt-list-header').addClass('gt-hide');
    },

    showListHeader: function() {
      this.$el.find('.gt-list-header').removeClass('gt-hide');
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
