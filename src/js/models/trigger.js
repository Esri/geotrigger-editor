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
        }
        if (options && options.success) {
          options.success(response);
        }
      }

      try {

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
            App.API.session.request('trigger/update', {
              params: {
                'triggerIds': triggerId,
                'condition': this.get('condition'),
                'action': this.get('action'),
                'setTags': this.get('tags')
              },
              callback: callback
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

      } catch(error) {
        // error catching logic
        console.log('Something went horribly wrong!');
      }
    }

  });

});