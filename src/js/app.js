this.Geotrigger = this.Geotrigger || {};
this.Geotrigger.Editor = new Backbone.Marionette.Application();

Geotrigger.Editor.addInitializer(function (options) {
  this.Config.start(options);
  this.API.start();
  this.regions = new this.Layouts.Main();
  this.addRegions({
    mainRegion: this.config.el
  });
  this.mainRegion.show(this.regions);
});
