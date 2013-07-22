GTEdit.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layout.Drawer = Backbone.Marionette.Layout.extend({
    template: 'drawer',
    className: 'gt-panel-wrap',

    events: {
      'click .gt-result': 'editItem',
      'click .gt-back-to-list': 'backToList',
      'click .gt-close-drawer': 'closeDrawer'
    },

    regions: {
      list: '.gt-panel-1',
      edit: '.gt-panel-2'
    },

    editItem: function(e) {
      e.preventDefault();
      this.$el.addClass('gt-panel-active');
    },

    backToList: function(e) {
      e.preventDefault();
      this.$el.removeClass('gt-panel-active');
    },

    closeDrawer: function(e) {
      e.preventDefault();
      App.drawerRegion.$el.addClass('closed');
      App.controlsRegion.$el.find('.gt-tool-list').removeClass('active');
    }
  });

});
