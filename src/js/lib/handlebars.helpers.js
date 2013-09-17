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

  Handlebars.registerHelper('selectShape', function(value, options) {
    // Create a select element
    var select = document.createElement('select');

    // Populate it with the option HTML
    select.innerHTML = options.fn(this);

    if (value.geo.geojson) {
      select.value = 'polygon';
    } else {
      select.value = 'radius';
    }

    // Find the selected node, if it exists, add the selected attribute to it
    if (select.children[select.selectedIndex]) {
      select.children[select.selectedIndex].setAttribute('selected', 'selected');
    }

    return select.innerHTML;
  });

  Handlebars.registerHelper('actionIcon', function(action, shape) {
    var classes = '';
    if (action === 'enter') {
      classes += 'gt-icon-enter ';
    } else if (action === 'leave') {
      classes += 'gt-icon-exit ';
    }
    if (shape.geojson) {
      classes += 'gt-icon-polygon ';
    }
    if (shape.distance) {
      classes += 'gt-icon-radius ';
    }
    return classes;
  });

  Handlebars.registerHelper('defaultTitle', function(trigger) {
    var title = '' + trigger.direction;
    if (trigger.geo.distance){
      title += ' ' + trigger.geo.distance + ' meter radius';
    } else if (trigger.geo.geojson) {
      var sides = trigger.geo.geojson.coordinates[0].length - 1;
      title += ' ' + sides + ' sided polygon';
    }
    title = title.charAt(0).toUpperCase() + title.slice(1);
    return title;
  });

  Handlebars.registerHelper('unlessDefaultTag', function(conditional, options) {
    if(conditional.indexOf('trigger:') !== 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('tagList', function(tags, options) {
    if (tags && tags.length) {
      var output = [];
      for (var i=0;i<tags.length;i++) {
        if (tags[i].indexOf('trigger:') !== 0) {
          output.push(tags[i]);
        }
      }
      return output.join(', ');
    } else {
      return 'no tags';
    }
  });

  Handlebars.registerHelper('tagLinks', function(tags, options) {
    if (tags && tags.length) {
      var output = [];
      for (var i=0;i<tags.length;i++) {
        if (tags[i].indexOf('trigger:') !== 0) {
          output.push('<a href="#list?q=' + encodeURIComponent(tags[i]).replace(/%20/g, '+') + '">' + tags[i] + '</a>');
        }
      }
      return output.join(', ');
    } else {
      return '';
    }
  });

}(Handlebars, $));