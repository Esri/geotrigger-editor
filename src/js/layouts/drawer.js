GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layouts.Drawer = Backbone.Marionette.Layout.extend({
    template: App.Templates['drawer-list'],
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
      this.listenTo(App.vent, 'drawer:list:toggle', this.toggleDrawer);
      this.listenTo(App.vent, 'drawer:list:reset-buttons', this.resetButtons);
      this.listenTo(App.vent, 'drawer:close', this.closeDrawer);
    },

    toggleDrawer: function() {
      this.resetButtons();
      this.$el.parent().toggleClass('gt-open');
      $('#gt-map-region').toggleClass('gt-open-drawer');
      App.map.invalidateSize();
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

      $('#gt-map-region').removeClass('gt-open-drawer');
      App.map.invalidateSize();
    }
  });

});
