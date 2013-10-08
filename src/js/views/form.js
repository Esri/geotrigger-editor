GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Form View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Form = Marionette.ItemView.extend({
    template: App.Templates['form/index'],
    className: 'gt-panel',

    events: {
      // edit events
      'change .gt-geometry-type'      : 'startDrawing',
      'change .gt-action-selector'    : 'toggleActions',
      'change .gt-add-action'         : 'addAction',

      // submit events
      'click .gt-submit'              : 'parseForm',

      // delete events
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    ui: {
      'actions'    : '.gt-action',
      'form'       : 'form',
      'deleteItem' : '.gt-item-delete',
      'confirm'    : '.gt-item-confirm-delete',
      'reset'      : '.gt-reset-delete'
    },

    onShow: function() {
      if (!this.model) {
        this.parseShape();
      }
      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    startDrawing: function (e) {
      var tool = $(e.target).val();
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

    addAction: function(e) {
      e.preventDefault();
      console.log('add action');
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
        this.createOrUpdateTrigger(data);
      }
    },

    createOrUpdateTrigger: function(data) {
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

      if (!this.model) {
        App.vent.trigger('trigger:create', data);
      } else {
        data.triggerId = this.model.get('triggerId');
        App.vent.trigger('trigger:update', data);
      }
    },

    confirmDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout-right');
    },

    resetDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout-right');
    },

    destroyModel: function(e) {
      e.preventDefault();
      App.vent.trigger('trigger:destroy', this.model);
    }
  });

});