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
  


  return "<div class=\"gt-drawer-controls\">\n  <a href=\"#list\" class=\"gt-tool gt-tool-list active gt-tooltip\"><span>List</span></a>\n  <!-- <a href=\"#new\" class=\"gt-tool gt-tool-create gt-tooltip\"><span>Create</span></a> -->\n</div>\n<div class=\"gt-tool-controls\">\n  <button class=\"gt-tool gt-tool-polygon gt-tooltip\"><span>Polygon</span></button>\n  <button class=\"gt-tool gt-tool-radius gt-tooltip\"><span>Radius</span></button>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["drawers"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel gt-panel-list\"></div>\n<div class=\"gt-panel gt-panel-edit\"></div>\n<div class=\"gt-panel gt-panel-new\"></div>";
  });

this["GeotriggerEditor"]["Templates"]["empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"gt-panel-top-bar\">\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-new-trigger\"></a>\n  <h3>No Geotriggers</h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n\n<div class=\"gt-panel-no-triggers\">\n  <h5>This application doesn't have any Geotriggers yet.</h5>\n   <a href=\"#new\" class=\"gt-tool gt-tool-create gt-button gt-button-green\">Create A New Trigger</a>\n</div>\n\n<ul class=\"gt-tool-descriptions\">\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-create\"></span>\n    <h5><a class=\"gt-tool gt-tool-create\"href=\"#\">New Geotrigger Tool</a></h5>\n    <p>Create a new Geotrigger by first entering it's information, than defining an area on the map.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-polygon\"></span>\n    <h5><a class=\"gt-tool gt-tool-polygon\"href=\"#\">Polygon Tool</a></h5>\n    <p>Click to start drawing on the map, creating each point of a polygon. Click on the first point to close the shape and enter the Geotrigger information.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-radius\"></span>\n    <h5><a class=\"gt-tool gt-tool-radius\"href=\"#\">Radius Tool</a></h5>\n    <p>Select a point on the map, than hold and drag to define a radius around that point. You can edit this radius later, if you want.</p>\n  </li>\n\n  <!-- <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-drivetime\"></span>\n    <h5><a class=\"gt-tool gt-tool-drivetime\"href=\"#\">Drivetime Tool</a></h5>\n    <p>Drop a marker on the map, and then enter your desired drive time from that marker. We'll compute that polygon for you.</p>\n  </li> -->\n</ul>\n\n";
  });

this["GeotriggerEditor"]["Templates"]["form/actions/callbackUrl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-action-type=\"callbackUrl\" class='gt-property'>\n  <div class=\"gt-property-header\">\n    notify this URL\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-property-item\">\n    <input class='gt-input-fill' type='text' name='action[callbackUrl]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.callbackUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/data"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification-type='data' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][data]'>\n    <span class='gt-label-left'>data:</span>\n  </label>\n\n  <div class=\"gt-notification-center\">\n    <textarea class='gt-input' name='action[notification][data]' placeholder='{ \"your\": \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/icon"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification-type='icon' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][icon]'>\n    <span class='gt-label-left'>icon:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/index"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div data-action-type=\"notification\" class=\"gt-property\">\n  <div class=\"gt-property-header\">\n    send a notification to the device\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-notification-actions\"></div>\n\n  <button class=\"gt-button gt-button-gray gt-button-small gt-add-notification\">&#043;</button>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/sound"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification-type='sound' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][sound]'>\n    <span class='gt-label-left'>sound:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/text"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification-type='text' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][text]'>\n    <span class='gt-label-left'>text:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/url"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification-type='url' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][url]'>\n    <span class='gt-label-left'>URL:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/trackingProfile"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n      <option value=\"fine\">[3] fine</option>\n      <option value=\"adaptive\">[2] adaptive</option>\n      <option value=\"rough\">[1] rough</option>\n      <option value=\"off\">[0] off</option>\n      ";
  }

  buffer += "<div data-action-type=\"trackingProfile\" class=\"gt-property\">\n  <div class=\"gt-property-header\">\n    change the device's tracking profile\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-property-item\">\n    <select class=\"gt-select-full\" name=\"action[trackingProfile]\">\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </select>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/index"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";

function program1(depth0,data) {
  
  
  return "Edit";
  }

function program3(depth0,data) {
  
  
  return "Create";
  }

function program5(depth0,data) {
  
  
  return "\n              <option value='enter'>enters</option>\n              <option value='leave'>leaves</option>\n              ";
  }

function program7(depth0,data) {
  
  
  return "\n              <option value='polygon'>polygon</option>\n              <option value='radius'>circle</option>\n              ";
  }

function program9(depth0,data) {
  
  
  return " gt-hide";
  }

function program11(depth0,data) {
  
  
  return "\n      <button class='gt-button gt-button-blue gt-submit'>Update</button>\n      <ul class='gt-edit-controls'>\n        <li>\n          <a class='gt-reset-delete' href='#'>&#x2716;</a>\n        </li>\n        <li>\n          <button class='gt-item-delete gt-button-delete'></button>\n        </li>\n      </ul>\n      ";
  }

function program13(depth0,data) {
  
  
  return "\n      <button class='gt-button gt-button-blue gt-submit' disabled>Save</button>\n      ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>";
  stack1 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-edit'>\n\n    <section class='gt-form-section gt-conditions'>\n      <div data-action-type=\"notification\" class=\"gt-property\">\n        <div class=\"gt-property-header\">\n          When a device tagged..\n        </div>\n\n        <div class=\"gt-property-item\">\n          <textarea class='gt-input' name='tags' placeholder='enter tags'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || depth0.tagList),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagList", depth0.tags, options)))
    + "</textarea>\n        </div>\n\n        <div class=\"gt-property-item\">\n            <select name='condition[direction]' class='gt-direction'>\n              ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </select>\n\n            <span class=\"gt-conjunction\">a</span>\n\n            <select name='geometry-type' class='gt-input-right'>\n              ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.selectShape || depth0.selectShape),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "selectShape", depth0.condition, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </select>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"gt-form-section gt-actions\"></section>\n\n    <section class=\"gt-form-section\">\n      <button class=\"gt-button gt-button-light-gray gt-button-small gt-add-action\">&#043; add an action</button>\n    </section>\n\n    <section class=\"gt-form-section gt-title-wrapper\">\n      <button class=\"gt-button gt-button-light-gray gt-button-small gt-add-title";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">&#043; add a title</button>\n\n      <div class='gt-title gt-property";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "'>\n        <div class=\"gt-property-header\">\n          Title\n          <a class=\"gt-remove-title gt-delete-icon\"></a>\n        </div>\n\n        <div class=\"gt-property-item\">\n          <input class='gt-input-fill' type='text' name='properties[title]' placeholder='Trigger Title' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n        </div>\n      </div>\n    </section>\n\n    <section class='gt-form-section gt-submit-wrapper'>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.program(13, program13, data),fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </section>\n  </form>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["item"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n      <span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.defaultTitle || depth0.defaultTitle),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "defaultTitle", depth0.condition, options)))
    + "</span>\n    ";
  return buffer;
  }

function program5(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program7(depth0,data) {
  
  var stack1, options;
  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.defaultTitle || depth0.defaultTitle),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "defaultTitle", depth0.condition, options)));
  }

  buffer += "<span class='gt-item-edit gt-icon ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.actionIcon || depth0.actionIcon),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.geo), options) : helperMissing.call(depth0, "actionIcon", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.geo), options)))
    + " gt-icon-polygon'></span>\n<h5>\n  <a class='gt-item-edit' href='#";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/edit'>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </a>\n</h5>\n<div class='gt-item-toolbar'>\n  <a class='gt-edit-icon' href='#";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/edit'></a>\n  <a class='gt-delete-icon' href='#'></a>\n</div>\n<div class='gt-tags'>\n  <strong>Tags</strong><span>:</span> ";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.tagLinks || depth0.tagLinks),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagLinks", depth0.tags, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n<div class='gt-id'>\n  <strong>ID</strong><span>:</span> ";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n</div>\n<div class='gt-list-delete'>\n  <h5>Delete ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "?</h5>\n  <button class='gt-confirm-delete gt-button-small gt-button-delete'>Delete</button>\n  <button class='gt-cancel-delete gt-button-small gt-button gt-button-gray'>Cancel</button>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='gt-list-header gt-hide'>\n  <div class='gt-panel-top-bar'>\n    <a href='#new' class='gt-button gt-button-blue gt-tool-create'>Create</a>\n    <h3 class='gt-panel-top-bar-left'>List</h3>\n    <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n  </div>\n  </div>\n  <div class='gt-search'>\n    <input type='search' placeholder='Search'><a href=\"#list\" class=\"gt-icon-clear\"></a>\n  </div>\n<ul class='gt-results'></ul>";
  });

this["GeotriggerEditor"]["Templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id='gt-controls-region'></div>\n<div id='gt-content'>\n  <div id='gt-drawer-region'></div>\n  <div id='gt-map-region'></div>\n  <div id='gt-notes-region'></div>\n</div>\n";
  });

this["GeotriggerEditor"]["Templates"]["notification"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<button class='gt-close'>&times;</button> ";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["oldform"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function";

function program1(depth0,data) {
  
  
  return "Edit";
  }

function program3(depth0,data) {
  
  
  return "Create";
  }

function program5(depth0,data) {
  
  
  return "\n            <option value='enter'>enters</option>\n            <option value='leave'>leaves</option>\n            ";
  }

function program7(depth0,data) {
  
  
  return "\n            <option value='polygon'>polygon</option>\n            <option value='radius'>circle</option>\n            ";
  }

function program9(depth0,data) {
  
  
  return "\n          <option value='fine'>fine</option>\n          <option value='adaptive'>adaptive</option>\n          <option value='rough'>rough</option>\n          <option value='off'>off</option>\n          ";
  }

function program11(depth0,data) {
  
  
  return "\n      <ul class='gt-edit-controls'>\n        <li>\n          <a class='gt-reset-delete' href='#'>&#x2716;</a>\n        </li>\n        <li>\n          <button class='gt-item-delete gt-button-delete'></button>\n        </li>\n      </ul>\n      ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>";
  stack1 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-edit'>\n    <section class='gt-form-section'>\n      <div class='gt-trigger-conditions'>\n        <label for='tags'>\n          <span class='gt-label-left'>When a device tagged</span>\n          <input type='text' name='tags' placeholder='enter tags' class='gt-input-right' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || depth0.tagList),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagList", depth0.tags, options)))
    + "'>\n        </label>\n\n        <label for='condition'>\n          <select name='condition[direction]' class='gt-direction'>\n            ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n          </select>\n\n          <span>a</span>\n\n          <select name='geometry-type' class='gt-input-right'>\n            ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.selectShape || depth0.selectShape),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "selectShape", depth0.condition, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n          </select>\n        </label>\n      </div>\n\n      <div class='gt-trigger-event'>\n        <label for='action'>\n          <select name='action-select' class='gt-action-select gt-label-block gt-input-wide'>\n            <option value='notification'>send a notification to the device</option>\n            <option value='callbackUrl'>post to a callback URL</option>\n            <option value='trackingProfile'>change the tracking profile</option>\n          </select>\n        </label>\n\n        <!-- Notifcation Action One -->\n        <div class='gt-notification-action'>\n          <div class='gt-notification-left'>\n            <label for='gt-notification-action'>\n              <span class='gt-label-left'> with </span>\n              <select class='gt-input-left'>\n                <option value='message'>a message:</option>\n                <option value='sound'>a sound:</option>\n                <option value='data'>data:</option>\n                <option value='url'>a URL:</option>\n                <option value='icon'>an icon:</option>\n              </select>\n            </label>\n          </div>\n\n          <div class='gt-notification-right'>\n            <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n            <!-- <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <textarea class='gt-input' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <!-- <input class='gt-input-wide' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <input class='gt-input-wide' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n          </div>\n        </div>\n\n        <!-- Notifcation  Next Action -->\n        <div class='gt-notification-action'>\n          <div class='gt-notification-left'>\n            <label for='gt-notification-action'>\n              <span class='gt-label-left'> and </span>\n              <select class='gt-input-left'>\n                <!-- <option value='message'>a message:</option> -->\n                <option value='sound'>a sound:</option>\n                <option value='data'>data:</option>\n                <option value='url'>a URL:</option>\n                <option value='icon'>an icon:</option>\n              </select>\n            </label>\n          </div>\n\n          <div class='gt-notification-right'>\n            <!-- <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n            <!-- <textarea class='gt-input' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n          </div>\n        </div>\n\n        <!-- Notifcation Next Action -->\n        <div class='gt-notification-action'>\n          <div class='gt-notification-left'>\n            <label for='gt-notification-action'>\n              <span class='gt-label-left'> and </span>\n              <select class='gt-input-left'>\n                <!-- <option value='message'>a message:</option> -->\n                <!-- <option value='sound'>a sound:</option> -->\n                <option value='data'>data:</option>\n                <option value='url'>a URL:</option>\n                <option value='icon'>an icon:</option>\n              </select>\n            </label>\n          </div>\n\n          <div class='gt-notification-right'>\n            <!-- <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <textarea class='gt-input' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n            <!-- <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n          </div>\n        </div>\n\n        <!-- Notifcation Next Action -->\n        <div class='gt-notification-action'>\n          <div class='gt-notification-left'>\n            <label for='gt-notification-action'>\n              <span class='gt-label-left'> and </span>\n              <select class='gt-input-left'>\n                <!-- <option value='message'>a message:</option> -->\n                <!-- <option value='sound'>a sound:</option> -->\n                <!-- <option value='data'>data:</option> -->\n                <option value='url'>a URL:</option>\n                <option value='icon'>an icon:</option>\n              </select>\n            </label>\n          </div>\n\n          <div class='gt-notification-right'>\n            <!-- <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <textarea class='gt-input' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n            <!-- <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n          </div>\n        </div>\n\n        <!-- Notifcation Next Action -->\n        <div class='gt-notification-action'>\n          <div class='gt-notification-left'>\n            <label for='gt-notification-action'>\n              <span class='gt-label-left'> and </span>\n              <select class='gt-input-left'>\n                <option value='message'>a message:</option>\n                <option value='sound'>a sound:</option>\n                <option value='data'>data:</option>\n                <option value='url'>a URL:</option>\n                <option value='icon'>an icon:</option>\n              </select>\n            </label>\n          </div>\n\n          <div class='gt-notification-right'>\n            <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n            <!-- <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <textarea class='gt-input' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n            <!-- <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'> -->\n          </div>\n        </div>\n\n        <!-- Add Next Notification Action -->\n        <div class=\"gt-add-notification-action\">\n          <a href=\"#\">+ add an action</a>\n        </div>\n      </div>\n\n      <div class='gt-trigger-event'>\n        <span class='gt-label-left'>also </span>\n        <select class='gt-action-select gt-input-left gt-label-block' name='action-select'>\n          <option vlaue='notification'>send a notification</option>\n          <option value='callbackUrl'>post to a callback URL</option>\n          <option value='trackingProfile'>change the tracking profile</option>\n        </select>\n\n        <span class='gt-label-left'>to </span>\n        <select class='gt-input-left' name='action[trackingProfile]'>\n          <option>---</option>\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </select>\n      </div>\n\n      <div class='gt-trigger-event'>\n        <span class='gt-label-left'>and </span>\n        <select name='action-select' class='gt-input-left gt-label-block'>\n          <option vlaue='notification'>send a notification</option>\n          <option value='callbackUrl'>post to a callback URL</option>\n          <option value='trackingProfile'>change the tracking profile</option>\n        </select>\n\n        <label for='gt-postUrl-action'>\n          <input class='gt-input-fill' type='text' name='action[callbackUrl]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.callbackUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n        </label>\n      </div>\n\n      <span class=\"gt-add-trigger-event\"><a class='gt-button' href=\"#\">+ add an event</a></span>\n    </section>\n\n    <section class='gt-form-section gt-nick-wrapper'>\n      <label for='title'>\n        <span class='gt-label-left'>Title <em>(optional)</em></span>\n        <input class='gt-input-right' type='text' name='properties[title]' placeholder='My Cool Trigger' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n      </label>\n    </section>\n\n    <section class='gt-form-section'>\n      <button class='gt-button gt-button-blue gt-submit'>Update</button>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </section>\n  </form>\n</div>";
  return buffer;
  });

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

(function(App, Handlebars, $) {

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

    if (value && value.geo) {
      if (value.geo.geojson) {
        select.value = 'polygon';
      } else {
        select.value = 'radius';
      }
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
          output.push('<a href="#list?q=' + encodeURIComponent(tags[i]).replace(/%20/g, '+') + '">' + tags[i] + '</a>');
        }
      }
      return output.join(', ');
    } else {
      return '<strong>none</strong>';
    }
  });

  Handlebars.registerHelper('form-notification', function(key, content){
    console.log(key, content);
    return 'sup';
  });

}(GeotriggerEditor, Handlebars, $));

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

/*
  Leaflet.draw, a plugin that adds drawing and editing tools to Leaflet powered maps.
  (c) 2012-2013, Jacob Toye, Smartrak

  https://github.com/Leaflet/Leaflet.draw
  http://leafletjs.com
  https://github.com/jacobtoye
*/
(function (window, document, undefined) {
/*
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */

L.drawVersion = '0.2.1-dev';

L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: 'Cancel drawing',
        text: 'Cancel'
      },
      buttons: {
        polyline: 'Draw a polyline',
        polygon: 'Draw a polygon',
        rectangle: 'Draw a rectangle',
        circle: 'Draw a circle',
        marker: 'Draw a marker'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Click and drag to draw circle.'
        }
      },
      marker: {
        tooltip: {
          start: 'Click map to place marker.'
        }
      },
      polygon: {
        tooltip: {
          start: 'Click to start drawing shape.',
          cont: 'Click to continue drawing shape.',
          end: 'Click first point to close this shape.'
        }
      },
      polyline: {
        error: '<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: 'Click to start drawing line.',
          cont: 'Click to continue drawing line.',
          end: 'Click last point to finish line.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Click and drag to draw rectangle.'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Release mouse to finish drawing.'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Save changes.',
          text: 'Save'
        },
        cancel: {
          title: 'Cancel editing, discards all changes.',
          text: 'Cancel'
        }
      },
      buttons: {
        edit: 'Edit layers',
        remove: 'Delete layers'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Drag handles, or marker to edit feature.',
          subtext: 'Click cancel to undo changes.'
        }
      },
      remove: {
        tooltip: {
          text: 'Click on a feature to remove'
        }
      }
    }
  }
};

L.Draw = {};

L.Draw.Feature = L.Handler.extend({
  includes: L.Mixin.Events,

  initialize: function (map, options) {
    this._map = map;
    this._container = map._container;
    this._overlayPane = map._panes.overlayPane;
    this._popupPane = map._panes.popupPane;

    // Merge default shapeOptions options with custom shapeOptions
    if (options && options.shapeOptions) {
      options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
    }
    L.Util.extend(this.options, options);
  },

  enable: function () {
    if (this._enabled) { return; }

    L.Handler.prototype.enable.call(this);

    this.fire('enabled', { handler: this.type });

    this._map.fire('draw:drawstart', { layerType: this.type });
  },

  disable: function () {
    if (!this._enabled) { return; }

    L.Handler.prototype.disable.call(this);

    this.fire('disabled', { handler: this.type });

    this._map.fire('draw:drawstop', { layerType: this.type });
  },

  addHooks: function () {
    if (this._map) {
      L.DomUtil.disableTextSelection();

      this._tooltip = new L.Tooltip(this._map);

      L.DomEvent.addListener(this._container, 'keyup', this._cancelDrawing, this);
    }
  },

  removeHooks: function () {
    if (this._map) {
      L.DomUtil.enableTextSelection();

      this._tooltip.dispose();
      this._tooltip = null;

      L.DomEvent.removeListener(this._container, 'keyup', this._cancelDrawing);
    }
  },

  setOptions: function (options) {
    L.setOptions(this, options);
  },

  _fireCreatedEvent: function (layer) {
    this._map.fire('draw:created', { layer: layer, layerType: this.type });
  },

  // Cancel drawing when the escape key is pressed
  _cancelDrawing: function (e) {
    if (e.keyCode === 27) {
      this.disable();
    }
  }
});

L.Draw.Polyline = L.Draw.Feature.extend({
  statics: {
    TYPE: 'polyline'
  },

  Poly: L.Polyline,

  options: {
    allowIntersection: true,
    drawError: {
      color: '#b00b00',
      message: L.drawLocal.draw.handlers.polyline.error,
      timeout: 2500
    },
    icon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon'
    }),
    guidelineDistance: 20,
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: false,
      clickable: true
    },
    zIndexOffset: 2000 // This should be > than the highest z-index any map layers
  },

  initialize: function (map, options) {
    // Merge default drawError options with custom options
    if (options && options.drawError) {
      options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
    }

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Polyline.TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },

  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);
    if (this._map) {
      this._markers = [];

      this._markerGroup = new L.LayerGroup();
      this._map.addLayer(this._markerGroup);

      this._poly = new L.Polyline([], this.options.shapeOptions);

      this._tooltip.updateContent(this._getTooltipText());

      // Make a transparent marker that will used to catch click events. These click
      // events will create the vertices. We need to do this so we can ensure that
      // we can create vertices over other map layers (markers, vector layers). We
      // also do not want to trigger any click handlers of objects we are clicking on
      // while drawing.
      if (!this._mouseMarker) {
        this._mouseMarker = L.marker(this._map.getCenter(), {
          icon: L.divIcon({
            className: 'leaflet-mouse-marker',
            iconAnchor: [20, 20],
            iconSize: [40, 40]
          }),
          opacity: 0,
          zIndexOffset: this.options.zIndexOffset
        });
      }

      this._mouseMarker
        .on('click', this._onClick, this)
        .addTo(this._map);

      this._map
        .on('mousemove', this._onMouseMove, this)
        .on('zoomend', this._onZoomEnd, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);

    this._clearHideErrorTimeout();

    this._cleanUpShape();

    // remove markers from map
    this._map.removeLayer(this._markerGroup);
    delete this._markerGroup;
    delete this._markers;

    this._map.removeLayer(this._poly);
    delete this._poly;

    this._mouseMarker.off('click', this._onClick, this);
    this._map.removeLayer(this._mouseMarker);
    delete this._mouseMarker;

    // clean up DOM
    this._clearGuides();

    this._map
      .off('mousemove', this._onMouseMove, this)
      .off('zoomend', this._onZoomEnd, this);
  },

  _finishShape: function () {
    var intersects = this._poly.newLatLngIntersects(this._poly.getLatLngs()[0], true);

    if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
      this._showErrorTooltip();
      return;
    }

    this._fireCreatedEvent();
    this.disable();
  },

  //Called to verify the shape is valid when the user tries to finish it
  //Return false if the shape is not valid
  _shapeIsValid: function () {
    return true;
  },

  _onZoomEnd: function () {
    this._updateGuide();
  },

  _onMouseMove: function (e) {
    var newPos = e.layerPoint,
      latlng = e.latlng;

    // Save latlng
    // should this be moved to _updateGuide() ?
    this._currentLatLng = latlng;

    this._updateTooltip(latlng);

    // Update the guide line
    this._updateGuide(newPos);

    // Update the mouse marker position
    this._mouseMarker.setLatLng(latlng);

    L.DomEvent.preventDefault(e.originalEvent);
  },

  _onClick: function (e) {
    var latlng = e.target.getLatLng(),
      markerCount = this._markers.length;

    if (markerCount > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
      this._showErrorTooltip();
      return;
    }
    else if (this._errorShown) {
      this._hideErrorTooltip();
    }

    this._markers.push(this._createMarker(latlng));

    this._poly.addLatLng(latlng);

    if (this._poly.getLatLngs().length === 2) {
      this._map.addLayer(this._poly);
    }

    this._updateFinishHandler();

    this._vertexAdded(latlng);

    this._clearGuides();

    this._updateTooltip();
  },

  _updateFinishHandler: function () {
    var markerCount = this._markers.length;
    // The last marker should have a click handler to close the polyline
    if (markerCount > 1) {
      this._markers[markerCount - 1].on('click', this._finishShape, this);
    }

    // Remove the old marker click handler (as only the last point should close the polyline)
    if (markerCount > 2) {
      this._markers[markerCount - 2].off('click', this._finishShape, this);
    }
  },

  _createMarker: function (latlng) {
    var marker = new L.Marker(latlng, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset * 2
    });

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _updateGuide: function (newPos) {
    newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

    var markerCount = this._markers.length;

    if (markerCount > 0) {
      // draw the guide line
      this._clearGuides();
      this._drawGuide(
        this._map.latLngToLayerPoint(this._markers[markerCount - 1].getLatLng()),
        newPos
      );
    }
  },

  _updateTooltip: function (latLng) {
    var text = this._getTooltipText();

    if (latLng) {
      this._tooltip.updatePosition(latLng);
    }

    if (!this._errorShown) {
      this._tooltip.updateContent(text);
    }
  },

  _drawGuide: function (pointA, pointB) {
    var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
      i,
      fraction,
      dashPoint,
      dash;

    //create the guides container if we haven't yet
    if (!this._guidesContainer) {
      this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
    }

    //draw a dash every GuildeLineDistance
    for (i = this.options.guidelineDistance; i < length; i += this.options.guidelineDistance) {
      //work out fraction along line we are
      fraction = i / length;

      //calculate new x,y point
      dashPoint = {
        x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
        y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
      };

      //add guide dash to guide container
      dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
      dash.style.backgroundColor =
        !this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;

      L.DomUtil.setPosition(dash, dashPoint);
    }
  },

  _updateGuideColor: function (color) {
    if (this._guidesContainer) {
      for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
        this._guidesContainer.childNodes[i].style.backgroundColor = color;
      }
    }
  },

  // removes all child elements (guide dashes) from the guides container
  _clearGuides: function () {
    if (this._guidesContainer) {
      while (this._guidesContainer.firstChild) {
        this._guidesContainer.removeChild(this._guidesContainer.firstChild);
      }
    }
  },

  _getTooltipText: function () {
    var labelText,
      distance,
      distanceStr;

    if (this._markers.length === 0) {
      labelText = {
        text: L.drawLocal.draw.handlers.polyline.tooltip.start
      };
    } else {
      // calculate the distance from the last fixed point to the mouse position
      distance = this._measurementRunningTotal + this._currentLatLng.distanceTo(this._markers[this._markers.length - 1].getLatLng());
      // show metres when distance is < 1km, then show km
      distanceStr = distance  > 1000 ? (distance  / 1000).toFixed(2) + ' km' : Math.ceil(distance) + ' m';

      if (this._markers.length === 1) {
        labelText = {
          text: L.drawLocal.draw.handlers.polyline.tooltip.cont,
          subtext: distanceStr
        };
      } else {
        labelText = {
          text: L.drawLocal.draw.handlers.polyline.tooltip.end,
          subtext: distanceStr
        };
      }
    }
    return labelText;
  },

  _showErrorTooltip: function () {
    this._errorShown = true;

    // Update tooltip
    this._tooltip
      .showAsError()
      .updateContent({ text: this.options.drawError.message });

    // Update shape
    this._updateGuideColor(this.options.drawError.color);
    this._poly.setStyle({ color: this.options.drawError.color });

    // Hide the error after 2 seconds
    this._clearHideErrorTimeout();
    this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
  },

  _hideErrorTooltip: function () {
    this._errorShown = false;

    this._clearHideErrorTimeout();

    // Revert tooltip
    this._tooltip
      .removeError()
      .updateContent(this._getTooltipText());

    // Revert shape
    this._updateGuideColor(this.options.shapeOptions.color);
    this._poly.setStyle({ color: this.options.shapeOptions.color });
  },

  _clearHideErrorTimeout: function () {
    if (this._hideErrorTimeout) {
      clearTimeout(this._hideErrorTimeout);
      this._hideErrorTimeout = null;
    }
  },

  _vertexAdded: function (latlng) {
    if (this._markers.length === 1) {
      this._measurementRunningTotal = 0;
    }
    else {
      this._measurementRunningTotal +=
        latlng.distanceTo(this._markers[this._markers.length - 2].getLatLng());
    }
  },

  _cleanUpShape: function () {
    if (this._markers.length > 1) {
      this._markers[this._markers.length - 1].off('click', this._finishShape, this);
    }
  },

  _fireCreatedEvent: function () {
    var poly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
  }
});

L.Draw.Polygon = L.Draw.Polyline.extend({
  statics: {
    TYPE: 'polygon'
  },

  Poly: L.Polygon,

  options: {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    L.Draw.Polyline.prototype.initialize.call(this, map, options);

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Polygon.TYPE;
  },

  _updateFinishHandler: function () {
    var markerCount = this._markers.length;

    // The first marker shold have a click handler to close the polygon
    if (markerCount === 1) {
      this._markers[0].on('click', this._finishShape, this);
    }

    // Add and update the double click handler
    if (markerCount > 2) {
      this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
      // Only need to remove handler if has been added before
      if (markerCount > 3) {
        this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
      }
    }
  },

  _getTooltipText: function () {
    var text, subtext;

    if (this._markers.length === 0) {
      text = L.drawLocal.draw.handlers.polygon.tooltip.start;
    } else if (this._markers.length < 3) {
      text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
    } else {
      text = L.drawLocal.draw.handlers.polygon.tooltip.end;
      subtext = this._area;
    }

    return {
      text: text,
      subtext: subtext
    };
  },

  _shapeIsValid: function () {
    return this._markers.length >= 3;
  },

  _vertexAdded: function () {
    // Check to see if we should show the area
    if (this.options.allowIntersection || !this.options.showArea) {
      return;
    }

    var latLngs = this._poly.getLatLngs(),
      area = L.PolygonUtil.geodesicArea(latLngs);

    // Convert to most appropriate units
    if (area > 10000) {
      area = (area * 0.0001).toFixed(2) + ' ha';
    } else {
      area = area.toFixed(2) + ' m&sup2;';
    }

    this._area = area;
  },

  _cleanUpShape: function () {
    var markerCount = this._markers.length;

    if (markerCount > 0) {
      this._markers[0].off('click', this._finishShape, this);

      if (markerCount > 2) {
        this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
      }
    }
  }
});


L.SimpleShape = {};

L.Draw.SimpleShape = L.Draw.Feature.extend({
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);
    if (this._map) {
      this._map.dragging.disable();
      //TODO refactor: move cursor to styles
      this._container.style.cursor = 'crosshair';

      this._tooltip.updateContent({ text: this._initialLabelText });

      this._map
        .on('mousedown', this._onMouseDown, this)
        .on('mousemove', this._onMouseMove, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);
    if (this._map) {
      this._map.dragging.enable();
      //TODO refactor: move cursor to styles
      this._container.style.cursor = '';

      this._map
        .off('mousedown', this._onMouseDown, this)
        .off('mousemove', this._onMouseMove, this);

      L.DomEvent.off(document, 'mouseup', this._onMouseUp);

      // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
      if (this._shape) {
        this._map.removeLayer(this._shape);
        delete this._shape;
      }
    }
    this._isDrawing = false;
  },

  _onMouseDown: function (e) {
    this._isDrawing = true;
    this._startLatLng = e.latlng;

    L.DomEvent
      .on(document, 'mouseup', this._onMouseUp, this)
      .preventDefault(e.originalEvent);
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng;

    this._tooltip.updatePosition(latlng);
    if (this._isDrawing) {
      this._tooltip.updateContent({ text: L.drawLocal.draw.handlers.simpleshape.tooltip.end });
      this._drawShape(latlng);
    }
  },

  _onMouseUp: function () {
    if (this._shape) {
      this._fireCreatedEvent();
    }

    this.disable();
  }
});

L.Draw.Rectangle = L.Draw.SimpleShape.extend({
  statics: {
    TYPE: 'rectangle'
  },

  options: {
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Rectangle.TYPE;

    L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
  },
  _initialLabelText: L.drawLocal.draw.handlers.rectangle.tooltip.start,

  _drawShape: function (latlng) {
    if (!this._shape) {
      this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
      this._map.addLayer(this._shape);
    } else {
      this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
    }
  },

  _fireCreatedEvent: function () {
    var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
    L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, rectangle);
  }
});


L.Draw.Circle = L.Draw.SimpleShape.extend({
  statics: {
    TYPE: 'circle'
  },

  options: {
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Circle.TYPE;

    L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
  },

  _initialLabelText: L.drawLocal.draw.handlers.circle.tooltip.start,

  _drawShape: function (latlng) {
    if (!this._shape) {
      this._shape = new L.Circle(this._startLatLng, this._startLatLng.distanceTo(latlng), this.options.shapeOptions);
      this._map.addLayer(this._shape);
    } else {
      this._shape.setRadius(this._startLatLng.distanceTo(latlng));
    }
  },

  _fireCreatedEvent: function () {
    var circle = new L.Circle(this._startLatLng, this._shape.getRadius(), this.options.shapeOptions);
    L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, circle);
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng,
      radius;

    this._tooltip.updatePosition(latlng);
    if (this._isDrawing) {
      this._drawShape(latlng);

      // Get the new radius (rouded to 1 dp)
      radius = this._shape.getRadius().toFixed(1);

      this._tooltip.updateContent({
        text: 'Release mouse to finish drawing.',
        subtext: 'Radius: ' + radius + ' m'
      });
    }
  }
});

L.Draw.Marker = L.Draw.Feature.extend({
  statics: {
    TYPE: 'marker'
  },

  options: {
    icon: new L.Icon.Default(),
    zIndexOffset: 2000 // This should be > than the highest z-index any markers
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Marker.TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },

  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);

    if (this._map) {
      this._tooltip.updateContent({ text: L.drawLocal.draw.handlers.marker.tooltip.start });

      // Same mouseMarker as in Draw.Polyline
      if (!this._mouseMarker) {
        this._mouseMarker = L.marker(this._map.getCenter(), {
          icon: L.divIcon({
            className: 'leaflet-mouse-marker',
            iconAnchor: [20, 20],
            iconSize: [40, 40]
          }),
          opacity: 0,
          zIndexOffset: this.options.zIndexOffset
        });
      }

      this._mouseMarker
        .on('click', this._onClick, this)
        .addTo(this._map);

      this._map.on('mousemove', this._onMouseMove, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);

    if (this._map) {
      if (this._marker) {
        this._marker.off('click', this._onClick, this);
        this._map
          .off('click', this._onClick, this)
          .removeLayer(this._marker);
        delete this._marker;
      }

      this._mouseMarker.off('click', this._onClick, this);
      this._map.removeLayer(this._mouseMarker);
      delete this._mouseMarker;

      this._map.off('mousemove', this._onMouseMove, this);
    }
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng;

    this._tooltip.updatePosition(latlng);
    this._mouseMarker.setLatLng(latlng);

    if (!this._marker) {
      this._marker = new L.Marker(latlng, {
        icon: this.options.icon,
        zIndexOffset: this.options.zIndexOffset
      });
      // Bind to both marker and map to make sure we get the click event.
      this._marker.on('click', this._onClick, this);
      this._map
        .on('click', this._onClick, this)
        .addLayer(this._marker);
    }
    else {
      this._marker.setLatLng(latlng);
    }
  },

  _onClick: function () {
    this._fireCreatedEvent();

    this.disable();
  },

  _fireCreatedEvent: function () {
    var marker = new L.Marker(this._marker.getLatLng(), { icon: this.options.icon });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, marker);
  }
});

L.Edit = L.Edit || {};

/*
 * L.Edit.Poly is an editing handler for polylines and polygons.
 */

L.Edit.Poly = L.Handler.extend({
  options: {
    icon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon'
    })
  },

  initialize: function (poly, options) {
    this._poly = poly;
    L.setOptions(this, options);
  },

  addHooks: function () {
    if (this._poly._map) {
      if (!this._markerGroup) {
        this._initMarkers();
      }
      this._poly._map.addLayer(this._markerGroup);
    }
  },

  removeHooks: function () {
    if (this._poly._map) {
      this._poly._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
      delete this._markers;
    }
  },

  updateMarkers: function () {
    this._markerGroup.clearLayers();
    this._initMarkers();
  },

  _initMarkers: function () {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }
    this._markers = [];

    var latlngs = this._poly._latlngs,
      i, j, len, marker;

    // TODO refactor holes implementation in Polygon to support it here

    for (i = 0, len = latlngs.length; i < len; i++) {

      marker = this._createMarker(latlngs[i], i);
      marker.on('click', this._onMarkerClick, this);
      this._markers.push(marker);
    }

    var markerLeft, markerRight;

    for (i = 0, j = len - 1; i < len; j = i++) {
      if (i === 0 && !(L.Polygon && (this._poly instanceof L.Polygon))) {
        continue;
      }

      markerLeft = this._markers[j];
      markerRight = this._markers[i];

      this._createMiddleMarker(markerLeft, markerRight);
      this._updatePrevNext(markerLeft, markerRight);
    }
  },

  _createMarker: function (latlng, index) {
    var marker = new L.Marker(latlng, {
      draggable: true,
      icon: this.options.icon
    });

    marker._origLatLng = latlng;
    marker._index = index;

    marker.on('drag', this._onMarkerDrag, this);
    marker.on('dragend', this._fireEdit, this);

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _removeMarker: function (marker) {
    var i = marker._index;

    this._markerGroup.removeLayer(marker);
    this._markers.splice(i, 1);
    this._poly.spliceLatLngs(i, 1);
    this._updateIndexes(i, -1);

    marker
      .off('drag', this._onMarkerDrag, this)
      .off('dragend', this._fireEdit, this)
      .off('click', this._onMarkerClick, this);
  },

  _fireEdit: function () {
    this._poly.edited = true;
    this._poly.fire('edit');
  },

  _onMarkerDrag: function (e) {
    var marker = e.target;

    L.extend(marker._origLatLng, marker._latlng);

    if (marker._middleLeft) {
      marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
    }
    if (marker._middleRight) {
      marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
    }

    this._poly.redraw();
  },

  _onMarkerClick: function (e) {
    // we want to remove the marker on click, but if latlng count < 3, polyline would be invalid
    if (this._poly._latlngs.length < 3) { return; }

    var marker = e.target;

    // remove the marker
    this._removeMarker(marker);

    // update prev/next links of adjacent markers
    this._updatePrevNext(marker._prev, marker._next);

    // remove ghost markers near the removed marker
    if (marker._middleLeft) {
      this._markerGroup.removeLayer(marker._middleLeft);
    }
    if (marker._middleRight) {
      this._markerGroup.removeLayer(marker._middleRight);
    }

    // create a ghost marker in place of the removed one
    if (marker._prev && marker._next) {
      this._createMiddleMarker(marker._prev, marker._next);

    } else if (!marker._prev) {
      marker._next._middleLeft = null;

    } else if (!marker._next) {
      marker._prev._middleRight = null;
    }

    this._fireEdit();
  },

  _updateIndexes: function (index, delta) {
    this._markerGroup.eachLayer(function (marker) {
      if (marker._index > index) {
        marker._index += delta;
      }
    });
  },

  _createMiddleMarker: function (marker1, marker2) {
    var latlng = this._getMiddleLatLng(marker1, marker2),
        marker = this._createMarker(latlng),
        onClick,
        onDragStart,
        onDragEnd;

    marker.setOpacity(0.6);

    marker1._middleRight = marker2._middleLeft = marker;

    onDragStart = function () {
      var i = marker2._index;

      marker._index = i;

      marker
          .off('click', onClick, this)
          .on('click', this._onMarkerClick, this);

      latlng.lat = marker.getLatLng().lat;
      latlng.lng = marker.getLatLng().lng;
      this._poly.spliceLatLngs(i, 0, latlng);
      this._markers.splice(i, 0, marker);

      marker.setOpacity(1);

      this._updateIndexes(i, 1);
      marker2._index++;
      this._updatePrevNext(marker1, marker);
      this._updatePrevNext(marker, marker2);
    };

    onDragEnd = function () {
      marker.off('dragstart', onDragStart, this);
      marker.off('dragend', onDragEnd, this);

      this._createMiddleMarker(marker1, marker);
      this._createMiddleMarker(marker, marker2);
    };

    onClick = function () {
      onDragStart.call(this);
      onDragEnd.call(this);
      this._fireEdit();
    };

    marker
        .on('click', onClick, this)
        .on('dragstart', onDragStart, this)
        .on('dragend', onDragEnd, this);

    this._markerGroup.addLayer(marker);
  },

  _updatePrevNext: function (marker1, marker2) {
    if (marker1) {
      marker1._next = marker2;
    }
    if (marker2) {
      marker2._prev = marker1;
    }
  },

  _getMiddleLatLng: function (marker1, marker2) {
    var map = this._poly._map,
        p1 = map.latLngToLayerPoint(marker1.getLatLng()),
        p2 = map.latLngToLayerPoint(marker2.getLatLng());

    return map.layerPointToLatLng(p1._add(p2)._divideBy(2));
  }
});

L.Polyline.addInitHook(function () {

  // Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
  if (this.editing) {
    return;
  }

  if (L.Edit.Poly) {
    this.editing = new L.Edit.Poly(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }

  this.on('add', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.addHooks();
    }
  });

  this.on('remove', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.removeHooks();
    }
  });
});


L.Edit = L.Edit || {};

L.Edit.SimpleShape = L.Handler.extend({
  options: {
    moveIcon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
    }),
    resizeIcon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
    })
  },

  initialize: function (shape, options) {
    this._shape = shape;
    L.Util.setOptions(this, options);
  },

  addHooks: function () {
    if (this._shape._map) {
      this._map = this._shape._map;

      if (!this._markerGroup) {
        this._initMarkers();
      }
      this._map.addLayer(this._markerGroup);
    }
  },

  removeHooks: function () {
    if (this._shape._map) {
      this._unbindMarker(this._moveMarker);

      for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
        this._unbindMarker(this._resizeMarkers[i]);
      }
      this._resizeMarkers = null;

      this._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
    }

    this._map = null;
  },

  updateMarkers: function () {
    this._markerGroup.clearLayers();
    this._initMarkers();
  },

  _initMarkers: function () {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }

    // Create center marker
    this._createMoveMarker();

    // Create edge marker
    this._createResizeMarker();
  },

  _createMoveMarker: function () {
    // Children override
  },

  _createResizeMarker: function () {
    // Children override
  },

  _createMarker: function (latlng, icon) {
    var marker = new L.Marker(latlng, {
      draggable: true,
      icon: icon,
      zIndexOffset: 10
    });

    this._bindMarker(marker);

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _bindMarker: function (marker) {
    marker
      .on('dragstart', this._onMarkerDragStart, this)
      .on('drag', this._onMarkerDrag, this)
      .on('dragend', this._onMarkerDragEnd, this);
  },

  _unbindMarker: function (marker) {
    marker
      .off('dragstart', this._onMarkerDragStart, this)
      .off('drag', this._onMarkerDrag, this)
      .off('dragend', this._onMarkerDragEnd, this);
  },

  _onMarkerDragStart: function (e) {
    var marker = e.target;
    marker.setOpacity(0);
  },

  _fireEdit: function () {
    this._shape.edited = true;
    this._shape.fire('edit');
  },

  _onMarkerDrag: function (e) {
    var marker = e.target,
      latlng = marker.getLatLng();

    if (marker === this._moveMarker) {
      this._move(latlng);
    } else {
      this._resize(latlng);
    }

    this._shape.redraw();
  },

  _onMarkerDragEnd: function (e) {
    var marker = e.target;
    marker.setOpacity(1);

    this._shape.fire('edit');
    this._fireEdit();
  },

  _move: function () {
    // Children override
  },

  _resize: function () {
    // Children override
  }
});

L.Edit = L.Edit || {};

L.Edit.Rectangle = L.Edit.SimpleShape.extend({
  _createMoveMarker: function () {
    var bounds = this._shape.getBounds(),
      center = bounds.getCenter();

    this._moveMarker = this._createMarker(center, this.options.moveIcon);
  },

  _createResizeMarker: function () {
    var corners = this._getCorners();

    this._resizeMarkers = [];

    for (var i = 0, l = corners.length; i < l; i++) {
      this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
      // Monkey in the corner index as we will need to know this for dragging
      this._resizeMarkers[i]._cornerIndex = i;
    }
  },

  _onMarkerDragStart: function (e) {
    L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

    // Save a reference to the opposite point
    var corners = this._getCorners(),
      marker = e.target,
      currentCornerIndex = marker._cornerIndex;

    this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

    this._toggleCornerMarkers(0, currentCornerIndex);
  },

  _onMarkerDragEnd: function (e) {
    var marker = e.target,
      bounds, center;

    // Reset move marker position to the center
    if (marker === this._moveMarker) {
      bounds = this._shape.getBounds();
      center = bounds.getCenter();

      marker.setLatLng(center);
    }

    this._toggleCornerMarkers(1);

    this._repositionCornerMarkers();

    L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this, e);
  },

  _move: function (newCenter) {
    var latlngs = this._shape.getLatLngs(),
      bounds = this._shape.getBounds(),
      center = bounds.getCenter(),
      offset, newLatLngs = [];

    // Offset the latlngs to the new center
    for (var i = 0, l = latlngs.length; i < l; i++) {
      offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
      newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
    }

    this._shape.setLatLngs(newLatLngs);

    // Respoition the resize markers
    this._repositionCornerMarkers();
  },

  _resize: function (latlng) {
    var bounds;

    // Update the shape based on the current position of this corner and the opposite point
    this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

    // Respoition the move marker
    bounds = this._shape.getBounds();
    this._moveMarker.setLatLng(bounds.getCenter());
  },

  _getCorners: function () {
    var bounds = this._shape.getBounds(),
      nw = bounds.getNorthWest(),
      ne = bounds.getNorthEast(),
      se = bounds.getSouthEast(),
      sw = bounds.getSouthWest();

    return [nw, ne, se, sw];
  },

  _toggleCornerMarkers: function (opacity) {
    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setOpacity(opacity);
    }
  },

  _repositionCornerMarkers: function () {
    var corners = this._getCorners();

    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setLatLng(corners[i]);
    }
  }
});

L.Rectangle.addInitHook(function () {
  if (L.Edit.Rectangle) {
    this.editing = new L.Edit.Rectangle(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }
});

L.Edit = L.Edit || {};

L.Edit.Circle = L.Edit.SimpleShape.extend({
  _createMoveMarker: function () {
    var center = this._shape.getLatLng();

    this._moveMarker = this._createMarker(center, this.options.moveIcon);
  },

  _createResizeMarker: function () {
    var center = this._shape.getLatLng(),
      resizemarkerPoint = this._getResizeMarkerPoint(center);

    this._resizeMarkers = [];
    this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon));
  },

  _getResizeMarkerPoint: function (latlng) {
    // From L.shape.getBounds()
    var delta = this._shape._radius * Math.cos(Math.PI / 4),
      point = this._map.project(latlng);
    return this._map.unproject([point.x + delta, point.y - delta]);
  },

  _move: function (latlng) {
    var resizemarkerPoint = this._getResizeMarkerPoint(latlng);

    // Move the resize marker
    this._resizeMarkers[0].setLatLng(resizemarkerPoint);

    // Move the circle
    this._shape.setLatLng(latlng);
  },

  _resize: function (latlng) {
    var moveLatLng = this._moveMarker.getLatLng(),
      radius = moveLatLng.distanceTo(latlng);

    this._shape.setRadius(radius);
  }
});

L.Circle.addInitHook(function () {
  if (L.Edit.Circle) {
    this.editing = new L.Edit.Circle(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }

  this.on('add', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.addHooks();
    }
  });

  this.on('remove', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.removeHooks();
    }
  });
});

/*
 * L.LatLngUtil contains different utility functions for LatLngs.
 */

L.LatLngUtil = {
  // Clones a LatLngs[], returns [][]
  cloneLatLngs: function (latlngs) {
    var clone = [];
    for (var i = 0, l = latlngs.length; i < l; i++) {
      clone.push(this.cloneLatLng(latlngs[i]));
    }
    return clone;
  },

  cloneLatLng: function (latlng) {
    return L.latLng(latlng.lat, latlng.lng);
  }
};

/*
 * L.PolygonUtil contains different utility functions for Polygons.
 */

L.PolygonUtil = {
  // Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
  geodesicArea: function (latLngs) {
    var pointsCount = latLngs.length,
      area = 0.0,
      d2r = L.LatLng.DEG_TO_RAD,
      p1, p2;

    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        p1 = latLngs[i];
        p2 = latLngs[(i + 1) % pointsCount];
        area += ((p2.lng - p1.lng) * d2r) *
            (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
      }
      area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
  }
};

L.Util.extend(L.LineUtil, {
  // Checks to see if two line segments intersect. Does not handle degenerate cases.
  // http://compgeom.cs.uiuc.edu/~jeffe/teaching/373/notes/x06-sweepline.pdf
  segmentsIntersect: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2, /*Point*/ p3) {
    return  this._checkCounterclockwise(p, p2, p3) !==
        this._checkCounterclockwise(p1, p2, p3) &&
        this._checkCounterclockwise(p, p1, p2) !==
        this._checkCounterclockwise(p, p1, p3);
  },

  // check to see if points are in counterclockwise order
  _checkCounterclockwise: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
    return (p2.y - p.y) * (p1.x - p.x) > (p1.y - p.y) * (p2.x - p.x);
  }
});

L.Polyline.include({
  // Check to see if this polyline has any linesegments that intersect.
  // NOTE: does not support detecting intersection for degenerate cases.
  intersects: function () {
    var points = this._originalPoints,
      len = points ? points.length : 0,
      i, p, p1;

    if (this._tooFewPointsForIntersection()) {
      return false;
    }

    for (i = len - 1; i >= 3; i--) {
      p = points[i - 1];
      p1 = points[i];


      if (this._lineSegmentsIntersectsRange(p, p1, i - 2)) {
        return true;
      }
    }

    return false;
  },

  // Check for intersection if new latlng was added to this polyline.
  // NOTE: does not support detecting intersection for degenerate cases.
  newLatLngIntersects: function (latlng, skipFirst) {
    // Cannot check a polyline for intersecting lats/lngs when not added to the map
    if (!this._map) {
      return false;
    }

    return this.newPointIntersects(this._map.latLngToLayerPoint(latlng), skipFirst);
  },

  // Check for intersection if new point was added to this polyline.
  // newPoint must be a layer point.
  // NOTE: does not support detecting intersection for degenerate cases.
  newPointIntersects: function (newPoint, skipFirst) {
    var points = this._originalPoints,
      len = points ? points.length : 0,
      lastPoint = points ? points[len - 1] : null,
      // The previous previous line segment. Previous line segement doesn't need testing.
      maxIndex = len - 2;

    if (this._tooFewPointsForIntersection(1)) {
      return false;
    }

    return this._lineSegmentsIntersectsRange(lastPoint, newPoint, maxIndex, skipFirst ? 1 : 0);
  },

  // Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
  // Cannot have intersection when < 3 line segments (< 4 points)
  _tooFewPointsForIntersection: function (extraPoints) {
    var points = this._originalPoints,
      len = points ? points.length : 0;
    // Increment length by extraPoints if present
    len += extraPoints || 0;

    return !this._originalPoints || len <= 3;
  },

  // Checks a line segment intersections with any line segements before its predecessor.
  // Don't need to check the predecessor as will never intersect.
  _lineSegmentsIntersectsRange: function (p, p1, maxIndex, minIndex) {
    var points = this._originalPoints,
      p2, p3;

    minIndex = minIndex || 0;

    // Check all previous line segments (beside the immediately previous) for intersections
    for (var j = maxIndex; j > minIndex; j--) {
      p2 = points[j - 1];
      p3 = points[j];

      if (L.LineUtil.segmentsIntersect(p, p1, p2, p3)) {
        return true;
      }
    }

    return false;
  }
});

L.Polygon.include({
  // Checks a polygon for any intersecting line segments. Ignores holes.
  intersects: function () {
    var polylineIntersects,
      points = this._originalPoints,
      len, firstPoint, lastPoint, maxIndex;

    if (this._tooFewPointsForIntersection()) {
      return false;
    }

    polylineIntersects = L.Polyline.prototype.intersects.call(this);

    // If already found an intersection don't need to check for any more.
    if (polylineIntersects) {
      return true;
    }

    len = points.length;
    firstPoint = points[0];
    lastPoint = points[len - 1];
    maxIndex = len - 2;

    // Check the line segment between last and first point. Don't need to check the first line segment (minIndex = 1)
    return this._lineSegmentsIntersectsRange(lastPoint, firstPoint, maxIndex, 1);
  }
});

}(this, document));

/* leaflet.draw.toolip.js */

L.Tooltip = L.Class.extend({
  initialize: function (map) {
    this._map = map;
    this._popupPane = map._panes.popupPane;

    this._container = L.DomUtil.create('div', 'leaflet-draw-tooltip', this._popupPane);
    this._singleLineLabel = false;
  },

  dispose: function () {
    this._popupPane.removeChild(this._container);
    this._container = null;
  },

  updateContent: function (labelText) {
    labelText.subtext = labelText.subtext || '';

    // update the vertical position (only if changed)
    if (labelText.subtext.length === 0 && !this._singleLineLabel) {
      L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
      this._singleLineLabel = true;
    }
    else if (labelText.subtext.length > 0 && this._singleLineLabel) {
      L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
      this._singleLineLabel = false;
    }

    this._container.innerHTML =
      (labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
      '<span>' + labelText.text + '</span>';

    return this;
  },

  updatePosition: function (latlng) {
    var pos = this._map.latLngToLayerPoint(latlng);

    L.DomUtil.setPosition(this._container, pos);

    return this;
  },

  showAsError: function () {
    L.DomUtil.addClass(this._container, 'leaflet-error-draw-tooltip');
    return this;
  },

  removeError: function () {
    L.DomUtil.removeClass(this._container, 'leaflet-error-draw-tooltip');
    return this;
  }
});

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

/**
 *
 *   This program is free software: you can redistribute it and/or modify  it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License along with this program.  If not, see http://www.gnu.org/licenses/.
**/


( // Module boilerplate to support browser globals, node.js and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||
  (typeof define === "function" && function (m) { define('underscoreDeepExtend', m); }) ||
  (function (m) { window['underscoreDeepExtend'] = m(); })
)(function () { return function(_) {

return function underscoreDeepExtend (obj) {
  var parentRE = /#{\s*?_\s*?}/,
      slice = Array.prototype.slice,
      hasOwnProperty = Object.prototype.hasOwnProperty;

  _.each(slice.call(arguments, 1), function(source) {
    for (var prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        if (_.isUndefined(obj[prop])) {
          obj[prop] = source[prop];
        }
        else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
          if (_.isString(obj[prop])) {
            obj[prop] = source[prop].replace(parentRE, obj[prop]);
          }
        }
        else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
          if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
            throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
          } else {
            obj[prop] = _.reject(_.deepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
          }
        }
        else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
          if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
            throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
          } else {
            obj[prop] = _.deepExtend(obj[prop], source[prop]);
          }
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
};

};});

/* attach deepExtend to underscore */
(function(){
  _.mixin({deepExtend: underscoreDeepExtend(_)});
})();

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

GeotriggerEditor.module('Config', function(Config, App, Backbone, Marionette, $, _) {

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
      color: '#00dcb1',
      opacity: 0.8,
      dashArray: '10, 10',
      weight: 2,
      fill: true,
      fillOpacity: 0.2
    }
  };

  var highlightOptions = {
    showArea: false,
    shapeOptions: {
      color: '#00dcb1',
      opacity: 0.8,
      stroke: true,
      weight: 2,
      fill: true,
      fillOpacity: 0.2
    }
  };

  var defaults = {
    map: {
      basemap: 'Streets',
      center: [45.516484, -122.676339],
      zoom: 12
    },

    fitOnLoad: true,

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions,
    highlightOptions: highlightOptions

  };

  Config.addInitializer(function(options) {
    App.config = _.deepExtend(defaults, options);
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
      this._tools.polygon = new L.Draw.Polygon(App.map, App.config.editOptions);
      this._tools.radius = new L.Draw.Circle(App.map, App.config.editOptions);

      this._eventBindings();
    },

    _eventBindings: function() {
      App.vent.on('draw:new', function(layer) {
        this.editLayer(layer);
      }, this);

      App.vent.on('index trigger:list trigger:edit', function(){
        this.clear();
      }, this);

      App.vent.on('trigger:new:ready', function() {
        var layer = App.request('draw:layer');
        if (layer){
          App.Map.panToLayer(layer);
        }
      }, this);

      App.vent.on('trigger:edit', function(triggerId) {
        var layer = this.newShape(triggerId);
        this.editLayer(layer);
        App.Map.panToLayer(layer);
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

      App.vent.on('draw:enable', _.bind(function(tool){
        this.enableTool(tool);
      }, this));

      App.vent.on('draw:disable', _.bind(function(tool){
        this.disableTool(tool);
      }, this));
    },

    newShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.config.editOptions.shapeOptions, false).getLayers()[0];
      } else {
        shape = App.Map.circle(geo, App.config.editOptions.shapeOptions, false);
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
      'list?q=:term': 'list',
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
          Backbone.history.start();
          if (App.config.fitOnLoad && !Backbone.history.fragment.match('edit')) {
            App.execute('map:fit');
          }
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
      });

      drawer.on('close', function(){
        content.removeClass('gt-active');
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

    list: function(term) {
      if (!App.regions.drawer.$el || !App.regions.drawer.$el.has('.gt-list').length) {
        App.vent.trigger('trigger:list');
        var view = new App.Views.List({ collection: App.collections.triggers });
        App.regions.drawer.show(view);
      } else if (!term) {
        App.vent.trigger('trigger:list:reset');
      }

      if (term) {
        term = decodeURIComponent(term.replace(/\+/g,'%20'));
        App.vent.trigger('trigger:list:search', term);
      }
    },

    new: function() {
      App.vent.trigger('trigger:new');

      var view = new App.Views.Form();
      App.regions.drawer.show(view);

      App.vent.trigger('trigger:new:ready');
    },

    edit: function(triggerId) {
      var model = this.getTrigger(triggerId);

      if (!model) {
        this.notFound();
      } else {
        var view = new App.Views.Form({ model: model });
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
      // L.Icon.Default.imagePath = App.config.imagePath;
      App.map = this.map = L.map(options.el).setView(App.config.map.center, App.config.map.zoom);
      this.map.zoomControl.setPosition('topright');

      // L.esri.basemapLayer(App.config.map.basemap).addTo(App.map);
      L.tileLayer('http://mapattack-tiles-{s}.pdx.esri.com/dark/{z}/{y}/{x}', {
        maxZoom: 18,
        subdomains: '0123'
      }).addTo(App.map);

      this.Layers.start();
      this._eventBindings();
    },

    _eventBindings: function() {
      App.commands.setHandler('map:fit', _.bind(function(){
        var bounds = this.Layers.main.getBounds();
        var drawerWidth = this.getDrawerWidth();

        this.map.fitBounds(bounds, {
          animate: false,
          paddingTopLeft: [drawerWidth, 0]
        });
      }, this));
    },

    getDrawerWidth: function() {
      var $content = App.mainRegion.$el.find('#gt-content');
      var $drawer = $content.find('#gt-drawer-region');

      if ($content.hasClass('gt-active')){
        return $drawer.width();
      } else {
        return 0;
      }
    },

    panToLayer: function(layer) {
      var latlng;

      if (layer.getLatLng) {
        latlng = layer.getLatLng();
      } else if (layer.getCenter) {
        latlng = layer.getCenter();
      }

      var drawerWidth = this.getDrawerWidth();

      if (drawerWidth) {
        var projected = this.map.project(latlng);
        projected.x = projected.x - (drawerWidth / 2);
        latlng = this.map.unproject(projected);
      }

      if (latlng) {
        this.map.panTo(latlng, {
          animate: true
        });
      }
    },

    removeShape: function(shape) {
      this.map.removeLayer(shape);
    },

    focusShape: function(shape) {
      shape.setStyle(App.config.highlightOptions.shapeOptions);
    },

    unfocusShape: function(shape) {
      shape.setStyle(App.config.sharedOptions.shapeOptions);
    },

    polygon: function(geo, shapeOptions, add) {
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
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
      shapeOptions = shapeOptions || App.config.sharedOptions.shapeOptions;
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

  // private functions

  function processError(error) {
    // default message
    var msg = "Error creating trigger";

    // regexable error string
    var str = JSON.stringify(error);

    // out of range (polygons constructed over the dateline)
    if (null !== str.match("Coordinate values are out of range")) {
      msg = "Coordinate values are out of range";
    }

    // not found (trying to update a deleted trigger)
    if (null !== str.match("no triggers found")) {
      msg = "Deleted triggers can't be updated";
    }

    // intersects (polygons that intersect themselves)
    if (null !== str.match("Error performing intersection")) {
      msg = "Polygons can't intersect themselves";
    }

    // no message (invalid message property)
    if (null !== str.match("message:Not a valid parameter for this request")) {
      msg = "Notifications must have a valid message";
    }

    return msg;
  }

  // the model itself

  Models.Trigger = Backbone.Model.extend({

    idAttribute: 'triggerId',

    // override sync method to use geotrigger API
    sync: function(method, model, options) {
      console.log('sync:' + method);

      var triggerId = this.get('triggerId');
      var params;

      var callback = _.bind(function(error, response) {
        if (error) {
          App.vent.trigger('notify', {
            type: 'error',
            message: processError(error)
          });

          if (options && options.error) {
            options.error('Record Not Found');
          }
        } else {
          if (method !== 'read') {
            App.vent.trigger('notify', {
              message: 'Trigger ' + method + 'd successfully',
              timeout: 3500
            });
          }

          if (options && options.success) {
            options.success(response);
          }
        }
      }, this);

      switch (method) {
        case 'read':
          App.API.session.request('trigger/list', { 'triggerIds': [ triggerId ] }, callback);
          break;

        case 'create':
          params = {
            'properties' : this.get('properties'),
            'condition'  : this.get('condition'),
            'action'     : this.get('action'),
            'setTags'    : this.get('tags')
          };
          App.API.session.request('trigger/create', params, callback);
          break;

        case 'update':
          params = {
            'properties' : this.get('properties'),
            'triggerIds' : triggerId,
            'condition'  : this.get('condition'),
            'action'     : this.get('action'),
            'setTags'    : this.get('tags')
          };
          App.API.session.request('trigger/update', params, callback);
          break;

        case 'delete':
          App.API.session.request('trigger/delete', { 'triggerIds': triggerId }, callback);
          break;

        default:
          throw new Error('Unsupported method: ' + method);
      }
    },

    parse: function(response) {
      if (response.triggers) {
        return response.triggers;
      } else {
        return response;
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

      App.API.session.request('trigger/list', callback);
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
      this.listenTo(App.vent, 'draw:enable', function(tool){
        this.activate(tool);
      });
      this.listenTo(App.vent, 'draw:disable', function(tool){
        this.ui.tools.find('.gt-tool').removeClass('gt-active');
      });
    },

    handleStateChange: function(route) {
      this.clear('drawers');
      switch (route) {
        case 'new':
          this.activate('list');
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
        this.enableTool('polygon');
      }
    },

    toggleRadius: function(e) {
      if (this.ui.radius.hasClass('gt-active')) {
        this.disableTool('radius');
      } else {
        this.enableTool('radius');
      }
    },

    enableTool: function(tool) {
      this.disableTool();
      App.vent.trigger('draw:enable', tool);
    },

    disableTool: function(tool) {
      App.vent.trigger('draw:disable', tool);
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

  // Trigger Form View
  // -----------------
  //
  // Populates the edit trigger form with a preexisting trigger and handles updates.

  Views.Form = Marionette.ItemView.extend({
    template: App.Templates['form/index'],
    className: 'gt-panel',

    events: {
      // edit events
      'change .gt-geometry-type'      : 'startDrawing',

      // form events
      'click .gt-add-title'           : 'addTitle',
      'click .gt-remove-title'        : 'removeTitle',

      'click .gt-add-action'          : 'addAction',
      'click .gt-remove-action'       : 'removeAction',

      'click .gt-add-notification'    : 'addNotification',
      'click .gt-remove-notification' : 'removeNotification',

      // submit events
      'click .gt-submit'              : 'parseForm',

      // delete events
      'click .gt-item-delete'         : 'confirmDelete',
      'click .gt-reset-delete'        : 'resetDelete',
      'click .gt-item-confirm-delete' : 'destroyModel'
    },

    ui: {
      'actions'         : '.gt-actions',
      'addAction'       : '.gt-add-action',
      'form'            : 'form',
      'deleteItem'      : '.gt-item-delete',
      'confirm'         : '.gt-item-confirm-delete',
      'reset'           : '.gt-reset-delete'
    },

    // supported actions
    actions: [
      'callbackUrl',
      'notification',
      'trackingProfile'
    ],

    // supported notifications
    notifications: [
      'text',
      'url',
      'sound',
      'data',
      'icon'
    ],

    onShow: function() {
      this.buildForm();

      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    buildForm: function() {
      if (!this.model) {
        this.buildNewForm();
      } else {
        this.buildEditForm();
      }
    },

    buildNewForm: function() {
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // get shape from map
      this.parseShape();

      // add default action (notification.text)
      actionsHtml = App.Templates['form/actions/notification/index'](data);
      noteHtml = App.Templates['form/actions/notification/text'](data);

      this.actions = _.without(this.actions, 'notification');
      this.notifications = _.without(this.notifications, 'text');

      this.ui.actions.html(actionsHtml);
      this.ui.actions.find('.gt-notification-actions').html(noteHtml);
    },

    buildEditForm: function() {
      var currentActions = this.model.get('action');
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // build actions:

      // notification
      if (currentActions.hasOwnProperty('notification')) {
        actionsHtml += App.Templates['form/actions/notification/index'](data);
        this.actions = _.without(this.actions, 'notification');

        for (var prop in currentActions.notification) {
          if (currentActions.notification.hasOwnProperty(prop)) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
            this.notifications = _.without(this.notifications, prop);
          }
        }
      }

      // callback URL
      if (currentActions.hasOwnProperty('callbackUrl')) {
        actionsHtml += App.Templates['form/actions/callbackUrl'](data);
        this.actions = _.without(this.actions, 'callbackUrl');
      }

      // tracking profile
      if (currentActions.hasOwnProperty('trackingProfile')) {
        actionsHtml += App.Templates['form/actions/trackingProfile'](data);
        this.actions = _.without(this.actions, 'trackingProfile');
      }

      this.ui.actions.html(actionsHtml);

      if (this.actions.length === 0) {
        this.ui.addAction.hide();
      }

      if (noteHtml !== '') {
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);
      }

      if (this.notifications.length === 0) {
        this.ui.actions.find('.gt-add-notification').hide();
      }
    },

    addTitle: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      $(e.target).addClass('gt-hide');
      this.$el.find('.gt-title').removeClass('gt-hide');
    },

    removeTitle: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      $(e.target).closest('.gt-property').addClass('gt-hide');
      $('input[name="properties[title]"]').val('');
      this.$el.find('.gt-add-title').removeClass('gt-hide');
    },

    addAction: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var action = this.actions.pop();

      if (action === 'notification') {
        this.ui.actions.append(App.Templates['form/actions/notification/index']({}));
        this.ui.actions.find('.gt-notification-actions').html(App.Templates['form/actions/notification/text']({}));
        this.notifications = _.without(this.notifications, 'text');
      } else {
        this.ui.actions.append(App.Templates['form/actions/' + action]({}));
      }

      if (this.actions.length === 0) {
        this.ui.addAction.hide();
      }
    },

    removeAction: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).closest('.gt-property');
      var type = $el.data('action-type');

      $el.remove();

      this.actions.push(type);

      if (type === 'notification') {
        this.notifications = [
          'text',
          'url',
          'sound',
          'data',
          'icon'
        ];
      }

      this.ui.addAction.show();
    },

    addNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      this.ui.actions.find('.gt-notification-actions').append(App.Templates['form/actions/notification/' + this.notifications.pop()]({}));

      if (this.notifications.length === 0) {
        this.ui.actions.find('.gt-add-notification').hide();
      }
    },

    removeNotification: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).closest('.gt-notification-action');
      var type = $el.data('notification-type');

      console.log($el);

      $el.remove();

      this.notifications.push(type);
      this.ui.actions.find('.gt-add-notification').show();
    },

    startDrawing: function (e) {
      var tool = $(e.target).val();
      App.vent.trigger('draw:enable', tool);
      // @TODO: radius input
      // if (tool === 'radius') {
      //   this.ui.form.find('[name="radius"]').show();
      // } else {
      //   this.ui.form.find('[name="radius"]').hide();
      // }
    },

    parseShape: function() {
      var layer = App.request('draw:layer');
      window.layer = layer;
      var direction = this.ui.form.find('[name="condition[direction]"]');
      var geometry = this.ui.form.find('[name="geometry-type"]');
      // var radius = this.ui.form.find('[name="radius"]'); // @TODO: radius
      switch (true) {
        case (layer instanceof L.Polygon):
          if (direction.val() === null) {
            direction.val('enter');
          }
          geometry.val('polygon');
          break;
        case (layer instanceof L.Circle):
          if (direction.val() === null) {
            direction.val('enter');
          }
          geometry.val('radius');
          // radius.show().val(Math.round(layer.getRadius())); // @TODO: radius
          break;
      }
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
      } else {
        // at least one tag required
      }

      if (data.condition && data.condition.geo) {

      } else {
        // condition and condition.geo required
      }

      if (data.action) {
        // tracking profile
        if (!data.action.trackingProfile ||
            data.action.trackingProfile === '---') {
          data.action.trackingProfile = null;
        }

        // callback URL
        if (!data.action.callbackUrl) {
          data.action.callbackUrl = null;
        }
      } else {
        // at least one action required
      }

      if (data && data.tags && data.condition && data.action) {
        this.createOrUpdateTrigger(data);
      }
    },

    createOrUpdateTrigger: function(data) {
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

      if (!this.model) {
        App.vent.trigger('trigger:create', data);
      } else {
        data.triggerId = this.model.get('triggerId');
        App.vent.trigger('trigger:update', data);
      }
    },

    confirmDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout-right');
    },

    resetDelete: function(e) {
      e.preventDefault();
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout-right');
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
      'keyup .gt-search'     : 'filter'
    },

    ui: {
      'header'     : '.gt-list-header',
      'search'     : '.gt-search input',
      'results'    : '.gt-results'
    },

    onShow: function() {
      this.headerCheck();
      this.listenTo(this.collection, 'change reset add remove', this.headerCheck);
      this.listenTo(App.vent, 'trigger:list:search', this.search);
      this.listenTo(App.vent, 'trigger:list:reset', this.clearFilter);
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
      this.$el.removeClass('gt-filtering');
    },

    filter: function(e) {
      var value = this.ui.search.val();

      if (!value.length) {
        this.$el.removeClass('gt-filtering');
        if (Backbone.history.fragment !== 'list') {
          App.router.navigate('list', { trigger: false });
        }
      } else if (typeof e !== 'undefined' && e.keyCode === 13) {
        App.router.navigate('list?q=' + encodeURIComponent(value).replace(/%20/g, '+'), { trigger: true });
      } else {
        this.$el.addClass('gt-filtering');

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

      var type = this.model.get('type') || 'info';
      this.$el.addClass(type);

      this.listenTo(App.vent, 'notify:clear', this.destroyNotification);
    },

    onShow: function() {
      this.$el.fadeIn();
      var timeout = this.model.get('timeout');
      if (typeof timeout === 'number') {
        setTimeout(_.bind(function() {
          this.destroyNotification();
        }, this), timeout);
      }
    },

    destroyNotification: function() {
      this.$el.fadeOut(_.bind(function(){
        this.model.destroy();
      }, this));
    }
  });

  Views.NotificationList = Marionette.CollectionView.extend({
    itemView: Views.Notification,
    className: 'gt-notification-list',
    tagName: 'ul'
  });
});
