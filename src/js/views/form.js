Geotrigger.Editor.module('Views', function (Views, App, Backbone, Marionette, $, _) {

  // Trigger Form View
  // -----------------
  //
  // handles both new and edit views for triggers
  // (new) builds a blank form for a new trigger
  // (edit) populates the form with a preexisting trigger
  // builds, validates, and submits trigger object to the API

  Views.Form = Marionette.ItemView.extend({
    template: App.Templates['form/index'],
    className: 'gt-panel',

    events: {
      // form events
      'click .gt-add-extra': 'addExtra',
      'click .gt-remove-extra': 'removeExtra',

      'click .gt-add-action': 'addAction',
      'click .gt-remove-action': 'removeAction',

      'click .gt-add-notification': 'addNotification',
      'click .gt-remove-notification': 'removeNotification',

      // submit events
      'click .gt-submit': 'parseForm',

      // delete events
      'click .gt-item-delete': 'confirmDelete',
      'click .gt-reset-delete': 'resetDelete',
      'click .gt-item-confirm-delete': 'destroyModel'
    },

    ui: {
      'actions': '.gt-actions',
      'extras': '.gt-extras',
      'addAction': '.gt-add-action',
      'form': 'form',
      'deleteItem': '.gt-item-delete',
      'confirm': '.gt-item-confirm-delete',
      'reset': '.gt-reset-delete'
    },

    onShow: function () {
      if (!this.model) {
        this.buildNewForm();
      } else {
        this.buildEditForm();
      }

      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    buildNewForm: function () {
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // get shape from map
      this.parseShape();

      // build html for default action (notification.text)
      actionsHtml = App.Templates['form/actions/notification/index'](data);
      noteHtml = App.Templates['form/actions/notification/text'](data);

      // inject html into DOM
      this.ui.actions.html(actionsHtml);
      this.ui.actions.find('.gt-notification-actions').html(noteHtml);

      // hide add action and add notification buttons
      this.ui.form.find('.gt-add-action[data-action="notification"]').hide();
      this.ui.form.find('.gt-add-notification[data-notification="text"]').hide();
    },

    buildEditForm: function () {
      var currentActions = this.model.get('action');
      var data = this.serializeData();
      var actionsHtml = '';
      var noteHtml = '';
      var extrasHtml = '';
      var prop, i;

      // build actions

      function hasProp(obj, prop) {
        return obj.hasOwnProperty(prop) &&
          obj[prop] !== undefined &&
          obj[prop] !== null;
      }

      var hasNotification = hasProp(currentActions, 'notification');

      if (hasNotification) {
        // build notification form elements if they exist
        for (prop in currentActions.notification) {
          if (hasProp(currentActions.notification, prop)) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
          }
        }

        // only add notification block if it has one or more filled properties
        if (noteHtml !== '') {
          actionsHtml += App.Templates['form/actions/notification/index'](data);
          this.ui.form.find('.gt-add-action[data-action="notification"]').hide();
        }
      }

      var actions = [
        'callbackUrl',
        'trackingProfile'
      ];

      for (i = 0; i < actions.length; i++) {
        if (hasProp(currentActions, actions[i])) {
          actionsHtml += App.Templates['form/actions/' + actions[i]](data);
          this.ui.form.find('.gt-add-action[data-action="' + actions[i] + '"]').hide();
        }
      }

      // insert actions form elements into their proper place
      this.ui.actions.html(actionsHtml);

      // insert notification form elements if they exist
      if (noteHtml !== '') {
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);

        // hide add buttons for properties that already exist
        for (prop in currentActions.notification) {
          if (hasProp(currentActions.notification, prop)) {
            var $notification = this.ui.form.find('.gt-add-notification[data-notification="' + prop + '"]');
            $notification.hide();
          }
        }
      }

      // build extras

      var hasProperties = hasProp(this.model.attributes, 'properties');

      if (hasProperties) {
        extrasHtml += App.Templates['form/extras/properties'](data);
        this.ui.form.find('.gt-add-extra[data-extra="properties"]').hide();
      }

      var isSet;
      var extras = [
        'rateLimit',
        'times'
      ];

      for (i = 0; i < extras.length; i++) {
        isSet = hasProp(this.model.attributes, extras[i]) && parseInt(this.model.attributes[extras[i]], 10) !== 0;
        if (isSet) {
          extrasHtml += App.Templates['form/extras/' + extras[i]](data);
          this.ui.form.find('.gt-add-extra[data-extra="' + extras[i] + '"]').hide();
        }
      }

      this.ui.extras.html(extrasHtml);
    },

    addAction: function (e) {
      var $el, action, actionHtml, noteHtml;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target);
        action = $el.data('action');
      }

      // support for addAction being called internally with string param representing action name
      else if (typeof e === 'string') {
        action = e;
        $el = this.ui.form.find(".gt-add-action[data-action='" + action + "']");
      }

      // extra work if action type is notification
      if (action === 'notification') {
        // build html
        actionHtml = App.Templates['form/actions/notification/index']({});
        noteHtml = App.Templates['form/actions/notification/text']({});

        // add to DOM
        this.ui.actions.append(actionHtml);
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);

        // hide notification button
        this.ui.form.find('.gt-add-notification[data-notification="text"]').hide();
      }

      // default
      else {
        // build html
        actionHtml = App.Templates['form/actions/' + action]({});

        // add to DOM
        this.ui.actions.append(actionHtml);
      }

      // hide action button
      $el.hide();
    },

    removeAction: function (e) {
      var $el, action;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target).closest('.gt-property');
        action = $el.data('action');
      }

      // support for addAction being called internally with string param representing action name
      else if (typeof e === 'string') {
        action = e;
        $el = this.ui.form.find(".gt-property[data-action='" + action + "']");
      }

      // remove action form element
      $el.remove();

      // show add action button
      this.ui.form.find('.gt-add-action[data-action="' + action + '"]').show();
    },

    addNotification: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target);
      var notification = $el.data('notification');
      var html = App.Templates['form/actions/notification/' + notification]({});

      // add notification to notification actions section
      this.ui.actions.find('.gt-notification-actions').append(html);

      // hide add notification button
      $el.hide();
    },

    removeNotification: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).closest('.gt-notification-action');
      var notification = $el.data('notification');

      // remove notification form element
      $el.remove();

      // show add notification button
      this.ui.form.find('.gt-add-notification[data-notification="' + notification + '"]').show();
    },

    addExtra: function (e) {
      var $el, extra, extraHtml, noteHtml;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target);
        extra = $el.data('extra');
      }

      // support for addExtra being called internally with string param representing extra name
      else if (typeof e === 'string') {
        extra = e;
        $el = this.ui.form.find(".gt-add-extra[data-extra='" + extra + "']");
      }

      // build html
      extraHtml = App.Templates['form/extras/' + extra]({});

      // add to DOM
      this.ui.extras.append(extraHtml);

      // hide extra button
      $el.hide();
    },

    removeExtra: function (e) {
      var $el, extra;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target).closest('.gt-property');
        extra = $el.data('extra');
      }

      // support for addExtra being called internally with string param representing extra name
      else if (typeof e === 'string') {
        extra = e;
        $el = this.ui.form.find(".gt-property[data-extra='" + extra + "']");
      }

      // remove extra form element
      $el.remove();

      // show add extra button
      this.ui.form.find('.gt-add-extra[data-extra="' + extra + '"]').show();
    },

    parseShape: function () {
      var lat, lng, rad;

      // get layer data
      var layer = App.request('draw:layer');

      // DOM references
      var direction = this.ui.form.find('[name="condition[direction]"]');
      var geometry = this.ui.form.find('[name="geometry-type"]');
      var shape = this.ui.form.find('.gt-shape-indicator');
      var sections = this.ui.form.find('.gt-form-section');

      // default direction to enter if it's not already set
      if (direction.val() === null) {
        direction.val('enter');
      }

      // layer is polygon
      if (layer instanceof L.Polygon) {
        lat = Math.round(layer.getCenter().lat * 10000) / 10000;
        lng = Math.round(layer.getCenter().lng * 10000) / 10000;
        geometry.val('polygon');
        shape.text('a polygon around ' + lat + ', ' + lng);
        sections.show();
      }

      // layer is radius
      else if (layer instanceof L.Circle) {
        lat = Math.round(layer.getLatLng().lat * 10000) / 10000;
        lng = Math.round(layer.getLatLng().lng * 10000) / 10000;
        rad = Math.round(layer.getRadius());
        geometry.val('radius');
        shape.text('a ' + rad + 'm radius around ' + lat + ', ' + lng);
        sections.show();
      }

      else if (layer instanceof L.MultiPolygon) {
        geometry.val('multipolygon');
        shape.text('a multipolygon');
        sections.show();
      }

      // hide all form sections besides condition if a shape hasn't been drawn yet
      else {
        sections.filter(':not(:first-child)').hide();
      }
    },

    parseForm: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var i;
      var errors = [];
      var data = this.ui.form.serializeObject();

      function isInteger (num) {
        return !isNaN(num) && isFinite(num);
      }

      // clean data
      data = App.util.removeEmptyStrings(data);

      // clean tags
      if (data.tags) {
        var tags = data.tags;
        tags = tags.split(',');
        for (i = tags.length - 1; i >= 0; i--) {
          tags[i] = tags[i].trim();
        }
        data.tags = tags;
      } else {
        // at least one tag required
        errors.push('at least one tag is required');
      }

      // condition validation
      if (data.condition) {
        // get layer data
        var layer = App.request('draw:layer');

        // layer is polygon or multipolygon
        if (layer instanceof L.Polygon || layer instanceof L.MultiPolygon) {
          data.condition.geo = {
            'geojson': layer.toGeoJSON().geometry
          };
        }

        // layer is radius
        else if (layer instanceof L.Circle) {
          var latlng = layer.getLatLng();
          data.condition.geo = {
            'latitude': latlng.lat,
            'longitude': latlng.lng,
            'distance': Math.round(layer.getRadius())
          };
        }

        // something went horribly wrong!
        else {
          errors.push('missing trigger shape');
        }
      } else {
        errors.push('direction for trigger condition is required');
      }

      // action validation
      if (data.action) {
        if (!data.action.notification) {
          data.action.notification = null;
        } else {
          if (data.action.notification.data) {
            try {
              data.action.notification.data = JSON.parse(data.action.notification.data);
            } catch (error) {
              errors.push('notification data must be valid JSON');
            }
          }
        }

        // tracking profile
        if (!data.action.trackingProfile) {
          data.action.trackingProfile = null;
        }

        // callback URL
        if (!data.action.callbackUrl) {
          data.action.callbackUrl = null;
        }
      } else {
        // at least one action required
        errors.push('at least one action required');
      }

      // extras validation

      // properties
      if (!data.properties) {
        data.properties = null;
      } else {
        try {
          data.properties = JSON.parse(data.properties);
        } catch (error) {
          errors.push('properties must be valid JSON');
        }
      }

      // rate limit
      if (!data.rateLimit) {
        data.rateLimit = 0;
      } else {
        data.rateLimit = parseInt(data.rateLimit, 10);

        if (!isInteger(data.rateLimit)) {
          errors.push('rate limit must be valid integer');
        }
      }

      // times
      if (!data.times) {
        data.times = 0;
      } else {
        data.times = parseInt(data.times, 10);

        if (!isInteger(data.times)) {
          errors.push('times must be valid integer');
        }
      }

      if (errors.length > 0) {
        for (i = errors.length - 1; i >= 0; i--) {
          App.vent.trigger('notify', {
            type: 'error',
            message: errors[i]
          });
        }
      } else {
        this.createOrUpdateTrigger(data);
      }
    },

    createOrUpdateTrigger: function (data) {
      var model = App.collections.triggers.findWhere({
        'triggerId': data.triggerId
      });

      var isNew = !this.model && !model;
      var isOverwrite = !this.model && !!model;
      var isUpdate = !!this.model;

      var warning = 'A trigger with the ID "' + data.triggerId + '" already exists. Do you want to overwrite it?';

      // create new trigger
      if (isNew) {
        return App.vent.trigger('trigger:create', data);
      }

      // overwrite existing trigger (trigger/create dedupe workaround)
      if (isOverwrite && confirm(warning)) {
        return App.vent.trigger('trigger:update', data);
      }

      // update existing trigger
      if (isUpdate) {
        data.triggerId = this.model.get('triggerId');
        return App.vent.trigger('trigger:update', data);
      }
    },

    confirmDelete: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // show confirmation state
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout-right');
    },

    resetDelete: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide confirmation state
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout-right');
    },

    destroyModel: function (e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // broadcast trigger:destroy event with model info
      App.vent.trigger('trigger:destroy', this.model);
    }
  });

});
