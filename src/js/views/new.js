GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.
  //
  // @TODO: merge with edit view as behavior is near-identical
  //        (or come up with inheritance scheme)

  Views.New = Marionette.ItemView.extend({
    template: App.Templates['new'],
    className: 'gt-new gt-panel-wrap',

    events: {
      'click .gt-close-drawer': 'closeDrawer',
      'change .gt-geometry-type': 'startDrawing',
      'change .gt-action-selector': 'toggleActions',
      'click .gt-submit': 'parseForm'
    },

    initialize: function(options) {
      var editLayer = App.Map.Draw.editLayer;
      if (editLayer.getLayers().length) {
        App.Map.zoomToLayer(editLayer);
        // then convert layer information into something the form can display
      }

      this.listenTo(App.vent, 'drawer:new:open', this.openDrawer);
      this.listenTo(App.vent, 'drawer:new:close', this.closeDrawer);
      this.listenTo(App.vent, 'drawer:new:toggle', this.toggle);
    },

    /* start: to be deleted (show/hide should be handled by parent) */

    openDrawer: function() {
      this.$el.parent().addClass('gt-open');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      this.$el.parent().removeClass('gt-open');
      App.vent.trigger('controls:deactivate', 'create');
      App.vent.trigger('trigger:new:cancel');
    },

    toggle: function() {
      this.$el.parent().toggleClass('gt-open');
    },

    /* end: to be deleted */

    startDrawing: function (e) {
      var tool = $(e.target).val();
      App.Map.Draw.clear();
      App.Map.Draw.enableTool(tool);
    },

    toggleActions: function(e) {
      var action = $(e.target).val();
      this.$el.find('.gt-action').hide();
      this.$el.find('.gt-action-'+action).show();
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();
      data = App.util.removeEmptyStrings(data);

      if (data) { // @TODO: validate
        this.createTrigger(data);
        App.vent.trigger('controls:list:toggle');
      }
    },

    createTrigger: function(data) {
      console.log(data);
      var geo;
      var layer = App.Map.Draw.editLayer.getLayers()[0];

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        data.condition.geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        data.condition.geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      App.vent.trigger('trigger:create', data);
    }
  });

});