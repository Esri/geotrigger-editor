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

}(Handlebars, $));