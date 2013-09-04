GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Edit = Marionette.ItemView.extend({
    template: App.Templates['edit'],
    className: 'gt-edit',

    events: {
      'click .gt-submit': 'parseForm'
    },

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
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();

      if (data) {
        this.updateTrigger(data);
        App.vent.trigger('controls:list:toggle');
      }
    },

    updateTrigger: function(data) {
      console.log(data);
      var geo;
      var layer = App.Map.Draw.editLayer.getLayers()[0];

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      var trigger = {
        'triggerId': this.model.get('triggerId'),
        'condition': {
          'direction': 'enter',
          'geo': geo
        },
        'action': {
          'notification': {
            'text': 'Welcome to Portland'
          },
          'callbackUrl': 'http://pdx.gov/welcome'
        },
        'setTags': ['newtags']
      };

      App.vent.trigger('trigger:update', trigger);
    }
  });

});