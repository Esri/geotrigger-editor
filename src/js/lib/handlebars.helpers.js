(function(Handlebars, $) {

  Handlebars.registerHelper('select', function(value, options) {
    // Create a select element
    var select = document.createElement('select');

    // Populate it with the option HTML
    select.innerHTML = options.fn(this);

    // Set the value
    select.value = value;

    // Find the selected node, if it exists, add the selected attribute to it
    if (select.children[select.selectedIndex]) {
      select.children[select.selectedIndex].setAttribute('selected', 'selected');
    }

    return select.innerHTML;
  });

  Handlebars.registerHelper('actionIcon', function(action) {
    if (action === 'enter') {
      return 'gt-icon-enter';
    } else if (action === 'leave') {
      return 'gt-icon-exit';
    }
  });

  Handlebars.registerHelper('unlessDefaultTag', function(conditional, options) {
    if(conditional.indexOf('trigger:') !== 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

}(Handlebars, $));