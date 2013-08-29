GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  Editor.Router = Marionette.AppRouter.extend({
    appRoutes: {}
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

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function() {
      this.showMap();
      this.showControls();
      this.setupDrawers(this.triggerCollection);
      this.setupNotifications();

      this.triggerCollection.fetch({
        success: function(collection, response, options) {
          // console.log('success', arguments);
        },
        error: function(collection, response, options) {
          // console.log('error', arguments);
        },
        complete: function(xhr, textStatus) {
          // console.log('complete', arguments);
        }
      });
    },

    showMap: function() {
      var map = new App.Views.Map();
      App.mapRegion.show(map);
    },

    showControls: function() {
      App.Editor.Controller.controlsView = new App.Views.Controls();
      App.controlsRegion.show(App.Editor.Controller.controlsView);
    },

    setupDrawers: function(triggers) {
      this.drawerLayout = new App.Layouts.Drawer();
      var listView = new App.Views.List({ collection: triggers });
      // var emptyView = new App.Views.Empty();
      // var newView = new App.Views.New();

      // populate list drawer
      App.listDrawerRegion.show(this.drawerLayout);
      this.drawerLayout.listRegion.show(listView);

      // populate new drawer
      // App.newDrawerRegion.show(newView);

      // open list drawer
      App.Editor.Controller.controlsView.toggleList();
    },

    setupNotifications: function() {
      var noteList = new App.Views.NotificationList({ collection: this.notificationCollection });
      App.notificationsRegion.show(noteList);
      App.vent.on('notifications:new', function(attributes){
        var note = new App.Models.Notification(attributes);
        this.notificationCollection.add(note);
      }, this);
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