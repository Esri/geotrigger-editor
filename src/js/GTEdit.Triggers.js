GTEdit.module('Triggers', function(Triggers, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // ----------

  Triggers.Trigger = Backbone.Model.extend({

    defaults: {
      title: '',
      completed: false,
      created: 0
    },

    initialize: function() {
      if (this.isNew()) {
        this.set('created', Date.now());
      }
    },

    toggle: function() {
      return this.set('completed', !this.isCompleted());
    },

    isCompleted: function() {
      return this.get('completed');
    }
  });

  // Trigger Collection
  // ---------------

  Triggers.TriggerList = Backbone.Collection.extend({
    model: Triggers.Trigger,

    getCompleted: function() {
      return this.filter(this._isCompleted);
    },

    getActive: function() {
      return this.reject(this._isCompleted);
    },

    comparator: function(trigger) {
      return trigger.get('created');
    },

    _isCompleted: function(trigger){
      return trigger.isCompleted();
    }
  });

});