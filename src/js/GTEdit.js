// http://handlebarsjs.com/precompilation.html

var GTEdit = new Backbone.Marionette.Application();

GTEdit.addRegions({
  controlsRegion: '#gt-controls-region',
  listDrawerRegion: '.gt-drawer-list',
  newDrawerRegion: '.gt-drawer-new',
  mapRegion: '#gt-map-region'
});

GTEdit.on('initialize:after', function() {
  Backbone.history.start();
});
