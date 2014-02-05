(function(App, Handlebars, $) {

  Handlebars.registerHelper('select', function(value, options) {
    // Create a select element
    var select = $('<select>');

    // Populate it with the option HTML
    select.html(options.fn(this));

    // Set the value
    select.find('option[value="' + value + '"]').attr('selected', 'selected');

    // Find the selected node, if it exists, add the selected attribute to it

    return select.html();
  });

  Handlebars.registerHelper('selectShape', function(value, options) {
    // Create a select element
    var select = $('<select>');

    // Populate it with the option HTML
    select.html(options.fn(this));

    var option;

    if (value && value.geo) {
      if (value.geo.distance) {
        option = 'radius';
      } else if (value.geo.geojson) {
        option = 'polygon';
      }
    }

    select.find('option[value="' + option + '"]').attr('selected', 'selected');

    return select.html();
  });

  Handlebars.registerHelper('shape', function(value, options) {
    var str = '';

    if (value && value.geo) {
      if (value.geo.distance) {
        str = 'radius';
      } else if (value.geo.geojson) {
        str = 'polygon';
      }
    }

    return str;
  });

  Handlebars.registerHelper('stringify', function(value) {
    return JSON.stringify(value);
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
    } else if (trigger.geo.geojson && trigger.geo.geojson.coordinates) {
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
      return '';
    }
  });

  Handlebars.registerHelper('tagLinks', function(tags, options) {
    if (tags && tags.length) {
      if (tags.length === 1 &&
          tags[0].indexOf('trigger:') === 0) {
        return '<strong>none</strong>';
      }
      var output = [];
      for (var i=0;i<tags.length;i++) {
        if (tags[i].indexOf('trigger:') !== 0) {
          output.push('<a href="#list/' + encodeURIComponent(tags[i]).replace(/%20/g, '+') + '">' + tags[i] + '</a>');
        }
      }
      return output.join(', ');
    } else {
      return '<strong>none</strong>';
    }
  });

}(Geotrigger.Editor, Handlebars, $));