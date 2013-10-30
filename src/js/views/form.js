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

      // form events
      'click .gt-add-title'           : 'addTitle',
      'click .gt-remove-title'        : 'removeTitle',

      'click .gt-add-action'          : 'addAction',
      'click .gt-remove-action'       : 'removeAction',

      'click .gt-add-notification'    : 'addNotification',
      'click .gt-remove-notification' : 'removeNotification',

      // submit events
      'click .gt-submit'              : 'parseForm',

      // delete events
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    ui: {
      'actions'         : '.gt-actions',
      'addAction'       : '.gt-add-action',
      'form'            : 'form',
      'deleteItem'      : '.gt-item-delete',
      'confirm'         : '.gt-item-confirm-delete',
      'reset'           : '.gt-reset-delete'
    },

    onShow: function() {
      this.buildForm();

      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    buildForm: function() {
      if (!this.model) {
        this.buildNewForm();
      } else {
        this.buildEditForm();
      }
    },

    buildNewForm: function() {
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // get shape from map
      this.parseShape();

      // add default action (notification.text)
      actionsHtml = App.Templates['form/actions/notification/index'](data);
      noteHtml = App.Templates['form/actions/notification/text'](data);

      this.ui.actions.html(actionsHtml);
      this.ui.actions.find('.gt-notification-actions').html(noteHtml);

      this.$el.find('.gt-add-action[data-action="notification"]').hide();
      this.$el.find('.gt-add-notification[data-notification="text"]').hide();
    },

    buildEditForm: function() {
      var currentActions = this.model.get('action');
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      var prop;

      // build actions:

      // notification
      if (currentActions.hasOwnProperty('notification')) {
        actionsHtml += App.Templates['form/actions/notification/index'](data);
        this.$el.find('.gt-add-action[data-action="notification"]').hide();

        for (prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
          }
        }
      }

      // callback URL
      if (currentActions.hasOwnProperty('callbackUrl')) {
        actionsHtml += App.Templates['form/actions/callbackUrl'](data);
        this.$el.find('.gt-add-action[data-action="callbackUrl"]').hide();
      }

      // tracking profile
      if (currentActions.hasOwnProperty('trackingProfile')) {
        actionsHtml += App.Templates['form/actions/trackingProfile'](data);
        this.$el.find('.gt-add-action[data-action="trackingProfile"]').hide();
      }

      this.ui.actions.html(actionsHtml);

      if (noteHtml !== '') {
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);
        // panic
        for (prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            var $notification = this.$el.find('.gt-add-notification[data-notification="' + prop + '"]');
            $notification.hide();
          }
        }
      }
    },

    addTitle: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      $(e.target).addClass('gt-hide');
      this.$el.find('.gt-title').removeClass('gt-hide');
    },

    removeTitle: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      $(e.target).closest('.gt-property').addClass('gt-hide');
      this.$el.find('input[name="properties[title]"]').val('');
      this.$el.find('.gt-add-title').removeClass('gt-hide');
    },

    addAction: function(e) {
      var $el, action;

      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target);
        action = $el.data('action');
      } else if (typeof e === 'string') {
        action = e;
        $el = this.$el.find(".gt-add-action[data-action='" + action + "']");
      }

      if (action === 'notification') {
        this.ui.actions.append(App.Templates['form/actions/notification/index']({}));
        this.ui.actions.find('.gt-notification-actions').html(App.Templates['form/actions/notification/text']({}));
        this.$el.find('.gt-add-notification[data-notification="text"]').hide();
      } else {
        this.ui.actions.append(App.Templates['form/actions/' + action]({}));
      }

      $el.hide();
    },

    removeAction: function(e) {
      var $el, action;

      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target).closest('.gt-property');
        action = $el.data('action');
      } else if (typeof e === 'string') {
        action = e;
        $el = this.$el.find(".gt-property[data-action='" + action + "']");
      }

      $el.remove();

      this.$el.find('.gt-add-action[data-action="' + action + '"]').show();
    },

    addNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target);
      var notification = $el.data('notification');

      this.ui.actions.find('.gt-notification-actions').append(App.Templates['form/actions/notification/' + notification]({}));

      $el.hide();
    },

    removeNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).closest('.gt-notification-action');
      var notification = $el.data('notification');

      $el.remove();

      this.$el.find('.gt-add-notification[data-notification="' + notification + '"]').show();
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

      if (data.tags) {
        var tags = data.tags;
        tags = tags.split(',');
        for (var i=tags.length-1;i>0;i--) {
          tags[i] = tags[i].trim();
        }
        data.tags = tags;
      } else {
        // at least one tag required
      }

      if (data.condition && data.condition.geo) {

      } else {
        // condition and condition.geo required
      }

      if (data.action) {
        // tracking profile
        if (!data.action.trackingProfile ||
            data.action.trackingProfile === '---') {
          data.action.trackingProfile = null;
        }

        // callback URL
        if (!data.action.callbackUrl) {
          data.action.callbackUrl = null;
        }
      } else {
        // at least one action required
      }

      if (data && data.tags && data.condition && data.action) {
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