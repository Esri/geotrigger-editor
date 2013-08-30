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

      App.vent.on('drawer:new:open', this.openDrawer, this);
      App.vent.on('drawer:new:close', this.closeDrawer, this);
      App.vent.on('drawer:new:toggle', this.toggle, this);
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
      App.vent.trigger('map:draw:clear');
    },

    toggle: function() {
      this.$el.parent().toggleClass('gt-open');
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.$el.find('form').serializeObject();
      // console.log(data);
      if (data) {
        this.createTrigger(data);
        App.vent.trigger('controls:list:toggle');
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

      App.vent.trigger('map:draw:clear');
      App.vent.trigger('trigger:create', dummydata);
    }
  });

});