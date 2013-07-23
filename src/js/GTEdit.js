// http://handlebarsjs.com/precompilation.html

var GTEdit = new Backbone.Marionette.Application();

GTEdit.addRegions({
  controlsRegion: '#gt-controls',
  listDrawerRegion: '.gt-drawer-list',
  newDrawerRegion: '.gt-drawer-new',
  mapRegion: '#gt-map-wrap'
});

GTEdit.on('initialize:after', function() {
  Backbone.history.start();
});
