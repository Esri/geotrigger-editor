// http://handlebarsjs.com/precompilation.html

var GTEdit = new Backbone.Marionette.Application();

GTEdit.addRegions({
  main: '#gt-panel',
  controls: '#gt-controls',
  map: '#gt-map'
});

GTEdit.on('initialize:after', function() {
  Backbone.history.start();
});
