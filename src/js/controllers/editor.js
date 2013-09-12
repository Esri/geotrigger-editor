GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'index',
      'list': 'list',
      'list?q=:term': 'list',
      'new': 'new',
      ':id/edit': 'edit',
      '*notfound': 'notFound'
    }
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function() {
    App.collections = App.collections || {};
    App.collections.triggers = new App.Collections.Triggers();
    App.collections.notifications = new App.Collections.Notifications();
  };

  _.extend(Controller.prototype, {

    // initialization
    start: function() {
      this.setup();

      App.vent.trigger('notify', 'Triggers loading');

      App.collections.triggers.fetch({
        reset: true,
        success: function() {
          App.vent.trigger('notify:clear');
          Backbone.history.start();
          if (App.config.fitOnLoad) {
            App.execute('map:fit');
          }
        }
      });

      App.vent.on('draw:new', function(options){
        if (Backbone.history.fragment === 'new' ||
            Backbone.history.fragment.match('edit')) {
        } else {
          App.router.navigate('new', { trigger: true });
        }
      }, this);

      App.vent.on('trigger:create', this.createTrigger, this);
      App.vent.on('trigger:update', this.updateTrigger, this);
      App.vent.on('trigger:destroy', this.deleteTrigger, this);
    },

    // setup

    setup: function() {
      this.setupMap();
      this.setupDrawer();
      this.setupControls();
      this.setupNotifications();
    },

    setupMap: function() {
      var view = new App.Views.Map({ collection: App.collections.triggers });
      App.regions.map.show(view);
    },

    setupDrawer: function() {
      var drawer = App.regions.drawer;
      var content = App.mainRegion.$el.find('#gt-content');

      drawer.on('show', function(){
        content.addClass('gt-active');
      });

      drawer.on('close', function(){
        content.removeClass('gt-active');
      });
    },

    setupControls: function() {
      var view = new App.Views.Controls();
      App.regions.controls.show(view);
    },

    setupNotifications: function() {
      var view = new App.Views.NotificationList({
        collection: App.collections.notifications
      });

      App.regions.notes.show(view);

      App.vent.on('notify', function(options){
        if (typeof options === 'string') {
          options = {
            type: 'info',
            message: options
          };
        }

        var note = new App.Models.Notification(options);
        App.collections.notifications.add(note);
      }, this);
    },

    // routes

    index: function() {
      App.vent.trigger('index');

      App.regions.drawer.close();
    },

    list: function(term) {
      if (!App.regions.drawer.$el || !App.regions.drawer.$el.has('.gt-list').length) {
        App.vent.trigger('trigger:list');
        var view = new App.Views.List({ collection: App.collections.triggers });
        App.regions.drawer.show(view);
      }

      if (term) {
        term = decodeURIComponent(term.replace(/\+/g,'%20'));
        App.vent.trigger('trigger:list:search', term);
      }
    },

    new: function() {
      App.vent.trigger('trigger:new');

      var view = new App.Views.New();
      App.regions.drawer.show(view);

      App.vent.trigger('trigger:new:ready');
    },

    edit: function(triggerId) {
      var model = this.getTrigger(triggerId);

      if (!model) {
        this.notFound();
      } else {
        var view = new App.Views.Edit({ model: model });
        App.regions.drawer.show(view);
        App.vent.trigger('trigger:edit', triggerId);
      }
    },

    notFound: function() {
      App.vent.trigger('notify', {
        type: 'error',
        message: '404: Not Found'
      });
    },

    // crud

    createTrigger: function(triggerData) {
      App.collections.triggers.once('add', function(data){
        App.router.navigate('list', { trigger: true });
      });
      App.collections.triggers.create(triggerData, { wait: true });
    },

    getTrigger: function(id) {
      var model = App.collections.triggers.get(id);
      return model;
    },

    updateTrigger: function(triggerData) {
      App.collections.triggers.once('change', function(data){
        App.router.navigate('list', { trigger: true });
      });
      var model = App.collections.triggers.get(triggerData.triggerId);
      model.set(triggerData);
      model.save();
    },

    deleteTrigger: function(model) {
      App.collections.triggers.once('remove', function(data){
        if (Backbone.history.fragment.match('edit')) {
          App.router.navigate('list', { trigger: true });
        }
      });
      model.destroy();
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing geotriggers and displaying them.

  Editor.addInitializer(function() {
    var controller = new Controller();
    App.router = new Router({ controller: controller });
    controller.start();
  });

});