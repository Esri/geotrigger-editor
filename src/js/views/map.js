GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Shape View
  // ----------
  //
  // Manages layers on the map.

  Views.Shape = Marionette.View.extend({

    modelEvents: {
      'change': 'render'
    },

    render: function() {
      this.isClosed = false;

      this.triggerMethod('before:render', this);
      this.triggerMethod('item:before:render', this);

      this.renderShape();

      this.triggerMethod('render', this);
      this.triggerMethod('item:rendered', this);

      return this;
    },

    renderShape: function() {
      var id = this.model.get('triggerId');
      var geo = this.model.get('condition').geo;

      this.removeShape();

      if (geo.geojson) {
        this._shape = App.Map.polygon(geo.geojson);
      } else {
        this._shape = App.Map.circle(geo);
      }

      this._shape.on('click', _.bind(function(){
        App.router.navigate('edit/' + this.model.id, { trigger: true });
      }, this));

      this._shape.on('mouseover', _.bind(function(){
        App.Map.focusShape(this._shape);
      }, this));

      this._shape.on('mouseout', _.bind(function(){
        App.Map.unfocusShape(this._shape);
      }, this));

    },

    removeShape: function() {
      if (this._shape) {
        App.Map.removeShape(this._shape);
        delete this._shape;
      }
    },

    focusShape: function() {
      if (this._shape) {
        App.Map.focusShape(this._shape);
      }
    },

    unfocusShape: function() {
      if (this._shape) {
        App.Map.unfocusShape(this._shape);
      }
    },

    onClose: function() {
      this.removeShape();
    }

  });

  // Map View
  // --------
  //
  // Manages the map instance.

  Views.Map = Marionette.CollectionView.extend({
    id: 'gt-map',
    itemView: Views.Shape,

    onShow: function() {
      App.Map.start({ el: this.el });

      this.listenTo(App.vent, 'trigger:edit', this.hideShape);
      this.listenTo(App.vent, 'index trigger:new trigger:list trigger:edit', this.restore);
      this.listenTo(App.vent, 'trigger:focus', this.focusShape);
      this.listenTo(App.vent, 'trigger:unfocus', this.unfocusShape);
    },

    hideShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var view = this.children.findByModel(model);
      view.removeShape();
    },

    focusShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var view = this.children.findByModel(model);
      view.focusShape();
    },

    unfocusShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var view = this.children.findByModel(model);
      view.unfocusShape();
    },


    restore: function(id) {
      this.children.each(function(child, index, arr){
        if (!child._shape) {
          var currentId = child.model.get('triggerId');
          if (!(id && currentId === id)) {
            child.render();
          }
        }
      });
    }
  });

});