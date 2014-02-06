Geotrigger.Editor.module('Models', function (Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  // private functions

  function processError(error) {
    // default message
    var msg = "Error creating trigger";

    // regexable error string
    var str = JSON.stringify(error);

    // out of range (polygons constructed over the dateline)
    if (null !== str.match("Coordinate values are out of range")) {
      msg = "Coordinate values are out of range";
    }

    // not found (trying to update a deleted trigger)
    if (null !== str.match("no triggers found")) {
      msg = "Deleted triggers can't be updated";
    }

    // intersects (polygons that intersect themselves)
    if (null !== str.match("Error performing intersection")) {
      msg = "Polygons can't intersect themselves";
    }

    // no message (invalid message property)
    if (null !== str.match("message:Not a valid parameter for this request")) {
      msg = "Notifications must have a valid message";
    }

    return msg;
  }

  // the model itself

  Models.Trigger = Backbone.Model.extend({

    // override sync method to use geotrigger API
    sync: function (method, model, options) {
      var triggerId = this.get('triggerId');
      var params;

      var callback = _.bind(function (error, response) {
        if (error) {
          App.vent.trigger('notify', {
            type: 'error',
            message: processError(error)
          });

          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else {
          if (method !== 'read') {
            App.vent.trigger('notify', {
              message: 'Trigger ' + method + 'd successfully',
              timeout: 3500
            });
          }

          if (options && options.success) {
            options.success(response);
          }
        }
      }, this);

      switch (method) {
      case 'read':
        App.API.session.request('trigger/list', {
          'triggerIds': [triggerId]
        }, callback);
        break;

      case 'create':
        params = {
          'setTags': this.get('tags'),
          'condition': this.get('condition'),
          'action': this.get('action'),
          'properties': this.get('properties'),
          'rateLimit': this.get('rateLimit'),
          'times': this.get('times')
        };
        if (triggerId) {
          params.triggerId = triggerId;
        }
        App.API.session.request('trigger/create', params, callback);
        break;

      case 'update':
        params = {
          'triggerIds': triggerId,
          'setTags': this.get('tags'),
          'condition': this.get('condition'),
          'action': this.get('action'),
          'properties': this.get('properties'),
          'rateLimit': this.get('rateLimit'),
          'times': this.get('times')
        };
        App.API.session.request('trigger/update', params, callback);
        break;

      case 'delete':
        App.API.session.request('trigger/delete', {
          'triggerIds': triggerId
        }, callback);
        break;

      default:
        throw new Error('Unsupported method: ' + method);
      }
    },

    parse: function (response) {
      if (response.triggers) {
        return response.triggers;
      } else {
        return response;
      }
    }

  });

  // Trigger Collection
  // ------------------

  Models.Triggers = Backbone.Collection.extend({
    model: Models.Trigger,

    fetch: function (options) {
      var callback = _.bind(function (error, response) {
        if (options && options.reset) {
          this.reset(this.parse(response));
        } else {
          this.set(this.parse(response));
        }

        if (options && options.success) {
          options.success(this, this.parse(response), options);
        }
      }, this);

      App.API.session.request('trigger/list', callback);
    },

    parse: function (response) {
      return response.triggers;
    }
  });

});
