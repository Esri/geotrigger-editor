// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function (con) {
  'use strict';
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = 'memory'.split(',');
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' +
     'time,timeEnd,trace,warn').split(',');
  while (prop = properties.pop()) { con[prop] = con[prop] || empty; }
  while (method = methods.pop()) { con[method] = con[method] || dummy; }
})(window.console = window.console || {});

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

}(Handlebars, $));

(function($) {
  return $.fn.serializeObject = function() {
    var json, patterns, push_counters,
      _this = this;
    json = {};
    push_counters = {};
    patterns = {
      validate: /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
      key: /[a-zA-Z0-9_]+|(?=\[\])/g,
      push: /^$/,
      fixed: /^\d+$/,
      named: /^[a-zA-Z0-9_]+$/
    };
    this.build = function(base, key, value) {
      base[key] = value;
      return base;
    };
    this.push_counter = function(key) {
      if (push_counters[key] === void 0) {
        push_counters[key] = 0;
      }
      return push_counters[key]++;
    };
    $.each($(this).serializeArray(), function(i, elem) {
      var k, keys, merge, re, reverse_key;
      if (!patterns.validate.test(elem.name)) {
        return;
      }
      keys = elem.name.match(patterns.key);
      merge = elem.value;
      reverse_key = elem.name;
      while ((k = keys.pop()) !== void 0) {
        if (patterns.push.test(k)) {
          re = new RegExp("\\[" + k + "\\]$");
          reverse_key = reverse_key.replace(re, '');
          merge = _this.build([], _this.push_counter(reverse_key), merge);
        } else if (patterns.fixed.test(k)) {
          merge = _this.build([], k, merge);
        } else if (patterns.named.test(k)) {
          merge = _this.build({}, k, merge);
        }
      }
      return json = $.extend(true, json, merge);
    });
    return json;
  };
})(jQuery);

L.Tooltip.prototype.updatePosition = function(latlng) {
  var pos = this._map.latLngToLayerPoint(latlng);

  L.DomUtil.setPosition(this._container, pos);
  this._container.style.display = 'inline-block';

  return this;
};

L.Polygon.prototype.getCenter = function() {
  var pts = this._latlngs;
  var off = pts[0];
  var twicearea = 0;
  var x = 0;
  var y = 0;
  var nPts = pts.length;
  var p1, p2;
  var f;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i];
    p2 = pts[j];
    f = (p1.lat - off.lat) * (p2.lng - off.lng) - (p2.lat - off.lat) * (p1.lng - off.lng);
    twicearea += f;
    x += (p1.lat + p2.lat - 2 * off.lat) * f;
    y += (p1.lng + p2.lng - 2 * off.lng) * f;
  }
  f = twicearea * 3;
  return new L.LatLng(
    x / f + off.lat,
    y / f + off.lng
  );
};

var GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  var el = options && options.el ? options.el : '#gt-editor';
  var layout = this.regions = new this.Layouts.Main();

  this.addRegions({ mainRegion: el });
  this.mainRegion.show(layout);
});


this["GeotriggerEditor"] = this["GeotriggerEditor"] || {};
this["GeotriggerEditor"]["Templates"] = this["GeotriggerEditor"]["Templates"] || {};

this["GeotriggerEditor"]["Templates"]["controls"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-drawer-controls\">\n  <a href=\"#list\" class=\"gt-tool gt-tool-list active gt-tooltip\"><span>List</span></a>\n  <a href=\"#new\" class=\"gt-tool gt-tool-create gt-tooltip\"><span>Create</span></a>\n</div>\n<div class=\"gt-tool-controls\">\n  <button class=\"gt-tool gt-tool-polygon gt-tooltip\"><span>Polygon</span></button>\n  <button class=\"gt-tool gt-tool-radius gt-tooltip\"><span>Radius</span></button>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["drawers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel gt-panel-list\"></div>\n<div class=\"gt-panel gt-panel-edit\"></div>\n<div class=\"gt-panel gt-panel-new\"></div>";
  });

this["GeotriggerEditor"]["Templates"]["edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  
  return "\n        <option value='enter'>enters</option>\n        <option value='leave'>leaves</option>\n        ";
  }

function program3(depth0,data) {
  
  
  return "\n        <option value='polygon'>a polygon</option>\n        <option value='radius'>a distance of</option>\n        ";
  }

function program5(depth0,data) {
  
  
  return "\n      <option value='notification'>send the device a message</option>\n      <option value='callbackUrl'>post to a server</option>\n      <option value='trackingProfile'>change tracking profile</option>\n      ";
  }

function program7(depth0,data) {
  
  
  return "\n        <option value='fine'>fine</option>\n        <option value='adaptive'>adaptive</option>\n        <option value='rough'>rough</option>\n        <option value='off'>off</option>\n        ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>Edit</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form>\n    <input type='text' name='properties[title]' placeholder='Title' class='gt-trigger-title-input' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n    <span class='gt-tag-label'>When a device tagged</span>\n    <input type='text' name='tags' placeholder='enter tags' class='gt-tag-input' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || depth0.tagList),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagList", depth0.tags, options)))
    + "'>\n\n    <label for='event' class='left'>\n      <select name='condition[direction]' class='gt-event'>\n        <option disabled='disabled'>select a condition</option>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n      <select name='geometry-type' class='gt-geometry-type'>\n        <option value='default' disabled='disabled'>select a geometry</option>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.selectShape || depth0.selectShape),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "selectShape", depth0.condition, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n    </label>\n\n    <select name='action-selector' class='gt-action'>\n      <option disabled='disabled'>choose an action</option>\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, depth0.action, options) : helperMissing.call(depth0, "select", depth0.action, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </select>\n    <span>:</span>\n\n    <label class='gt-action gt-action-message' for='message'>\n      <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n    </label>\n\n    <label class='gt-action gt-action-callback gt-hide' for='url'>\n      <input type='text' name='action[callbackUrl]' placeholder='url (optional)'>\n    </label>\n\n    <label class='gt-action gt-action-profile gt-hide' for='url'>\n      <span>to</span>\n      <select class='gt-action-profile-selector' name='action[trackingProfile]'>\n        <option disabled='disabled'>choose a tracking profile</option>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n    </label>\n    <button class='gt-button gt-button-blue gt-submit'>Update</button>\n  </form>\n  <a href=\"#\" class=\"gt-trigger-delete\">Delete</a>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel-top-bar\">\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-new-trigger\"></a>\n  <h3>No Geotriggers</h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n\n<div class=\"gt-panel-no-triggers\">\n  <h5>This application doesn't have any Geotriggers yet.</h5>\n   <a href=\"#new\" class=\"gt-tool gt-tool-create gt-button gt-button-green\">Create A New Trigger</a>\n</div>\n\n<ul class=\"gt-tool-descriptions\">\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-create\"></span>\n    <h5><a class=\"gt-tool gt-tool-create\"href=\"#\">New Geotrigger Tool</a></h5>\n    <p>Create a new Geotrigger by first entering it's information, than defining an area on the map.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-polygon\"></span>\n    <h5><a class=\"gt-tool gt-tool-polygon\"href=\"#\">Polygon Tool</a></h5>\n    <p>Click to start drawing on the map, creating each point of a polygon. Click on the first point to close the shape and enter the Geotrigger information.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-radius\"></span>\n    <h5><a class=\"gt-tool gt-tool-radius\"href=\"#\">Radius Tool</a></h5>\n    <p>Select a point on the map, than hold and drag to define a radius around that point. You can edit this radius later, if you want.</p>\n  </li>\n\n  <!-- <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-drivetime\"></span>\n    <h5><a class=\"gt-tool gt-tool-drivetime\"href=\"#\">Drivetime Tool</a></h5>\n    <p>Drop a marker on the map, and then enter your desired drive time from that marker. We'll compute that polygon for you.</p>\n  </li> -->\n</ul>\n\n";
  });

this["GeotriggerEditor"]["Templates"]["item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n    <span>untitled trigger</span>\n    ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  stack2 = ((stack1 = helpers.unlessDefaultTag || depth0.unlessDefaultTag),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "unlessDefaultTag", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  ";
  return buffer;
  }
function program6(depth0,data) {
  
  var buffer = "";
  buffer += "\n  <li>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</li>\n  ";
  return buffer;
  }

  buffer += "<span class=\"gt-item-edit gt-icon ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.actionIcon || depth0.actionIcon),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "actionIcon", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options)))
    + " gt-icon-polygon\"></span>\n<h5>\n  <a class=\"gt-item-edit\" href=\"#";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/edit\">\n    ";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </a>\n</h5>\n<ul class=\"gt-tags\">\n  ";
  stack2 = helpers.each.call(depth0, depth0.tags, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</ul>\n<ul class=\"gt-item-controls\">\n	<li><a class=\"gt-reset-delete\" href=\"#\">&#x2716;</a></li>\n	<li><button class=\"gt-item-delete gt-button-small gt-button-delete\"></button></li>\n</ul>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-list-header gt-hide\">\n  <div class=\"gt-panel-top-bar\">\n    <h3 class=\"gt-panel-top-bar-left\">List</h3>\n    <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n  </div>\n  <div class=\"gt-search\">\n    <input type=\"search\"></input>\n  </div>\n</div>\n<ul class=\"gt-results\"></ul>";
  });

this["GeotriggerEditor"]["Templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"gt-controls-region\"></div>\n<div id=\"gt-content\">\n  <div id=\"gt-drawer-region\"></div>\n  <div id=\"gt-map-region\"></div>\n</div>\n<div id=\"gt-notes-region\"></div>\n";
  });

this["GeotriggerEditor"]["Templates"]["new"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='gt-panel-top-bar'>\n  <h3 class='gt-panel-top-bar-left'>Create</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form>\n    <input type='text' name='properties[title]' placeholder='Title' class='gt-trigger-title-input'>\n    <span class='gt-tag-label'>When a device tagged</span>\n    <input type='text' name='setTags' placeholder='enter tags' class='gt-tag-input'>\n\n    <label for='event' class='left'>\n      <select name='condition[direction]' class='gt-event'>\n        <option disabled='disabled' selected>select a condition</option>\n        <option value='enter'>enters</option>\n        <option value='leave'>leaves</option>\n      </select>\n      <select name='geometry-type' class='gt-geometry-type'>\n        <option value='default' disabled='disabled' selected>select a geometry</option>\n        <option value='polygon'>a polygon</option>\n        <option value='radius'>a distance of</option>\n      </select>\n    </label>\n\n    <select class='gt-action-selector'>\n      <option disabled='disabled' selected>choose an action</option>\n      <option value='message'>send the device a message</option>\n      <option value='callback'>post to a server</option>\n      <option value='profile'>change tracking profile</option>\n    </select>\n    <span>:</span>\n\n    <label class='gt-action gt-action-message' for='message'>\n      <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'></textarea>\n    </label>\n\n    <label class='gt-action gt-action-callback gt-hide' for='url'>\n      <input type='text' name='action[callbackUrl]' placeholder='url (optional)'>\n    </label>\n\n    <label class='gt-action gt-action-profile gt-hide' for='url'>\n      <span>to</span>\n      <select class='gt-action-profile-selector' name='action[trackingProfile]'>\n        <option disabled='disabled' selected>choose a tracking profile</option>\n        <option value='fine'>fine</option>\n        <option value='adaptive'>adaptive</option>\n        <option value='rough'>rough</option>\n        <option value='off'>off</option>\n      </select>\n    </label>\n\n    <!--\n    <label for='date'>\n      This will start\n      <select class='gt-date-start'>\n        <option value='now'>now</option>\n        <option value='future'>in the future</option>\n      </select>\n      and persist\n      <select class='gt-date-end'>\n        <option value='never'>indefinitely</option>\n        <option value='future'>until a future date</option>\n      </select>\n    </label>\n    -->\n\n    <button class='gt-button gt-button-blue gt-submit'>Submit</button>\n  </form>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["notification"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button class=\"gt-close\">&times;</button> ";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

GeotriggerEditor.module('API', function(API, App, Backbone, Marionette, $, _) {

  API.addInitializer(function(options){
    try {
      if (!options ||
          !options.credentials ||
          !options.credentials.clientId ||
          !options.credentials.clientSecret) {
        throw new Error('GeotriggerEditor requires a `credentials` object with `clientId` and `clientSecret` properties');
      }

      this.session = new Geotriggers.Session({
        clientId: options.credentials.clientId, // required or session - this is the application id from developers.arcigs.com
        clientSecret: options.credentials.clientSecret, // optional - this will authenticate as your application with full permissions
        persistSession: false // optional - will attempt to persist the session and reload it on future page loads
      });

    } catch (e) {
      console.error(e.name + ": " + e.message);
    }
  });

});

GeotriggerEditor.module('Config', function(Config) {

  var sharedOptions = {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#00b1dc',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  };

  var editOptions = {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#00dcb1',
      weight: 2,
      opacity: 0.8,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  };

  _.extend(Config, {

    Map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions

  });

});

GeotriggerEditor.module('util', function(util, App, Backbone, Marionette, $, _) {

  // Utility Functions
  // -----------------
  //
  // General purpose helper functions.

  util.removeEmptyStrings = function(obj) {
    for (var key in obj) {

      // value is empty string
      if (obj[key] === '') {
        delete obj[key];
      }

      // value is array with only empty strings
      if (obj[key] instanceof Array) {
        var empty = true;
        for(var i = 0; i < obj[key].length; i++) {
            if(obj[key][i] !== '') {
              empty = false;
              break;
            }
        }
        if (empty) {
          delete obj[key];
        }
      }

      // value is object with only empty strings or arrays of empty strings
      if (typeof obj[key] === "object") {
        obj[key] = util.removeEmptyStrings(obj[key]);
        var hasKeys = false;
        for (var objKey in obj[key]) {
          hasKeys = true;
          break;
        }
        if (!hasKeys) {
          delete obj[key];
        }
      }
    }

    return obj;
  };

});


GeotriggerEditor.module('Map.Draw', function(Draw, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Draw Submodule
  // --------------

  _.extend(Draw, {

    _tools: {
      polygon: null,
      radius: null
    },

    _setup: function() {
      // Initialize new Draw Handlers
      this._tools.polygon = new L.Draw.Polygon(App.map, App.Config.editOptions);
      this._tools.radius = new L.Draw.Circle(App.map, App.Config.editOptions);

      this._eventBindings();
    },

    _eventBindings: function() {
      App.vent.on('draw:new', function(layer) {
        this.editLayer(layer);
      }, this);

      App.vent.on('index trigger:list trigger:edit', function(){
        this.clear();
      }, this);

      App.vent.on('trigger:edit', function(triggerId) {
        var layer = this.newShape(triggerId);
        this.editLayer(layer);
        // App.Map.panToLayer(layer);
      }, this);

      App.map.on('draw:created', function(e) {
        var type = e.layerType;
        var layer = e.layer;

        App.vent.trigger('draw:new', layer);
      });

      App.reqres.setHandler('draw:layer', _.bind(function(){
        return App.Map.Layers.edit.getLayers()[0];
      }, this));

      App.commands.setHandler('draw:clear', _.bind(function(){
        this.clear();
      }, this));

      App.commands.setHandler('draw:enable', _.bind(function(tool){
        this.enableTool(tool);
      }, this));

      App.commands.setHandler('draw:disable', _.bind(function(tool){
        this.disableTool(tool);
      }, this));
    },

    newShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.Config.editOptions.shapeOptions, false).getLayers()[0];
      } else {
        shape = App.Map.circle(geo, App.Config.editOptions.shapeOptions, false);
      }

      return shape;
    },

    editLayer: function(layer) {
      this.clear();
      layer.editing.enable();
      App.Map.Layers.edit.addLayer(layer);
    },

    clear: function() {
      App.Map.Layers.edit.clearLayers();
    },

    enableTool: function(name) {
      this.disableTool();
      this._tools[name].enable();
    },

    disableTool: function(name) {
      for (var i in this._tools) {
        if (typeof name === 'undefined' || i === name) {
          this._tools[i].disable();
        }
      }
    }

  });

  // Draw Layer initializer
  // ----------------------

  Draw.addInitializer(function() {
    this._setup();
  });

});


GeotriggerEditor.module('Editor', function(Editor, App, Backbone, Marionette, $, _) {

  // Editor Router
  // ---------------
  //
  // Handle routes to show the active vs complete todo items

  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'index',
      'list': 'list',
      'new': 'new',
      ':id/edit': 'edit',
      '*notfound': 'notFound'
    }
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function() {
    App.collections = App.collections || {};
    App.collections.triggers = new App.Collections.Triggers();
    App.collections.notifications = new App.Collections.Notifications();
  };

  _.extend(Controller.prototype, {

    // initialization
    start: function() {
      this.setup();

      App.vent.trigger('notify', 'Triggers loading');

      App.collections.triggers.fetch({
        reset: true,
        success: function() {
          App.vent.trigger('notify:clear');
          App.execute('map:fit');
          Backbone.history.start();
        }
      });

      App.vent.on('draw:new', function(options){
        if (Backbone.history.fragment === 'new' ||
            Backbone.history.fragment.match('edit')) {
        } else {
          App.router.navigate('new', { trigger: true });
        }
      }, this);

      App.vent.on('trigger:create', this.createTrigger, this);
      App.vent.on('trigger:update', this.updateTrigger, this);
      App.vent.on('trigger:destroy', this.deleteTrigger, this);
    },

    // setup

    setup: function() {
      this.setupMap();
      this.setupDrawer();
      this.setupControls();
      this.setupNotifications();
    },

    setupMap: function() {
      var view = new App.Views.Map({ collection: App.collections.triggers });
      App.regions.map.show(view);
    },

    setupDrawer: function() {
      var drawer = App.regions.drawer;
      var content = App.mainRegion.$el.find('#gt-content');

      drawer.on('show', function(){
        content.addClass('gt-active');
        App.map.invalidateSize();
      });

      drawer.on('close', function(){
        content.removeClass('gt-active');
        App.map.invalidateSize();
      });
    },

    setupControls: function() {
      var view = new App.Views.Controls();
      App.regions.controls.show(view);
    },

    setupNotifications: function() {
      var view = new App.Views.NotificationList({
        collection: App.collections.notifications
      });

      App.regions.notes.show(view);

      App.vent.on('notify', function(options){
        if (typeof options === 'string') {
          options = {
            type: 'info',
            message: options
          };
        }

        var note = new App.Models.Notification(options);
        App.collections.notifications.add(note);
      }, this);
    },

    // routes

    index: function() {
      App.vent.trigger('index');

      App.regions.drawer.close();
    },

    list: function() {
      App.vent.trigger('trigger:list');

      var view = new App.Views.List({ collection: App.collections.triggers });
      App.regions.drawer.show(view);
    },

    new: function() {
      App.vent.trigger('trigger:new');

      var view = new App.Views.New();
      App.regions.drawer.show(view);
    },

    edit: function(triggerId) {
      var model = this.getTrigger(triggerId);

      if (!model) {
        this.notFound();
      } else {
        var view = new App.Views.Edit({ model: model });
        App.regions.drawer.show(view);
        App.vent.trigger('trigger:edit', triggerId);
      }
    },

    notFound: function() {
      App.vent.trigger('notify', {
        type: 'error',
        message: '404: Not Found'
      });
    },

    // crud

    createTrigger: function(triggerData) {
      App.collections.triggers.once('add', function(data){
        App.router.navigate('list', { trigger: true });
      });
      App.collections.triggers.create(triggerData, { wait: true });
    },

    getTrigger: function(id) {
      var model = App.collections.triggers.get(id);
      return model;
    },

    updateTrigger: function(triggerData) {
      App.collections.triggers.once('change', function(data){
        App.router.navigate('list', { trigger: true });
      });
      var model = App.collections.triggers.get(triggerData.triggerId);
      model.set(triggerData);
      model.save();
    },

    deleteTrigger: function(model) {
      App.collections.triggers.once('remove', function(data){
        if (Backbone.history.fragment.match('edit')) {
          App.router.navigate('list', { trigger: true });
        }
      });
      model.destroy();
    }
  });

  // Editor Initializer
  // ------------------
  //
  // Get the Editor up and running by initializing the mediator
  // when the the application is started, pulling in all of the
  // existing geotriggers and displaying them.

  Editor.addInitializer(function() {
    var controller = new Controller();
    App.router = new Router({ controller: controller });
    controller.start();
  });

});

GeotriggerEditor.module('Map.Layers', function(Layers, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Layers Submodule
  // ----------------

  _.extend(Layers, {

    _setup: function() {
      this.main = new L.FeatureGroup();
      App.map.addLayer(this.main);

      this.edit = new L.FeatureGroup();
      App.map.addLayer(this.edit);
    }

  });

  // Layers initializer
  // ------------------

  Layers.addInitializer(function() {
    this._setup();
  });

});


GeotriggerEditor.module('Map', function(Map, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // Map Module
  // ----------

  _.extend(Map, {

    _setup: function(options) {
      // L.Icon.Default.imagePath = App.Config.imagePath;
      App.map = this.map = L.map(options.el).setView(App.Config.Map.center, App.Config.Map.zoom);
      this.map.zoomControl.setPosition('topright');
      L.esri.basemapLayer(App.Config.Map.basemap).addTo(App.map);

      this.Layers.start();
      this._eventBindings();
    },

    _eventBindings: function() {
      App.commands.setHandler('map:fit', _.bind(function(){
        this.map.fitBounds(this.Layers.main.getBounds());
      }, this));
    },

    panToLayer: function(layer) {
      var latlng;

      if (layer.getLatLng) {
        latlng = layer.getLatLng();
      } else if (layer.getCenter) {
        latlng = layer.getCenter();
      }

      if (latlng) {
        this.map.panTo(latlng, {
          animate: false
        });
      }
    },

    zoomToLayer: function(layer) {
      this.map.fitBounds(layer.getBounds(), {
        padding: [60, 60]
      });
    },

    removeShape: function(shape) {
      this.map.removeLayer(shape);
    },

    polygon: function(geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.Config.sharedOptions.shapeOptions;
      var polygon = new L.GeoJSON(geo, {
        style: function(feature) {
          return shapeOptions;
        }
      });

      if (add !== false) {
        this.Layers.main.addLayer(polygon);
      }

      return polygon;
    },

    circle: function(geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.Config.sharedOptions.shapeOptions;
      var circle = L.circle(
        [geo.latitude, geo.longitude],
        geo.distance,
        shapeOptions
      );

      if (add !== false) {
        this.Layers.main.addLayer(circle);
      }

      return circle;
    },
  });

  // Map Initializer
  // ---------------

  Map.addInitializer(function(options) {
    this._setup(options);
    this.Draw.start();
  });

});

GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Notification Model
  // ------------------

  Models.Notification = Backbone.Model.extend({

    defaults: {
      'type': 'info',
      'message': 'everything\'s fine'
    }

  });

});

GeotriggerEditor.module('Models', function(Models, App, Backbone, Marionette, $, _) {

  // Trigger Model
  // -------------

  Models.Trigger = Backbone.Model.extend({

    idAttribute: 'triggerId',

    // override sync method to use geotrigger API
    sync: function(method, model, options) {
      console.log('sync:' + method);

      var triggerId = this.get('triggerId');

      var callback = _.bind(function(error, response) {
        if (error) {
          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else {
          if (method !== 'read') {
            App.vent.trigger('notify', 'Trigger ' + method + 'd successfully');
          }
          if (options && options.success) {
            options.success(response);
          }
        }
      }, this);

      var request = function(route, params) {
        App.API.session.request(route, {
          params: params,
          callback: callback
        });
      };

      switch (method) {
        case 'read':
          request('trigger/list', { 'triggerIds': [ triggerId ] });
          break;
        case 'create':
          request('trigger/create', model.toJSON());
          break;
        case 'update':
          var params = {
            'properties': this.get('properties'),
            'triggerIds': triggerId,
            'condition': this.get('condition'),
            'action': this.get('action'),
            'setTags': this.get('tags')
          };
          request('trigger/update', params);
          break;
        case 'delete':
          request('trigger/delete', { 'triggerIds': triggerId });
          break;
      }
    }

  });

});

GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Notifications Collection
  // ------------------------

  Collections.Notifications = Backbone.Collection.extend({
    model: App.Models.Notification
  });

});

GeotriggerEditor.module('Collections', function(Collections, App, Backbone, Marionette, $, _) {

  // Trigger Collection
  // ------------------

  Collections.Triggers = Backbone.Collection.extend({
    model: App.Models.Trigger,

    fetch: function(options) {
      var callback = _.bind(function(error, response) {
        if(options.reset){
          this.reset(this.parse(response));
        } else {
          this.set(this.parse(response));
        }

        if (options.success) {
          options.success(this, this.parse(response), options);
        }
      }, this);

      App.API.session.request('trigger/list', {
        callback: callback
      });
    },

    parse: function(response) {
      return response.triggers;
    }
  });

});


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


GeotriggerEditor.module('Layouts', function(Layouts, App, Backbone, Marionette, $, _) {

  // Layout Drawer View
  // ------------------

  Layouts.Main = Backbone.Marionette.Layout.extend({
    template: App.Templates['main'],
    id: 'gt-regions',

    regions: {
      'controls' : '#gt-controls-region',
      'drawer'   : '#gt-drawer-region',
      'map'      : '#gt-map-region',
      'notes'    : '#gt-notes-region'
    }
  });

});


GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Controls View
  // -------------
  //
  // Displays controls and handles state of drawer and tools.

  Views.Controls = Marionette.ItemView.extend({
    template: App.Templates['controls'],
    className: 'gt-control-group',

    events: {
      'click .gt-tool-list'       : 'toggleList',
      'click .gt-tool-create'     : 'toggleNew',
      'click .gt-tool-polygon'    : 'togglePolygon',
      'click .gt-tool-radius'     : 'toggleRadius'
    },

    ui: {
      'drawers' : '.gt-drawer-controls',
      'tools'   : '.gt-tool-controls',
      'list'    : '.gt-drawer-controls .gt-tool-list',
      'create'  : '.gt-drawer-controls .gt-tool-create',
      'polygon' : '.gt-tool-controls .gt-tool-polygon',
      'radius'  : '.gt-tool-controls .gt-tool-radius',
      'all'     : '.gt-tool'
    },

    onRender: function() {
      this.listenTo(App.router, 'route', this.handleStateChange);
      this.listenTo(App.vent, 'draw:new', this.disableTool);
    },

    handleStateChange: function(route) {
      this.clear('drawers');
      switch (route) {
        case 'new':
          this.activate('create');
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

    toggleList: function(e) {
      if (this.ui.list.hasClass('gt-active')) {
        e.preventDefault();
        App.router.navigate('', { trigger: true });
      }
    },

    toggleNew: function(e) {
      if (this.ui.create.hasClass('gt-active')) {
        e.preventDefault();
        App.router.navigate('', { trigger: true });
      }
    },

    // tools

    togglePolygon: function(e) {
      if (this.ui.polygon.hasClass('gt-active')) {
        this.disableTool('polygon');
      } else {
        this.activateTool('polygon');
      }
    },

    toggleRadius: function(e) {
      if (this.ui.radius.hasClass('gt-active')) {
        this.disableTool('radius');
      } else {
        this.activateTool('radius');
      }
    },

    activateTool: function(name) {
      this.disableTool();
      App.execute('draw:enable', name);
      this.activate(name);
    },

    disableTool: function(name) {
      if (name) {
        App.execute('draw:disable', name);
      }
      this.ui.tools.find('.gt-tool').removeClass('gt-active');
    },

    // helpers

    activate: function(name) {
      this.ui[name].addClass('gt-active');
    },

    toggle: function(name) {
      if (name === 'list') {
        this.ui.list.toggleClass('gt-active');
        this.ui.create.removeClass('gt-active');
      } else if (name === 'create') {
        this.ui.create.toggleClass('gt-active');
        this.ui.list.removeClass('gt-active');
      }
    },

    clear: function(name) {
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

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger Edit View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.
  //
  // @TODO: decouple shape from view (get rid of `restoreShape`)

  Views.Edit = Marionette.ItemView.extend({
    template: App.Templates['edit'],
    className: 'gt-edit gt-panel',

    events: {
      'change .gt-geometry-type'   : 'startDrawing',
      'change .gt-action-selector' : 'toggleActions',
      'click .gt-submit'           : 'parseForm',
      'click .gt-trigger-delete'   : 'destroyModel'
    },

    ui: {
      'actions' : '.gt-action',
      'form'    : 'form'
    },

    startDrawing: function (e) {
      var tool = $(e.target).val();
      App.execute('draw:clear');
      App.execute('draw:enable', tool);
    },

    toggleActions: function(e) {
      var action = $(e.target).val();
      this.ui.actions.hide();
      this.$el.find('.gt-action-' + action).show();
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.ui.form.serializeObject();
      data = App.util.removeEmptyStrings(data);

      if (data.tags) {
        var tags = data.tags;
        tags = tags.split(',');
        for (var i=tags.length-1;i>0;i--) {
          tags[i] = tags[i].trim();
        }
        data.tags = tags;
      }

      if (data) { // @TODO: validate
        this.updateTrigger(data);
      }
    },

    updateTrigger: function(data) {
      var layer = App.request('draw:layer');

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        data.condition.geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        data.condition.geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      data.triggerId = this.model.get('triggerId');

      App.vent.trigger('trigger:update', data);
    },

    destroyModel: function(e) {
      e.preventDefault();
      App.vent.trigger('trigger:destroy', this.model);
    }
  });

});

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
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    ui: {
      'deleteItem' : '.gt-item-delete',
      'confirm'    : '.gt-item-confirm-delete',
      'reset'      : '.gt-reset-delete'
    },

    modelEvents: {
      'change': 'modelChanged'
    },

    modelChanged: function() {
      this.render();
    },

    confirmDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout');
    },

    resetDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout');
    },

    destroyModel: function(e) {
      e.preventDefault();
      App.vent.trigger('trigger:destroy', this.model);
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
      'keyup .gt-search' : 'filter'
    },

    ui: {
      'header'  : '.gt-list-header',
      'search'  : '.gt-search input',
      'results' : '.gt-results'
    },

    onShow: function() {
      this.headerCheck();
      this.listenTo(this.collection, 'change reset add remove', this.headerCheck);
    },

    headerCheck: function() {
      if (!this.collection.length) {
        this.ui.header.addClass('gt-hide');
      } else {
        this.ui.header.removeClass('gt-hide');
      }
    },

    filter: function(e) {
      var value = this.ui.search.val();

      if (!value.length) {
        this.ui.results.removeClass('gt-filtering');
      } else {
        this.ui.results.addClass('gt-filtering');

        var list = this.ui.results.find('.gt-result');
        var arr = this.ui.search.val().split(/\s+/);
        var values = '(?=.*' + arr.join(')(?=.*') + ')';
        var regex = new RegExp(values, 'i');

        list.each(function(){
          var item = $(this);
          var tags  = item.find('.gt-tags li');
          var text = "";

          text += item.find('.gt-item-edit span').text();

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
        App.router.navigate(this.model.id + '/edit', { trigger: true });
      }, this));
    },

    removeShape: function() {
      if (this._shape) {
        App.Map.removeShape(this._shape);
        delete this._shape;
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
    },

    hideShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var view = this.children.findByModel(model);
      view.removeShape();
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

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Trigger New View
  // ----------------
  //
  // Handles the new trigger form.
  //
  // @TODO: merge with edit view as behavior is near-identical
  //        (or come up with inheritance scheme)

  Views.New = Marionette.ItemView.extend({
    template: App.Templates['new'],
    className: 'gt-new gt-panel',

    events: {
      'change .gt-geometry-type'   : 'startDrawing',
      'change .gt-action-selector' : 'toggleActions',
      'click .gt-submit'           : 'parseForm'
    },

    ui: {
      'actions' : '.gt-action',
      'form'    : 'form'
    },

    onShow: function(options) {
      var layer = App.request('draw:layer');
      // convert layer information into form data if it exists
    },

    startDrawing: function(e) {
      var tool = $(e.target).val();
      App.execute('draw:clear');
      App.execute('draw:enable', tool);
    },

    toggleActions: function(e) {
      var action = $(e.target).val();
      this.ui.actions.hide();
      this.$el.find('.gt-action-' + action).show();
    },

    parseForm: function(e) {
      e.preventDefault();
      var data = this.ui.form.serializeObject();
      data = App.util.removeEmptyStrings(data);

      if (data.tags) {
        var tags = data.tags;
        tags = tags.split(',');
        for (var i=tags.length-1;i>0;i--) {
          tags[i] = tags[i].trim();
        }
        data.tags = tags;
      }

      if (data) { // @TODO: validate
        this.createTrigger(data);
      }
    },

    createTrigger: function(data) {
      var layer = App.request('draw:layer');

      if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        data.condition.geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': layer.getRadius()
        };
      } else {
        data.condition.geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      App.vent.trigger('trigger:create', data);
    }
  });

});

GeotriggerEditor.module('Views', function(Views, App, Backbone, Marionette, $, _) {

  // Notification View
  // -----------------
  //
  // Creates panel for delivering success, failure, and contextual messages.

  Views.Notification = Marionette.ItemView.extend({
    template: App.Templates['notification'],
    className: 'gt-notification',
    tagName: 'li',

    events: {
      'click .gt-close': 'destroyNotification'
    },

    render: function() {
      Marionette.ItemView.prototype.render.apply(this, arguments);

      var type = this.model.get('type');
      this.$el.addClass(type);

      this.listenTo(App.vent, 'notify:clear', this.destroyNotification);
    },

    destroyNotification: function() {
      this.model.destroy();
    }
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
