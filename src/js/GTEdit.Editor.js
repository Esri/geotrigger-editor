GTEdit.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  Editor.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '*filter': 'filterItems'
    }
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
    // and fetching the list of todo items, if there are any
    start: function(){
      this.showControls(this.triggerList);
      this.showDrawer(this.triggerList);
      this.showMap();

      // App.bindTo(this.triggerList, 'reset add remove', this.toggleFooter, this);
      // this.triggerList.fetch();
    },

    showControls: function() {
      var controls = new App.Layout.Controls();
      App.controls.show(controls);
    },

    showDrawer: function(triggerList) {
      var drawer = new App.Layout.Drawer({
        collection: triggerList
      });
      App.drawer.show(drawer);
    },

    showMap: function(triggerList) {
      App.map.show(new Editor.Views.MapView());
    },

    toggleDrawer: function() {
      App.drawer.$el.toggle(this.triggerList.length);
    },

    // Set the filter to show complete or all items
    filterItems: function(filter) {
      // App.vent.trigger('triggerList:filter', filter.trim() || '');
    }
  });

  // TodoList Initializer
  // --------------------
  //
  // Get the TodoList up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing Todo items and displaying them.

  Editor.addInitializer(function() {
    var controller = new Editor.Controller();
    new Editor.Router({
      controller: controller
    });

    controller.start();
  });

});