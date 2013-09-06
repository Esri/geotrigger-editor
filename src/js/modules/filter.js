GeotriggerEditor.module('Filter', function(Filter, App, Backbone, Marionette, $, _) {

  //this.startWithParent = false;

  // Filter Module
  // ----------

  _.extend(Filter, {
    handleFilter: function () {
      $('.gt-search > input').on('keyup', function (e) {

        var list = $('.gt-results').find('.gt-result');
        var value = this.value.split(' ');
        var values = '(?=.*' + value.join(')(?=.*') + ')';
        var regex = new RegExp(values, 'i');

        if ( !value.length ) {
          Filter._showAll();
        } else {
          for ( var i = 0; i < list.length; i++ ) {
            var item  = $(list[i]);
            var text  = "";
            var title = item.find('.gt-item-edit span')[0].innerHTML;
            var tags  = item.find('.gt-tags li');

            text += title;

            for (var j = 0; j < tags.length; j++){
              text += " " + tags[j].innerHTML;
            }

            if (value !== "" && !regex.exec(text)) {
              item.removeClass('gt-list-visible');
            } else {
              item.addClass('gt-list-visible');
            }
          }
        }
      });
    },
    _showAll: function() {
      $('.gt-result').addClass('gt-list-visible');
    }
});

  // Filter Initializer
  // ---------------

  Filter.addInitializer(function() {
    this.handleFilter();
    this._showAll();
  });

});