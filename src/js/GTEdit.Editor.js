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
    this.triggerList = new App.Triggers.TriggerList();
  };

  _.extend(Editor.Controller.prototype, {

    // Start the app by showing the appropriate views
    // and fetching the list of items, if there are any
    start: function(){
      this.showMap();
      this.showControls();
      this.showDrawer();

      // this.triggerList.fetch();
    },

    showMap: function() {
      var map = new Editor.Views.MapView();
      App.map.show(map);
    },

    showControls: function() {
      var controls = new Editor.Views.ControlsView();
      App.controls.show(controls);
    },

    showDrawer: function() {
      var drawer = new App.Layout.Drawer();
      var list = new App.Editor.Views.ListView();
      var edit = new App.Editor.Views.EditView();

      App.drawer.show(drawer);
      drawer.list.show(list);
      drawer.edit.show(edit);
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