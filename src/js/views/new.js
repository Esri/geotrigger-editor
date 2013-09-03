GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.

  Views.New = Marionette.ItemView.extend({
    template: 'new',
    className: 'gt-new gt-panel-wrap',

    events: {
      'click .gt-close-drawer': 'closeDrawer',
      'click .gt-submit': 'parseForm'
    },

    initialize: function(options) {
      if (typeof options !== 'undefined' && options.layer) {
        App.Map.zoomToLayer(options.layer);
        // then convert layer information into something the form can display
      }

      this.listenTo(App.vent, 'drawer:new:open', this.openDrawer);
      this.listenTo(App.vent, 'drawer:new:close', this.closeDrawer);
      this.listenTo(App.vent, 'drawer:new:toggle', this.toggle);
    },

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

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();
      //console.log(data);
      if (data) {
        this.createTrigger(data);
        App.vent.trigger('controls:list:toggle');
      }
    },

    createTrigger: function(data) {
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

      var dummydata = {
        'triggerId': 'fake-trigger-id',
        'condition': {
          'direction': 'enter',
          'geo': geo
        },
        'action': {
          'message': 'Welcome to Portland - The Mayor',
          'callback': 'http://pdx.gov/welcome'
        },
        'tags': ['newtags']
      };

      App.vent.trigger('trigger:create', dummydata);
    }
  });

});