Geotrigger.Editor.module('Editor', function (Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'index',
      'list(/)': 'list',
      'list/:term': 'list',
      'new(/)': 'create',
      'edit(/)': 'redirect',
      'edit/:id': 'edit',
      '*notfound': 'notFound'
    }
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function () {};

  function compabilityCheck () {
    if (('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (navigator.msMaxTouchPoints > 0)) {
      App.vent.trigger('notify', {
        type: 'error',
        message: 'Drawing and editing shapes is not currently supported for this browser.'
      });
    }
  }

  _.extend(Controller.prototype, {

    // initialization
    start: function () {
      this.setup();

      App.vent.trigger('notify', 'Fetching application data..');

      if (window.location.hash.match('edit')) {
        App._zoomToLayer = true;
      }

      App.collections.triggers.fetch({
        fetch: true,
        reset: true,
        success: function (model, response, options) {
          App.vent.trigger('notify:clear');

          compabilityCheck();

          // don't start history until triggers have been fetched
          Backbone.history.start();

          if (response && response.length === 0) {
            App.router.navigate('list', {
              trigger: true
            });
          } else if (App.config.fitOnLoad && !Backbone.history.fragment.match('edit')) {
            App.execute('map:fit');
          }
        }
      });

      App.vent.on('draw:new', function (options) {
        if (Backbone.history.fragment === 'new' ||
          Backbone.history.fragment.match('edit')) {} else {
          App.router.navigate('new', {
            trigger: true
          });
        }
      }, this);

      App.vent.on('trigger:create', this.createTrigger, this);
      App.vent.on('trigger:update', this.updateTrigger, this);
      App.vent.on('trigger:destroy', this.deleteTrigger, this);
    },

    // setup

    setup: function () {
      this.setupMap();
      this.setupDrawer();
      this.setupControls();
      this.setupNotifications();
    },

    setupMap: function () {
      var view = new App.Views.Map({
        collection: App.collections.triggers
      });
      App.regions.map.show(view);
    },

    setupDrawer: function () {
      var drawer = App.regions.drawer;
      var content = App.mainRegion.$el.find('#gt-content');

      drawer.on('show', function () {
        content.addClass('gt-active');
      });

      drawer.on('close', function () {
        content.removeClass('gt-active');
      });
    },

    setupControls: function () {
      var view = new App.Views.Controls();
      App.regions.controls.show(view);
    },

    setupNotifications: function () {
      var view = new App.Views.NotificationList({
        collection: App.collections.notifications
      });

      App.regions.notes.show(view);

      App.vent.on('notify', function (options) {
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

    index: function () {
      App.vent.trigger('index');
      App.regions.drawer.close();
    },

    list: function (term) {
      if (!App.regions.drawer.$el || !App.regions.drawer.$el.has('.gt-list').length) {
        App.vent.trigger('trigger:list');
        var model = new Backbone.Model({
          count: App.collections.triggers.length
        });
        var view = new App.Views.List({
          model: model,
          collection: App.collections.triggers
        });
        App.regions.drawer.show(view);
      } else if (!term) {
        App.vent.trigger('trigger:list:reset');
      }

      if (term) {
        term = decodeURIComponent(term.replace(/\+/g, '%20'));
        App.vent.trigger('trigger:list:search', term);
      }
    },

    create: function () {
      App.vent.trigger('trigger:new');

      var view = new App.Views.Form();
      App.regions.drawer.show(view);

      App.vent.trigger('trigger:new:ready');
    },

    edit: function (triggerId) {
      var model = this.getTrigger(triggerId);

      if (!model) {
        App.vent.trigger('notify', {
          type: 'error',
          message: 'That trigger doesn\'t exist!'
        });
      } else {
        var view = new App.Views.Form({
          model: model
        });
        App.regions.drawer.show(view);
        App.vent.trigger('trigger:edit', triggerId);
        view.parseShape();
      }
    },

    redirect: function () {
      App.router.navigate('', {
        trigger: true,
        replace: true
      });
    },

    notFound: function () {
      App.vent.trigger('notify', {
        type: 'error',
        message: 'Couldn\'t find page: "' + Backbone.history.fragment + '"'
      });
    },

    // crud

    createTrigger: function (triggerData) {
      App.execute('draw:clear');
      App.collections.triggers.create(triggerData, {
        // wait: true, // wait is broken in backbone 1.1.0
        success: function () {
          App.router.navigate('list', {
            trigger: true
          });
        }
      });
    },

    getTrigger: function (id) {
      var model = App.collections.triggers.findWhere({
        'triggerId': id
      });
      return model;
    },

    updateTrigger: function (triggerData) {
      App.collections.triggers.once('change', function (data) {
        App.router.navigate('list', {
          trigger: true
        });
      });
      var model = App.collections.triggers.findWhere({
        'triggerId': triggerData.triggerId
      });
      model.set(triggerData);
      model.set('id', model.get('triggerId')); // hack to ensure proper method
      model.save();
    },

    deleteTrigger: function (model) {
      App.collections.triggers.once('remove', function (data) {
        if (Backbone.history.fragment.match('edit')) {
          App.router.navigate('list', {
            trigger: true
          });
        }
      });
      model.set('id', model.get('triggerId')); // hack to ensure proper method
      model.destroy();
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing triggers and displaying them.

  Editor.addInitializer(function () {
    // initialize collections
    App.collections = App.collections || {};
    App.collections.triggers = new App.Models.Triggers();
    App.collections.notifications = new App.Models.Notifications();

    // initialize controller
    var controller = new Controller();

    // initialize router
    App.router = new Router({
      controller: controller
    });

    controller.start();
  });

});
