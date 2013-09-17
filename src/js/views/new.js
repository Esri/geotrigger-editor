GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.
  //
  // @TODO: merge with edit view as behavior is near-identical
  //        (or come up with inheritance scheme)

  Views.New = Marionette.ItemView.extend({
    template: App.Templates['form'],
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
      this.parseShape();
      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    startDrawing: function(e) {
      var tool = $(e.target).val();
      // App.execute('draw:clear');
      App.vent.trigger('draw:enable', tool);
      // @TODO: radius input
      // if (tool === 'radius') {
      //   this.ui.form.find('[name="radius"]').show();
      // } else {
      //   this.ui.form.find('[name="radius"]').hide();
      // }
    },

    toggleActions: function(e) {
      var action = $(e.target).val();
      this.ui.actions.hide();
      this.$el.find('.gt-action-' + action).show();
    },

    parseShape: function() {
      var layer = App.request('draw:layer');
      window.layer = layer;
      var direction = this.ui.form.find('[name="condition[direction]"]');
      var geometry = this.ui.form.find('[name="geometry-type"]');
      // var radius = this.ui.form.find('[name="radius"]'); // @TODO: radius
      switch (true) {
        case (layer instanceof L.Polygon):
          if (direction.val() === null) {
            direction.val('enter');
          }
          geometry.val('polygon');
          break;
        case (layer instanceof L.Circle):
          if (direction.val() === null) {
            direction.val('enter');
          }
          geometry.val('radius');
          // radius.show().val(Math.round(layer.getRadius())); // @TODO: radius
          break;
      }
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.ui.form.serializeObject();
      data = App.util.removeEmptyStrings(data);

      if (data.action &&
          data.action.trackingProfile &&
          data.action.trackingProfile === '---') {
        delete data.action.trackingProfile;
      }

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