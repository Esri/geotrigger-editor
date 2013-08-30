GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Edit = Marionette.ItemView.extend({
    template: 'edit',
    className: 'gt-edit',

    onShow: function() {
      var item = this.options.item;
      var layer;
      if (item.shape.getLayers) {
        layer = item.shape.getLayers()[0];
      } else if (item.shape.editing) {
        layer = item.shape;
      } else {
        throw new Error('Unknown Layer Error');
      }

      App.vent.trigger('trigger:edit', layer);
    },

    restoreShape: function() {
      this.options.item.restoreShape();
    }
  });

});