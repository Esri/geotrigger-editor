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
    className: 'gt-new gt-panel',

    events: {
      'change .gt-geometry-type'   : 'startDrawing',
      'change .gt-action-selector' : 'toggleActions',
      'click .gt-submit'           : 'parseForm'
    },

    ui: {
      'actions' : '.gt-action',
      'form'    : 'form'
    },

    onShow: function(options) {
      var layer = App.request('draw:layer');
      // convert layer information into form data if it exists
    },

    startDrawing: function(e) {
      var tool = $(e.target).val();
      App.execute('draw:clear');
      App.execute('draw:enable', tool);
    },

    toggleActions: function(e) {
      var action = $(e.target).val();
      this.ui.actions.hide();
      this.$el.find('.gt-action-' + action).show();
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.ui.form.serializeObject();
      data = App.util.removeEmptyStrings(data);

      if (data.tags) {
        var tags = data.tags;
        tags = tags.split(',');
        for (var i=tags.length-1;i>0;i--) {
          tags[i] = tags[i].trim();
        }
        data.tags = tags;
      }

      if (data) { // @TODO: validate
        this.createTrigger(data);
      }
    },

    createTrigger: function(data) {
      var layer = App.request('draw:layer');

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