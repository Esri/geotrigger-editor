GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    idAttribute: 'triggerId',

    // override sync method to use geotrigger API
    sync: function(method, model, options) {
      console.log('sync:' + method);

      var triggerId = this.get('triggerId');

      var callback = _.bind(function(error, response) {
        if (error) {
          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else {
          if (method !== 'read') {
            App.vent.trigger('notify', 'Trigger ' + method + 'd successfully');
          }
          if (options && options.success) {
            options.success(response);
          }
        }
      }, this);

      switch (method) {
        case 'read':
          App.API.session.request('trigger/list', { 'triggerIds': [ triggerId ] }, callback);
          break;
        case 'create':
          App.API.session.request('trigger/create', model.toJSON(), callback);
          break;
        case 'update':
          var params = {
            'properties': this.get('properties'),
            'triggerIds': triggerId,
            'condition': this.get('condition'),
            'action': this.get('action'),
            'setTags': this.get('tags')
          };
          App.API.session.request('trigger/update', params, callback);
          break;
        case 'delete':
          App.API.session.request('trigger/delete', { 'triggerIds': triggerId }, callback);
          break;
      }
    }

  });

});