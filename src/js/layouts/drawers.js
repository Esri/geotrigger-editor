GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------
  //
  // not currently in use

  Layouts.Drawers = Backbone.Marionette.Layout.extend({
    template: App.Templates['drawers'],
    className: 'gt-panel-wrap',

    events: {},

    regions: {
      'list'   : '.gt-panel-list',
      'edit'   : '.gt-panel-edit',
      'create' : '.gt-panel-new'
    },

    initialize: function() {
      this.listenTo(App.vent, 'trigger:list', this.showList);
      this.listenTo(App.vent, 'trigger:edit', this.showEdit);
      this.listenTo(App.vent, 'trigger:new', this.showNew);
    },

    showList: function() {
      var view = new App.Views.List({ collection: App.collections.triggers });
      this.list.show(view);
    },

    showEdit: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var view = new App.Views.Edit({ model: model });
      this.edit.show(view);
    },

    showNew: function() {
      var view = new App.Views.New();
      this.create.show(view);
    }
  });

});
