// @TODO: investigate handlebars precompilation: http://handlebarsjs.com/precompilation.html

var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addRegions({
  controlsRegion: '#gt-controls-region',
  listDrawerRegion: '.gt-drawer-list',
  newDrawerRegion: '.gt-drawer-new',
  mapRegion: '#gt-map-region'
});

GeotriggerEditor.on('initialize:after', function() {
  Backbone.history.start();
});
