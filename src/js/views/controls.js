Geotrigger.Editor.module('Views', function (Views, App, Backbone, Marionette, $, _) {

  // Controls View
  // -------------
  //
  // Displays controls and handles state of drawer and tools.

  Views.Controls = Marionette.ItemView.extend({
    template: App.Templates['controls'],
    className: 'gt-control-group',

    events: {
      'click .gt-tool-list': 'toggleList',
      'click .gt-tool-create': 'toggleNew',
      'click .gt-tool-polygon': 'togglePolygon',
      'click .gt-tool-radius': 'toggleRadius'
    },

    ui: {
      'drawers': '.gt-drawer-controls',
      'tools': '.gt-tool-controls',
      'list': '.gt-drawer-controls .gt-tool-list',
      'create': '.gt-drawer-controls .gt-tool-create',
      'polygon': '.gt-tool-controls .gt-tool-polygon',
      'radius': '.gt-tool-controls .gt-tool-radius',
      'all': '.gt-tool'
    },

    onRender: function () {
      this.listenTo(App.router, 'route', this.handleStateChange);
      this.listenTo(App.vent, 'draw:new', this.disableTool);
      this.listenTo(App.vent, 'draw:enable', function (tool) {
        this.activate(tool);
      });
      this.listenTo(App.vent, 'draw:disable', function (tool) {
        this.ui.tools.find('.gt-tool').removeClass('gt-active');
      });
    },

    handleStateChange: function (route) {
      this.clear('drawers');
      switch (route) {
      case 'new':
        this.activate('list');
        break;
      case 'edit':
        this.activate('list');
        break;
      case 'list':
        this.activate('list');
        break;
      }
    },

    // drawers

    toggleList: function (e) {
      if (this.ui.list.hasClass('gt-active')) {
        e.preventDefault();
        App.router.navigate('', {
          trigger: true
        });
      }
    },

    toggleNew: function (e) {
      if (this.ui.create.hasClass('gt-active')) {
        e.preventDefault();
        App.router.navigate('', {
          trigger: true
        });
      }
    },

    // tools

    togglePolygon: function (e) {
      if (this.ui.polygon.hasClass('gt-active')) {
        this.disableTool('polygon');
      } else {
        this.enableTool('polygon');
      }
    },

    toggleRadius: function (e) {
      if (this.ui.radius.hasClass('gt-active')) {
        this.disableTool('radius');
      } else {
        this.enableTool('radius');
      }
    },

    enableTool: function (tool) {
      this.disableTool();
      App.vent.trigger('draw:enable', tool);
    },

    disableTool: function (tool) {
      App.vent.trigger('draw:disable', tool);
    },

    // helpers

    activate: function (name) {
      this.ui[name].addClass('gt-active');
    },

    toggle: function (name) {
      if (name === 'list') {
        this.ui.list.toggleClass('gt-active');
        this.ui.create.removeClass('gt-active');
      } else if (name === 'create') {
        this.ui.create.toggleClass('gt-active');
        this.ui.list.removeClass('gt-active');
      }
    },

    clear: function (name) {
      if (name === 'drawers') {
        this.ui.drawers.find('.gt-tool').removeClass('gt-active');
      } else if (name === 'tools') {
        this.ui.tools.find('.gt-tool').removeClass('gt-active');
      } else {
        this.ui.all.removeClass('gt-active');
      }
    }
  });

});
