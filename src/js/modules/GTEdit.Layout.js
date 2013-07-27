GTEdit.module('Layout', function(Layout, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layout.Drawer = Backbone.Marionette.Layout.extend({
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

    backToList: function(e) {
      e.preventDefault();
      this.$el.removeClass('gt-panel-editing');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }
      App.Editor.Controller.controlsView.restoreShape();
      App.listDrawerRegion.$el.removeClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-list').removeClass('gt-active');
    }
  });

});
