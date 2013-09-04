GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Map Item View
  // -------------
  //
  // Manages the esri-leaflet map.

  Views.Map = Marionette.ItemView.extend({
    id: 'gt-map',

    render: function() {
      this.isClosed = false;

      this.triggerMethod('before:render', this);
      this.triggerMethod('item:before:render', this);

      this.triggerMethod('render', this);
      this.triggerMethod('item:rendered', this);

      return this;
    },

    onShow: function() {
      App.Map.start({ el: this.el });
    }
  });

});