// http://handlebarsjs.com/precompilation.html

var GTEdit = new Backbone.Marionette.Application();

GTEdit.addRegions({
  controls: '#gt-controls',
  drawer: '#gt-drawer',
  map: '#gt-map'
});

GTEdit.on('initialize:after', function() {
  Backbone.history.start();
});
