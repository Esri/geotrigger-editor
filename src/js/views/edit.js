GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.
  //
  // @TODO: decouple shape from view (get rid of `restoreShape`)

  Views.Edit = Marionette.ItemView.extend({
    template: App.Templates['edit'],
    className: 'gt-edit gt-panel',

    events: {
      'change .gt-geometry-type': 'startDrawing',
      'change .gt-action-selector': 'toggleActions',
      'click .gt-submit': 'parseForm'
    },

    ui: {
      'actions': '.gt-action',
      'form': 'form'
    },

    onShow: function() {
      var item = this.options.item;
      var layer;

      if (item && item.shape) {

        if (item.shape.getLayers) {
          layer = item.shape.getLayers()[0];
        } else if (item.shape.editing) {
          layer = item.shape;
        }

        App.vent.trigger('trigger:edit', layer);

      } else {
        throw new Error('Layer Missing');
      }
    },

    restoreShape: function() {
      this.options.item.restoreShape();
    },

    startDrawing: function (e) {
      var tool = $(e.target).val();
      App.Map.Draw.clear();
      App.Map.Draw.enableTool(tool);
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
        this.updateTrigger(data);
      }
    },

    updateTrigger: function(data) {
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

      data.triggerId = this.model.get('triggerId');

      App.vent.trigger('trigger:update', data);
    }
  });

});