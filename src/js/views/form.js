GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Form View
  // -----------------
  //
  // handles both new and edit views for triggers
  // (new) builds a blank form for a new trigger
  // (edit) populates the form with a preexisting trigger
  // either way this view builds the object to be submitted to the API and handles client-side validation

  Views.Form = Marionette.ItemView.extend({
    template: App.Templates['form/index'],
    className: 'gt-panel',

    events: {
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
      if (!this.model) {
        this.buildNewForm();
      } else {
        this.buildEditForm();
      }

      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    buildNewForm: function() {
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

    buildEditForm: function() {
      // get current actions
      var currentActions = this.model.get('action');

      // get data
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';
      var prop;

      // build actions:

      // notification
      if (currentActions.hasOwnProperty('notification')) {
        actionsHtml += App.Templates['form/actions/notification/index'](data);
        this.ui.form.find('.gt-add-action[data-action="notification"]').hide();

        // build notification form elements if they exist
        for (prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
          }
        }
      }

      // callback URL
      if (currentActions.hasOwnProperty('callbackUrl')) {
        actionsHtml += App.Templates['form/actions/callbackUrl'](data);
        this.ui.form.find('.gt-add-action[data-action="callbackUrl"]').hide();
      }

      // tracking profile
      if (currentActions.hasOwnProperty('trackingProfile')) {
        actionsHtml += App.Templates['form/actions/trackingProfile'](data);
        this.ui.form.find('.gt-add-action[data-action="trackingProfile"]').hide();
      }

      // insert actions form elements into their proper place
      this.ui.actions.html(actionsHtml);

      // insert notification form elements if they exist
      if (noteHtml !== '') {
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);

        // hide add buttons for properties that already exist
        for (prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            var $notification = this.ui.form.find('.gt-add-notification[data-notification="' + prop + '"]');
            $notification.hide();
          }
        }
      }
    },

    addTitle: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide add title button
      $(e.target).addClass('gt-hide');

      // show title form element
      this.$el.find('.gt-title').removeClass('gt-hide');
    },

    removeTitle: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide title form element
      $(e.target).closest('.gt-property').addClass('gt-hide');

      // clear title value
      this.ui.form.find('input[name="properties[title]"]').val('');

      // show add title button
      this.ui.form.find('.gt-add-title').removeClass('gt-hide');
    },

    addAction: function(e) {
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

    removeAction: function(e) {
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

    addNotification: function(e) {
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

    removeNotification: function(e) {
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

    parseShape: function() {
      // get layer data
      var layer = App.request('draw:layer');

      // DOM references
      var direction = this.ui.form.find('[name="condition[direction]"]');
      var geometry = this.ui.form.find('[name="geometry-type"]');
      var shape = this.ui.form.find('.gt-shape-indicator');
      var sections = this.ui.form.find('.gt-form-section');
      // var radius = this.ui.form.find('[name="radius"]'); // @TODO: radius

      // default direction to enter if it's not already set
      if (direction.val() === null) {
        direction.val('enter');
      }

      // layer is polygon
      if (layer instanceof L.Polygon) {
        geometry.val('polygon');
        shape.text('a polygon');
        sections.show();
      }

      // layer is radius
      else if (layer instanceof L.Circle) {
        geometry.val('radius');
        shape.text('a radius');
        // radius.show().val(Math.round(layer.getRadius())); // @TODO: radius
        sections.show();
      }

      // hide all form sections besides condition if a shape hasn't been drawn yet
      else {
        sections.filter(':not(:first-child)').hide();
      }
    },

    parseForm: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var data = this.ui.form.serializeObject();

      // clean data
      data = App.util.removeEmptyStrings(data);

      // clean tags
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

      // condition validation
      if (!data.condition || !data.condition.geo) {
        // condition and condition.geo required
      }

      // action validation
      if (data.action) {
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
      }

      // create or update if all requirements have been satisfied
      if (data && data.tags && data.condition && data.action) {
        this.createOrUpdateTrigger(data);
      }
    },

    createOrUpdateTrigger: function(data) {
      // get layer data
      var layer = App.request('draw:layer');

      // layer is polygon
      if (layer instanceof L.Polygon) {
        data.condition.geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      // layer is radius
      else if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        data.condition.geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      }

      // something went horribly wrong!
      else {
        throw new Error('Invalid layer data');
      }

      // create new trigger
      if (!this.model) {
        App.vent.trigger('trigger:create', data);
      }

      // update existing trigger
      else {
        data.triggerId = this.model.get('triggerId');
        App.vent.trigger('trigger:update', data);
      }
    },

    confirmDelete: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // show confirmation state
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout-right');
    },

    resetDelete: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide confirmation state
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout-right');
    },

    destroyModel: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // broadcast trigger:destroy event with model info
      App.vent.trigger('trigger:destroy', this.model);
    }
  });

});