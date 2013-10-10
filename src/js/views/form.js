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

    // supported actions
    actions: [
      'callbackUrl',
      'notification',
      'trackingProfile'
    ],

    // supported notifications
    notifications: [
      'text',
      'url',
      'sound',
      'data',
      'icon'
    ],

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

      this.actions = _.without(this.actions, 'notification');
      this.notifications = _.without(this.notifications, 'text');

      this.ui.actions.html(actionsHtml);
      this.ui.actions.find('.gt-notification-actions').html(noteHtml);
    },

    buildEditForm: function() {
      var currentActions = this.model.get('action');
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // notification
      if (currentActions.hasOwnProperty('notification')) {
        actionsHtml += App.Templates['form/actions/notification/index'](data);
        this.actions = _.without(this.actions, 'notification');

        for (var prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
            this.notifications = _.without(this.notifications, prop);
          }
        }
      }

      // callback
      if (currentActions.hasOwnProperty('callbackUrl')) {
        actionsHtml += App.Templates['form/actions/callbackUrl'](data);
        this.actions = _.without(this.actions, 'callbackUrl');
      }

      // tracking profile
      if (currentActions.hasOwnProperty('trackingProfile')) {
        actionsHtml += App.Templates['form/actions/trackingProfile'](data);
        this.actions = _.without(this.actions, 'trackingProfile');
      }

      this.ui.actions.html(actionsHtml);

      if (this.actions.length === 0) {
        this.ui.addAction.hide();
      }

      if (noteHtml !== '') {
        console.log('hey');
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);
      }

      if (this.notifications.length === 0) {
        this.ui.actions.find('.gt-add-notification').hide();
      }
    },

    addAction: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var action = this.actions.pop();

      if (action === 'notification') {
        this.ui.actions.append(App.Templates['form/actions/notification/index']({}));
        this.ui.actions.find('.gt-notification-actions').html(App.Templates['form/actions/notification/text']({}));
        this.notifications = _.without(this.notifications, 'text');
      } else {
        this.ui.actions.append(App.Templates['form/actions/' + action]({}));
      }

      if (this.actions.length === 0) {
        this.ui.addAction.hide();
      }
    },

    removeAction: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).parent();
      var type = $el.data('action-type');

      $el.remove();

      this.actions.push(type);

      if (type === 'notification') {
        this.notifications = [
          'text',
          'url',
          'sound',
          'data',
          'icon'
        ];
      }

      this.ui.addAction.show();
    },

    addNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      this.ui.actions.find('.gt-notification-actions').append(App.Templates['form/actions/notification/' + this.notifications.pop()]({}));

      if (this.notifications.length === 0) {
        this.ui.actions.find('.gt-add-notification').hide();
      }
    },

    removeNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).parent();
      var type = $el.data('notification-type');

      console.log($el);

      $el.remove();

      this.notifications.push(type);
      this.ui.actions.find('.gt-add-notification').show();
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