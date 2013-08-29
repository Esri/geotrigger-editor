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
      App.vent.on('new:toggle', this.toggle, this);
      if (typeof options !== 'undefined' && options.layer) {
        App.Map.zoomToLayer(options.layer);
        // then convert layer information into something the form can display
      }
    },

    toggle: function() {
      this.$el.parent().toggleClass('gt-open');
    },

    closeDrawer: function(e) {
      if (typeof e !== 'undefined' && e.preventDefault) {
        e.preventDefault();
      }

      App.Map.Draw.clear();
      App.newDrawerRegion.$el.removeClass('gt-open');
      App.controlsRegion.$el.find('.gt-tool-create').removeClass('gt-active');
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();
      // console.log(data);
      if (data) {
        this.createTrigger(data);
        App.Editor.Controller.controlsView.toggleList();
      }
    },

    createTrigger: function(data) {
      var newLayer = App.Map.Draw.editLayer.getLayers()[0];
      var dummydata = {
        "condition": {
          "direction": "enter",
          "geo": {
            "geojson": newLayer.toGeoJSON()
          }
        },
        "action": {
          "message": "Welcome to Portland - The Mayor",
          "callback": "http://pdx.gov/welcome"
        },
        "tags": ["newtags"]
      };

      App.Map.Draw.clear();
      App.Editor.Controller.triggerCollection.add(new App.Models.Trigger(dummydata));
    }
  });

});