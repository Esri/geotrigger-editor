GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layouts.Main = Backbone.Marionette.Layout.extend({
    template: App.Templates['main'],
    id: 'gt-regions',

    regions: {
      'controls' : '#gt-controls-region',
      'drawer'   : '#gt-drawer-region',
      'map'      : '#gt-map-region',
      'notes'    : '#gt-notes-region'
    }
  });

});
