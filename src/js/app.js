var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  this.Config.start(options);
  this.API.start();
  this.regions = new this.Layouts.Main();
  this.addRegions({ mainRegion: this.config.el });
  this.mainRegion.show(this.regions);
});
