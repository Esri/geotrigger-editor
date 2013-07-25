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

  var Controller = function() {
    this.triggerCollection = new App.Triggers.Collection();
  };

  _.extend(Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function() {
      this.showMap();
      this.showControls();
      this.setupDrawers(this.triggerCollection);

      this.triggerCollection.fetch({
        success: function(collection, response, options) {
          // console.log('success', arguments);
        },
        error: function(collection, response, options) {
          // console.log('error', arguments);
        },
        complete: function(xhr, textStatus) {
          // console.log(textStatus);
        }
      });
    },

    showMap: function() {
      var map = new App.Views.Map();
      App.mapRegion.show(map);
    },

    showControls: function() {
      var controlsView = new App.Views.Controls();
      App.controlsRegion.show(controlsView);
    },

    setupDrawers: function(triggers) {
      var drawerLayout = new App.Layout.Drawer();
      var listView = new App.Views.List({ collection: triggers });
      var emptyView = new App.Views.Empty();
      var editView = new App.Views.Edit();
      var newView = new App.Views.New();

      // populate list drawer
      App.listDrawerRegion.show(drawerLayout);
      drawerLayout.listRegion.show(listView);
      drawerLayout.editRegion.show(editView);

      // populate new drawer
      App.newDrawerRegion.show(newView);

      // open list drawer
      App.listDrawerRegion.$el.addClass('gt-open');
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