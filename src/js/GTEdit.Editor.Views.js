GTEdit.module('Editor.Views', function(Views, App, Backbone, Marionette, $, _) {

  // Todo List Item View
  // -------------------
  //
  // Display an individual trigger item, and respond to changes that are made to the trigger.

  Views.ItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: '#template-todoItemView',

    ui: {
      edit: '.edit'
    },

    events : {
      'click .destroy': 'destroy',
      'dblclick label': 'onEditClick',
      'keypress .edit': 'onEditKeypress',
      'blur .edit': 'onEditBlur',
      'click .toggle' : 'toggle'
    },

    initialize: function() {
      console.log(this);
      this.listenTo(this.model, 'change', this.render, this);
    },

    onRender: function() {
      this.$el.removeClass('active completed');

      if (this.model.get('completed')) {
        this.$el.addClass('completed');
      } else {
        this.$el.addClass('active');
      }
    },

    destroy: function() {
      this.model.destroy();
    },

    toggle: function() {
      this.model.toggle().save();
    },

    onEditClick: function() {
      this.$el.addClass('editing');
      this.ui.edit.focus();
    },

    updateTodo : function() {
      var todoText = this.ui.edit.val();
      if (todoText === '') {
        return this.destroy();
      }
      this.setTodoText(todoText);
      this.completeEdit();
    },

    onEditBlur: function(e){
      this.updateTodo();
    },

    onEditKeypress: function(e) {
      var ENTER_KEY = 13;
      if (e.which === ENTER_KEY) {
        this.updateTodo();
      }
    },

    setTodoText: function(todoText){
      if (todoText.trim() === ""){ return; }
      this.model.set('title', todoText).save();
    },

    completeEdit: function(){
      this.$el.removeClass('editing');
    }
  });

  // Item List View
  // --------------
  //
  // Controls the rendering of the list of items, including the
  // filtering of activs vs completed items for display.

  Views.ListView = Backbone.Marionette.CompositeView.extend({
    template: 'list-panel',
    itemView: Views.ItemView,
    itemViewContainer: '#todo-list',

    ui: {
      toggle: '#toggle-all'
    },

    events : {
      'click #toggle-all': 'onToggleAllClick'
    },

    initialize: function() {
      console.log(this);
      this.listenTo(this.collection, 'all', this.update, this);
    },

    onRender: function() {
      this.update();
    },

    update: function() {
      function reduceCompleted(left, right) {
        return left && right.get('completed');
      }

      var allCompleted = this.collection.reduce(reduceCompleted,true);

      this.ui.toggle.prop('checked', allCompleted);
      this.$el.parent().toggle(!!this.collection.length);
    },

    onToggleAllClick: function(e) {
      var isChecked = e.currentTarget.checked;

      this.collection.each(function(todo){
        todo.save({'completed': isChecked});
      });
    }
  });

  Views.MapView = Marionette.ItemView.extend({
    initialize: function() {
      // this.listenTo(this.model, 'change', this.render, this);
    },

    render: function() {
      var map = this.map = L.map('gt-map');

      map.zoomControl.setPosition('topright');

      // ArcGIS Online Basemaps - Streets, Topographic, Gray, Gray Labels, Ocean, NationalGeographic, Imagery, ImageryLabels
      L.esri.basemapLayer("Imagery", {
        zIndex: 1,
        detectRetina: true
      }).addTo(map);

      L.esri.basemapLayer("ImageryLabels", {
        zIndex: 3
      }).addTo(map);

      function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
        L.circle(e.latlng, radius).addTo(map);
      }

      function onLocationError(e) {
        alert(e.message);
      }

      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);

      map.locate({setView: true, maxZoom: 16});
    },

    onRender: function() {
      this.$el.removeClass('active completed');

      if (this.model.get('completed')) {
        this.$el.addClass('completed');
      } else {
        this.$el.addClass('active');
      }
    }
  });

  // Application Event Handlers
  // --------------------------
  //
  // Handler for filtering the list of items by showing and
  // hiding through the use of various CSS classes

  App.vent.on('triggerList:filter', function(filter) {
    filter = filter || 'all';
    console.log('filter by:', filter);
    // $('#todoapp').attr('class', 'filter-' + filter);
  });

});