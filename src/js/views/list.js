GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger List Item View
  // ----------------------
  //
  // Displays an individual trigger list item, and responds to changes that are made to the trigger.

  Views.ListItem = Marionette.ItemView.extend({
    template: App.Templates['item'],
    tagName: 'li',
    className: 'gt-result',

    events: {
      'click .gt-item-edit'           : 'editItem',
      'click .gt-tags'                : 'tagsClick',
      'click .gt-delete-icon'         : 'confirmDelete',
      'click .gt-cancel-delete'       : 'resetDelete',
      'click .gt-confirm-delete'      : 'destroyModel',
      'mouseover'                     : 'focusShape',
      'mouseout'                      : 'unfocusShape'
    },

    ui: {
      'deleteItem' : '.gt-list-delete',
      'confirm'    : '.gt-item-confirm-delete',
      'reset'      : '.gt-reset-delete'
    },

    modelEvents: {
      'change': 'modelChanged'
    },

    modelChanged: function() {
      this.render();
    },

    editItem: function() {
      var id = this.model.get('triggerId');
      App.router.navigate(id + '/edit', { trigger: true });
    },

    tagsClick: function(e) {
      e.stopPropagation();
      console.log(this.model);
    },

    confirmDelete: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.deleteItem.addClass('gt-visible');
    },

    resetDelete: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.deleteItem.removeClass('gt-visible');
      console.log("what up");
    },

    destroyModel: function(e) {
      e.preventDefault();
      e.stopPropagation();
      App.vent.trigger('trigger:destroy', this.model);
    },

    focusShape: function(){
      var id = this.model.get('triggerId');
      App.vent.trigger('trigger:focus', id);
    },

    unfocusShape: function(){
      var id = this.model.get('triggerId');
      App.vent.trigger('trigger:unfocus', id);
    }
  });

  // Trigger List Empty View
  // ----------------------
  //
  // Displays some helpful information when no triggers are found.

  Views.Empty = Marionette.ItemView.extend({
    template: App.Templates['empty'],
    className: 'gt-list-empty'
  });

  // Trigger List View
  // -----------------
  //
  // Controls the rendering of the list of items.

  Views.List = Marionette.CompositeView.extend({
    template: App.Templates['list'],
    className: 'gt-list gt-panel',
    itemView: Views.ListItem,
    itemViewContainer: '.gt-results',
    emptyView: Views.Empty,

    events: {
      'keyup .gt-search'     : 'filter',
      'click .gt-icon-clear' : 'clearFilter'
    },

    ui: {
      'header'     : '.gt-list-header',
      'search'     : '.gt-search input',
      'results'    : '.gt-results',
      'searchBar'  : '.gt-search'
    },

    onShow: function() {
      this.headerCheck();
      this.listenTo(this.collection, 'change reset add remove', this.headerCheck);
      this.listenTo(App.vent, 'trigger:list:search', this.search);
    },

    headerCheck: function() {
      if (!this.collection.length) {
        this.ui.header.addClass('gt-hide');
      } else {
        this.ui.header.removeClass('gt-hide');
      }
    },

    search: function(term) {
      this.ui.search.val(term);
      this.filter();
    },

    clearFilter: function() {
      this.ui.search.val('');
      this.ui.results.removeClass('gt-filtering');
      this.ui.searchBar.removeClass('gt-filtering');
      if (Backbone.history.fragment !== 'list') {
        App.router.navigate('list', { trigger: false });
      }
    },

    filter: function(e) {
      var value = this.ui.search.val();

      if (!value.length) {
        this.ui.results.removeClass('gt-filtering');
        if (Backbone.history.fragment !== 'list') {
          App.router.navigate('list', { trigger: false });
        }
      } else if (typeof e !== 'undefined' && e.keyCode === 13) {
        App.router.navigate('list?q=' + encodeURIComponent(value).replace(/%20/g, '+'), { trigger: true });
      } else {
        this.ui.results.addClass('gt-filtering');
        this.ui.searchBar.addClass('gt-filtering');

        var list = this.ui.results.find('.gt-result');
        var arr = this.ui.search.val().split(/\s+/);
        var values = '(?=.*' + arr.join(')(?=.*') + ')';
        var regex = new RegExp(values, 'i');

        list.each(function(){
          var item = $(this);
          var tags = item.find('.gt-tags a');
          var text = '';

          text += item.find('.gt-item-edit span').text();
          text += item.find('.gt-id').text();
          text += item.find('.gt-item-details span').text();

          tags.each(function(){
            text += $(this).text();
          });

          if (regex.exec(text)) {
            item.addClass('gt-list-visible');
          } else {
            item.removeClass('gt-list-visible');
          }
        });
      }
    }
  });

});