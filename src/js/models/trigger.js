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

      var request = function(route, params) {
        App.API.session.request(route, {
          params: params,
          callback: callback
        });
      };

      switch (method) {
        case 'read':
          request('trigger/list', { 'triggerIds': [ triggerId ] });
          break;
        case 'create':
          request('trigger/create', model.toJSON());
          break;
        case 'update':
          var params = {
            //'properties': this.get('properties'), // getting a 500
            'triggerIds': triggerId,
            'condition': this.get('condition'),
            'action': this.get('action'),
            'setTags': this.get('tags')
          };
          // console.log(params); // for debugging properties
          request('trigger/update', params);
          break;
        case 'delete':
          request('trigger/delete', { 'triggerIds': triggerId });
          break;
      }
    }

  });

});