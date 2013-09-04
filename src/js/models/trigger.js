GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    idAttribute: 'triggerId',

    // override sync method to use geotrigger API
    sync: function(method, model, options) {
      console.log('sync:' + method);
      var triggerId = this.get('triggerId');

      function callback(error, response) {
        if (error) {
          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else if (options && options.success) {
          options.success(response);
        }
      }

      switch (method) {
        case 'read':
          App.API.session.request('trigger/list', {
            params: {
              'triggerIds': [triggerId]
            },
            callback: callback
          });
          break;
        case 'create':
          App.API.session.request('trigger/create', {
            params: model.toJSON(),
            callback: callback
          });
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
          App.API.session.request('trigger/update', {
            params: params,
            callback: _.bind(function(error, response) {
              if (error) {
                if (options && options.error) {
                  options.error('Record Not Found');
                }
              } else {
                if (options && options.success) {
                  options.success(response);
                }
              }
            }, this)
          });
          break;
        case 'delete':
          App.API.session.request('trigger/delete', {
            params: {
              'triggerIds': triggerId
            },
            callback: callback
          });
          break;
      }
    }

  });

});