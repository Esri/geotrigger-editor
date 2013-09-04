GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  Editor.Router = Marionette.AppRouter.extend({
    appRoutes: {
      ':id/edit': 'edit',
      'new': 'new',
      '': 'list'
    }
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function() {
    this.triggerCollection = new App.Collections.Triggers();
    this.notificationCollection = new App.Collections.Notifications();
  };

  _.extend(Controller.prototype, {

    // initialization
    start: function() {
      this.setupMap();
      this.setupControls();
      this.setupDrawers(this.triggerCollection);
      this.setupNotifications();

      App.vent.trigger('notify', {
        type: 'info',
        message: 'Triggers loading'
      });

      this.triggerCollection.fetch({
        reset: true,
        success: function() {
          App.vent.trigger('notify:clear');
          App.vent.trigger('controls:list:toggle');
          App.map.fitBounds(App.Map.Draw.mainLayer.getBounds());
        }
      });

      App.vent.on('trigger:create', this.createTrigger, this);
      App.vent.on('trigger:update', this.updateTrigger, this);
    },

    // setup
    setupMap: function() {
      var map = new App.Views.Map();
      App.mapRegion.show(map);
    },

    setupControls: function() {
      var controlsView = new App.Views.Controls();
      App.controlsRegion.show(controlsView);
    },

    setupDrawers: function(triggers) {
      this.drawers = new App.Layouts.Drawers();
      var listView = new App.Views.List({ collection: triggers });

      // populate list drawer
      App.listDrawerRegion.show(this.drawers);
      this.drawers.listRegion.show(listView);
    },

    setupNotifications: function() {
      var noteList = new App.Views.NotificationList({
        collection: this.notificationCollection
      });

      App.notificationsRegion.show(noteList);

      App.vent.on('notify', function(attributes){
        var note = new App.Models.Notification(attributes);
        this.notificationCollection.add(note);
      }, this);
    },

    // routes
    list: function() {
      console.log('list');
      // show list
    },

    new: function() {
      console.log('new');
      var newView = new App.Views.New();
      App.newDrawerRegion.show(newView);
    },

    edit: function(id) {
      console.log('edit ' + id);
      var model = this.triggerCollection.get(id);
      var editView = new App.Views.Edit({ model: model });
      this.drawers.editRegion.show(editView);
      this.drawers.$el.addClass('gt-panel-editing');
    },

    // crud
    createTrigger: function(triggerData) {
      this.triggerCollection.create(triggerData);
    },

    updateTrigger: function(triggerData) {
      console.log(triggerData);
      var model = this.triggerCollection.get(triggerData.triggerId);
      model.set(triggerData);
      model.save();
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing geotriggers and displaying them.

  Editor.addInitializer(function() {
    Editor.Controller = new Controller();
    new Editor.Router({
      controller: Editor.Controller
    });

    Editor.Controller.start();
  });

});