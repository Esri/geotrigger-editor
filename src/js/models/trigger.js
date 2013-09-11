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
          var message = "Error creating trigger";

          // polygons constructed over the dateline
          var outOfRange = new RegExp('Coordinate values are out of range', 'i');
          if (outOfRange.exec(JSON.stringify(error))){
            message = "Coordinate values are out of range";
          }

          // polygons that intersect themselves
          var intersection = new RegExp('Error performing intersection', 'i');
          if (intersection.exec(JSON.stringify(error))){
            message = "Polygons can't intersect themselves";
          }

          App.vent.trigger('notify', {
            type: 'error',
            message: message
          });

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

      var request = App.API.session.request;

      switch (method) {
        case 'read':
          request('trigger/list', { 'triggerIds': [ triggerId ] }, callback);
          break;
        case 'create':
          request('trigger/create', model.toJSON(), callback);
          break;
        case 'update':
          var params = {
            'properties': this.get('properties'),
            'triggerIds': triggerId,
            'condition': this.get('condition'),
            'action': this.get('action'),
            'setTags': this.get('tags')
          };
          request('trigger/update', params, callback);
          break;
        case 'delete':
          request('trigger/delete', { 'triggerIds': triggerId }, callback);
          break;
      }
    }

  });

});