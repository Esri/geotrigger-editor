GTEdit.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

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

  Editor.Controller = function() {
    this.triggerCollection = new App.Triggers.Collection();
  };

  _.extend(Editor.Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function() {
      this.showMap();
      this.showControls();
      this.showDrawer();

      // this.triggerCollection.fetch();
    },

    showMap: function() {
      var map = new App.Views.Map();
      App.mapRegion.show(map);
    },

    showControls: function() {
      var controlsView = new App.Views.Controls();
      App.controlsRegion.show(controlsView);
    },

    showDrawer: function() {
      var drawerLayout = new App.Layout.Drawer();
      var listView = new App.Views.List();
      var editView = new App.Views.Edit();

      App.drawerRegion.show(drawerLayout);
      drawerLayout.listRegion.show(listView);
      drawerLayout.editRegion.show(editView);
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing geotriggers and displaying them.

  Editor.addInitializer(function() {
    var controller = new Editor.Controller();
    new Editor.Router({
      controller: controller
    });

    controller.start();
  });

});