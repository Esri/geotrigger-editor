// @TODO: investigate handlebars precompilation: http://handlebarsjs.com/precompilation.html

var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  var el = options && options.el ? options.el : '#gt-editor';
  var mainView = new this.Views.Main();

  this.addRegions({ mainRegion: el });
  this.mainRegion.show(mainView);
  this.addRegions({
    controlsRegion: '#gt-controls-region',
    listDrawerRegion: '#gt-drawer-list',
    newDrawerRegion: '#gt-drawer-new',
    mapRegion: '#gt-map-region',
    notificationsRegion: '#gt-notifications'
  });
});

GeotriggerEditor.on('initialize:after', function() {
  Backbone.history.start();
});
