var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  var el = options && options.el ? options.el : '#gt-editor';
  var layout = this.regions = new this.Layouts.Main();

  this.addRegions({ mainRegion: el });
  this.mainRegion.show(layout);
});

GeotriggerEditor.on('initialize:after', function() {
  Backbone.history.start();
});
