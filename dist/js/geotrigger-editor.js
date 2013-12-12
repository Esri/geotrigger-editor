/*! geotrigger-editor - v0.1.1 - 2013-12-11
*   https://github.com/Esri/geotrigger-editor
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
*   Apache 2.0 License */

!(function(){

this.GeotriggerEditor = new Backbone.Marionette.Application();

GeotriggerEditor.addInitializer(function(options) {
  this.Config.start(options);
  this.API.start();
  this.regions = new this.Layouts.Main();
  this.addRegions({ mainRegion: this.config.el });
  this.mainRegion.show(this.regions);
});


this["GeotriggerEditor"] = this["GeotriggerEditor"] || {};
this["GeotriggerEditor"]["Templates"] = this["GeotriggerEditor"]["Templates"] || {};

this["GeotriggerEditor"]["Templates"]["controls"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};



  return "<div class=\"gt-drawer-controls\">\n  <a href=\"#list\" class=\"gt-tool gt-tool-list active gt-tooltip\"><span>List</span></a>\n</div>\n<div class=\"gt-tool-controls\">\n  <button class=\"gt-tool gt-tool-polygon gt-tooltip\"><span>New Polygon Tool</span></button>\n  <button class=\"gt-tool gt-tool-radius gt-tooltip\"><span>New Radius Tool</span></button>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["empty"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};



  return "<div class=\"gt-panel-top-bar\">\n  <h3 class=\"gt-panel-top-bar-left\">List <span class=\"gt-trigger-count\"></span></h3>\n  <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n</div>\n\n<div class=\"gt-panel-no-triggers\">\n  <h5>This application doesn't have any Geotrigger rules yet.</h5>\n</div>\n\n<ul class=\"gt-tool-descriptions\">\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-create\"></span>\n    <h5>Create a New Trigger</h5>\n    <p>Create a new Geotrigger rule by first using one of the drawing tools, then defining its properties in the form that appears.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-polygon\"></span>\n    <h5>Using the Polygon Tool</h5>\n    <p>Click on the map to create each point of a polygon. Click on the first point you created to close the shape.</p>\n  </li>\n\n  <li class=\"gt-tool-description\">\n    <span class=\"gt-icon gt-icon-radius\"></span>\n    <h5>Using the Radius Tool</h5>\n    <p>Click a point on the map, then hold and drag to define a radius around that point.</p>\n  </li>\n</ul>\n";
  });

this["GeotriggerEditor"]["Templates"]["form/actions/callbackUrl"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-action=\"callbackUrl\" class='gt-property'>\n  <div class=\"gt-property-header\">\n    notify this URL\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-property-item\">\n    <input class='gt-input-fill' type='text' name='action[callbackUrl]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.callbackUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/data"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification='data' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][data]'>\n    <span class='gt-label-left'>some data:</span>\n  </label>\n\n  <div class=\"gt-notification-center\">\n    <textarea class='gt-input' name='action[notification][data]' placeholder='{ \"your\": \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/icon"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification='icon' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][icon]'>\n    <span class='gt-label-left'>an icon:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/index"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};



  return "<div data-action=\"notification\" class=\"gt-property\">\n  <div class=\"gt-property-header\">\n    send a notification to the device with..\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-notification-actions\"></div>\n\n  <div class=\"gt-property-item gt-btn-group\">\n    <button data-notification=\"text\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-notification\">&#043; a message</button>\n    <button data-notification=\"url\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-notification\">&#043; a URL</button>\n    <button data-notification=\"data\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-notification\">&#043; some data</button>\n    <button data-notification=\"icon\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-notification\">&#043; an icon</button>\n    <button data-notification=\"sound\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-notification\">&#043; a sound</button>\n  </div>\n</div>";
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/sound"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification='sound' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][sound]'>\n    <span class='gt-label-left'>a sound:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/text"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification='text' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][text]'>\n    <span class='gt-label-left'>a message:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n  </div>\n\n  <div class='gt-notification-right'>\n    <a class=\"gt-remove-notification gt-delete-icon\"></a>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/actions/notification/url"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div data-notification='url' class='gt-property-item gt-notification-action'>\n  <label class=\"gt-notification-left\" for='action[notification][url]'>\n    <span class='gt-label-left'>a URL:</span>\n  </label>\n\n  <div class='gt-notification-center'>\n    <input class='gt-input' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
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

  buffer += "<div data-action=\"trackingProfile\" class=\"gt-property\">\n  <div class=\"gt-property-header\">\n    change the device's tracking profile\n    <a class=\"gt-remove-action gt-delete-icon\"></a>\n  </div>\n\n  <div class=\"gt-property-item\">\n    <select class=\"gt-select-full\" name=\"action[trackingProfile]\">\n      ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.select || (depth0 && depth0.select)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = (depth0 && depth0.action)),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </select>\n  </div>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["form/index"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function";

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

  var buffer = "", stack1, options;
  buffer += "\n            <span class=\"gt-shape-indicator\">a ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.shape || (depth0 && depth0.shape)),stack1 ? stack1.call(depth0, (depth0 && depth0.condition), options) : helperMissing.call(depth0, "shape", (depth0 && depth0.condition), options)))
    + "</span>\n            ";
  return buffer;
  }

function program9(depth0,data) {


  return "\n            <span class=\"gt-shape-indicator\">a...</span>\n            ";
  }

function program11(depth0,data) {


  return " gt-hide";
  }

function program13(depth0,data) {


  return "\n      <button class='gt-button gt-button-blue gt-submit'>Update</button>\n      <ul class='gt-edit-controls'>\n        <li>\n          <a class='gt-reset-delete' href='#'>&#x2716;</a>\n        </li>\n        <li>\n          <button class='gt-item-delete gt-button-delete'></button>\n        </li>\n      </ul>\n      ";
  }

function program15(depth0,data) {


  return "\n      <button class='gt-button gt-button-blue gt-submit'>Save</button>\n      ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.triggerId), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-edit'>\n\n    <section class='gt-form-section gt-conditions'>\n      <div class=\"gt-property\">\n        <div class=\"gt-property-header\">When a device with one of the following tags..</div>\n\n        <div class=\"gt-property-item\">\n          <textarea class='gt-input' name='tags' placeholder='enter any number of tags separated by commas'>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || (depth0 && depth0.tagList)),stack1 ? stack1.call(depth0, (depth0 && depth0.tags), options) : helperMissing.call(depth0, "tagList", (depth0 && depth0.tags), options)))
    + "</textarea>\n        </div>\n\n        <div class=\"gt-property-item\">\n            <select name='condition[direction]' class='gt-direction'>\n              ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || (depth0 && depth0.select)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </select>\n\n            ";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.condition), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            <input name=\"geometry-type\" type=\"hidden\" value=\"";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.shape || (depth0 && depth0.shape)),stack1 ? stack1.call(depth0, (depth0 && depth0.condition), options) : helperMissing.call(depth0, "shape", (depth0 && depth0.condition), options)))
    + "\">\n        </div>\n      </div>\n    </section>\n\n    <section class=\"gt-form-section gt-actions\"></section>\n\n    <section class=\"gt-form-section gt-action-toggles\">\n      <button data-action=\"notification\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-action\">&#043; send a notification</button>\n      <button data-action=\"callbackUrl\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-action\">&#043; post to a callback URL</button>\n      <button data-action=\"trackingProfile\" class=\"gt-button gt-button-light-gray gt-button-small gt-add-action\">&#043; change the tracking profile</button>\n    </section>\n\n    <section class=\"gt-form-section gt-title-wrapper\">\n      <button class=\"gt-button gt-button-light-gray gt-button-small gt-add-title";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">&#043; add a title</button>\n\n      <div class='gt-title gt-property";
  stack2 = helpers.unless.call(depth0, ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "'>\n        <div class=\"gt-property-header\">\n          Title\n          <a class=\"gt-remove-title gt-delete-icon\"></a>\n        </div>\n\n        <div class=\"gt-property-item\">\n          <input class='gt-input-fill' type='text' name='properties[title]' placeholder='Geotrigger Title' value='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n        </div>\n      </div>\n    </section>\n\n    <section class='gt-form-section gt-submit-wrapper'>\n      ";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.triggerId), {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
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
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n    ";
  return buffer;
  }

function program3(depth0,data) {

  var buffer = "", stack1, options;
  buffer += "\n      <span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.defaultTitle || (depth0 && depth0.defaultTitle)),stack1 ? stack1.call(depth0, (depth0 && depth0.condition), options) : helperMissing.call(depth0, "defaultTitle", (depth0 && depth0.condition), options)))
    + "</span>\n    ";
  return buffer;
  }

function program5(depth0,data) {

  var stack1;
  return escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program7(depth0,data) {

  var stack1, options;
  options = {hash:{},data:data};
  return escapeExpression(((stack1 = helpers.defaultTitle || (depth0 && depth0.defaultTitle)),stack1 ? stack1.call(depth0, (depth0 && depth0.condition), options) : helperMissing.call(depth0, "defaultTitle", (depth0 && depth0.condition), options)));
  }

  buffer += "<span class='gt-item-edit gt-icon ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.actionIcon || (depth0 && depth0.actionIcon)),stack1 ? stack1.call(depth0, ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.direction), ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.geo), options) : helperMissing.call(depth0, "actionIcon", ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.direction), ((stack1 = (depth0 && depth0.condition)),stack1 == null || stack1 === false ? stack1 : stack1.geo), options)))
    + " gt-icon-polygon'></span>\n<h5>\n  <a class='gt-item-edit' href='#edit/";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.triggerId); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n    ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </a>\n</h5>\n<div class='gt-item-toolbar'>\n  <a class='gt-edit-icon' href='#edit/";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.triggerId); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'></a>\n  <a class='gt-delete-icon' href='#'></a>\n</div>\n<div class='gt-tags'>\n  <strong>Tags</strong><span>:</span> ";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.tagLinks || (depth0 && depth0.tagLinks)),stack1 ? stack1.call(depth0, (depth0 && depth0.tags), options) : helperMissing.call(depth0, "tagLinks", (depth0 && depth0.tags), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n<div class='gt-id'>\n  <strong>ID</strong><span>:</span> <a href=\"#list/";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.triggerId); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\">";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.triggerId); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</a>\n</div>\n<div class='gt-list-delete'>\n  <h5>Delete ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.properties)),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "?</h5>\n  <button class='gt-confirm-delete gt-button-small gt-button-delete'>Delete</button>\n  <button class='gt-cancel-delete gt-button-small gt-button gt-button-gray'>Cancel</button>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"gt-list-header gt-hide\">\n  <div class=\"gt-panel-top-bar\">\n    <h3 class=\"gt-panel-top-bar-left\">List <span class=\"gt-trigger-count\">(";
  if (stack1 = helpers.count) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.count); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ")</span></h3>\n    <a href=\"#\" class=\"gt-panel-top-bar-button gt-close-drawer\"></a>\n  </div>\n  <div class=\"gt-search\">\n    <input type=\"search\" placeholder=\"Search\"><a href=\"#list\" class=\"gt-icon-clear\"></a>\n  </div>\n</div>\n<ul class=\"gt-results\"></ul>";
  return buffer;
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
  else { stack1 = (depth0 && depth0.message); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

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

// string polyfill
// http://jsperf.com/trim-polyfill
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  }
}


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

  this.startWithParent = false;

  // Geotrigger API
  // --------------

  function createSession () {
    if (!App.config.session ||
        !App.config.session.clientId ||
        !App.config.session.clientSecret) {
      throw new Error('GeotriggerEditor requires a `session` object with `clientId` and `clientSecret` properties');
    }

    this.session = new Geotrigger.Session(App.config.session);
  }

  API.addInitializer(createSession);

});


GeotriggerEditor.module('Config', function(Config, App, Backbone, Marionette, $, _) {

  this.startWithParent = false;

  // App Configuration
  // -----------------

  // default shape options

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

  // default configuration

  var defaults = {

    el: '#gt-editor',

    session: {},

    map: {
      basemap: 'Streets',
      center: [0, 0],
      zoom: 2,
      options: {}
    },

    fitOnLoad: true,

    imagePath: '/images',
    sharedOptions: sharedOptions,
    editOptions: editOptions,
    highlightOptions: highlightOptions

  };

  // merge options into defaults on initialization

  function setup (options) {
    App.config = _.deepExtend(defaults, options);
  }

  Config.addInitializer(setup);

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

  util.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  util.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
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
      App.vent.on('draw:new', this.editLayer, this);
      App.vent.on('index trigger:list trigger:edit', this.clear, this);
      App.vent.on('trigger:new:ready', this.panToNewTrigger, this);
      App.vent.on('trigger:edit', this.panToTrigger, this);
      App.vent.on('draw:enable', this.enableTool, this);
      App.vent.on('draw:disable', this.disableTool, this);

      App.map.on('draw:created', this.broadcastLayer);

      App.reqres.setHandler('draw:layer', this.getEditLayer, this);
      App.commands.setHandler('draw:clear', this.clear, this);
    },

    panToNewTrigger: function() {
      var layer = App.request('draw:layer');
      if (layer) {
        App.Map.panToLayer(layer);
      }
    },

    panToTrigger: function (triggerId) {
      var layer = this.newShape(triggerId);
      this.editLayer(layer);
      App.Map.panToLayer(layer);
    },

    broadcastLayer: function (e) {
      var type = e.layerType;
      var layer = e.layer;

      App.vent.trigger('draw:new', layer);
    },

    getEditLayer: function() {
      return App.Map.Layers.edit.getLayers()[0];
    },

    newShape: function(triggerId) {
      var model = App.collections.triggers.get(triggerId);
      var id = model.get('triggerId');
      var geo = model.get('condition').geo;
      var shape;

      // circle
      if (geo.distance) {
        shape = App.Map.circle(geo, App.config.editOptions.shapeOptions, false);
      }

      // polygon
      else if (geo.geojson) {
        shape = App.Map.polygon(geo.geojson, App.config.editOptions.shapeOptions, false).getLayers()[0];
      }

      // invalid shape
      else {
        if (console && console.error) {
          console.error('invalid geo data', geo);
        }
        return;
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
      'list/:term': 'list',
      'new': 'create',
      'edit/:id': 'edit',
      '*notfound': 'notFound'
    }
  });

  // Editor Controller (Mediator)
  // ------------------------------
  //
  // Control the workflow and logic that exists at the application
  // level, above the implementation detail of views and models

  var Controller = function() {};

  _.extend(Controller.prototype, {

    // initialization
    start: function() {
      this.setup();

      App.vent.trigger('notify', 'Getting triggers');

      App.collections.triggers.fetch({
        fetch: true,
        reset: true,
        success: function (model, response, options) {
          App.vent.trigger('notify:clear');

          // don't start history until triggers have been fetched
          Backbone.history.start();

          if (response && response.length === 0) {
            App.router.navigate('list', { trigger: true });
          }

          else if (App.config.fitOnLoad && !Backbone.history.fragment.match('edit')) {
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
        var model = new Backbone.Model({ count: App.collections.triggers.length });
        var view = new App.Views.List({ model: model, collection: App.collections.triggers });
        App.regions.drawer.show(view);
      } else if (!term) {
        App.vent.trigger('trigger:list:reset');
      }

      if (term) {
        term = decodeURIComponent(term.replace(/\+/g,'%20'));
        App.vent.trigger('trigger:list:search', term);
      }
    },

    create: function() {
      App.vent.trigger('trigger:new');

      var view = new App.Views.Form();
      App.regions.drawer.show(view);

      App.vent.trigger('trigger:new:ready');
    },

    edit: function(triggerId) {
      var model = this.getTrigger(triggerId);

      if (!model) {
        App.vent.trigger('notify', {
          type: 'error',
          message: 'That trigger doesn\'t exist!'
        });
      } else {
        var view = new App.Views.Form({ model: model });
        App.regions.drawer.show(view);
        App.vent.trigger('trigger:edit', triggerId);
        view.parseShape();
      }
    },

    notFound: function() {
      App.vent.trigger('notify', {
        type: 'error',
        message: 'Couldn\'t find page: "' + Backbone.history.fragment + '"'
      });
    },

    // crud

    createTrigger: function(triggerData) {
      App.execute('draw:clear');
      App.collections.triggers.create(triggerData, {
        // wait: true, // wait is broken in backbone 1.1.0
        success: function() {
          App.router.navigate('list', { trigger: true });
        }
      });
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
  // existing triggers and displaying them.

  Editor.addInitializer(function() {
    // initialize collections
    App.collections = App.collections || {};
    App.collections.triggers = new App.Models.Triggers();
    App.collections.notifications = new App.Models.Notifications();

    // initialize controller
    var controller = new Controller();

    // initialize router
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

      // force L.esri to use JSONP if proxy is set
      if (App.config.session.proxy) {
        L.esri.get = L.esri.RequestHandlers.JSONP;
      }

      App.map = this.map = L.map(options.el).setView(App.config.map.center, App.config.map.zoom);

      this.map.zoomControl.setPosition('topright');

      // allow multiple basemaps
      if (App.util.isArray(App.config.map.basemaps)) {
        for (var i = 0; i < App.config.map.basemaps.length; i++) {
          L.esri.basemapLayer(App.config.map.basemaps[i], App.config.map.options).addTo(App.map);
        }
      }

      // default to one basemap
      else {
        L.esri.basemapLayer(App.config.map.basemap, App.config.map.options).addTo(App.map);
      }

      this.Layers.start();
      this._eventBindings();
    },

    _eventBindings: function() {
      App.commands.setHandler('map:fit', _.bind(function(){
        if (this.Layers.main.getLayers().length === 0) {
          return;
        }

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
    }
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

  // Notification Collection
  // -----------------------

  Models.Notifications = Backbone.Collection.extend({
    model: Models.Notification
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

  // Trigger Collection
  // ------------------

  Models.Triggers = Backbone.Collection.extend({
    model: Models.Trigger,

    fetch: function(options) {
      var callback = _.bind(function(error, response) {
        if(options && options.reset){
          this.reset(this.parse(response));
        } else {
          this.set(this.parse(response));
        }

        if (options && options.success) {
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
  // handles both new and edit views for triggers
  // (new) builds a blank form for a new trigger
  // (edit) populates the form with a preexisting trigger
  // either way this view builds the object to be submitted to the API and handles client-side validation

  Views.Form = Marionette.ItemView.extend({
    template: App.Templates['form/index'],
    className: 'gt-panel',

    events: {
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

    onShow: function() {
      if (!this.model) {
        this.buildNewForm();
      } else {
        this.buildEditForm();
      }

      this.listenTo(App.vent, 'draw:new', this.parseShape);
    },

    buildNewForm: function() {
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';

      // get shape from map
      this.parseShape();

      // build html for default action (notification.text)
      actionsHtml = App.Templates['form/actions/notification/index'](data);
      noteHtml = App.Templates['form/actions/notification/text'](data);

      // inject html into DOM
      this.ui.actions.html(actionsHtml);
      this.ui.actions.find('.gt-notification-actions').html(noteHtml);

      // hide add action and add notification buttons
      this.ui.form.find('.gt-add-action[data-action="notification"]').hide();
      this.ui.form.find('.gt-add-notification[data-notification="text"]').hide();
    },

    buildEditForm: function() {
      // get current actions
      var currentActions = this.model.get('action');

      // get data
      var data = this.serializeData();

      var actionsHtml = '';
      var noteHtml = '';
      var prop;

      // build actions:

      // notification
      if ('undefined' !== typeof currentActions['notification']) {
        actionsHtml += App.Templates['form/actions/notification/index'](data);
        this.ui.form.find('.gt-add-action[data-action="notification"]').hide();

        // build notification form elements if they exist
        for (prop in currentActions.notification) {
          if ('undefined' !== typeof currentActions.notification[prop]) {
            noteHtml += App.Templates['form/actions/notification/' + prop](data);
          }
        }
      }

      // callback URL
      if ('undefined' !== typeof currentActions['callbackUrl']) {
        actionsHtml += App.Templates['form/actions/callbackUrl'](data);
        this.ui.form.find('.gt-add-action[data-action="callbackUrl"]').hide();
      }

      // tracking profile
      if ('undefined' !== typeof currentActions['trackingProfile']) {
        actionsHtml += App.Templates['form/actions/trackingProfile'](data);
        this.ui.form.find('.gt-add-action[data-action="trackingProfile"]').hide();
      }

      // insert actions form elements into their proper place
      this.ui.actions.html(actionsHtml);

      // insert notification form elements if they exist
      if (noteHtml !== '') {
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);

        // hide add buttons for properties that already exist
        for (prop in currentActions.notification) {
          if ('undefined' !== typeof currentActions.notification[prop]) {
            var $notification = this.ui.form.find('.gt-add-notification[data-notification="' + prop + '"]');
            $notification.hide();
          }
        }
      }
    },

    addTitle: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide add title button
      $(e.target).addClass('gt-hide');

      // show title form element
      this.$el.find('.gt-title').removeClass('gt-hide');
    },

    removeTitle: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide title form element
      $(e.target).closest('.gt-property').addClass('gt-hide');

      // clear title value
      this.ui.form.find('input[name="properties[title]"]').val('');

      // show add title button
      this.ui.form.find('.gt-add-title').removeClass('gt-hide');
    },

    addAction: function(e) {
      var $el, action, actionHtml, noteHtml;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target);
        action = $el.data('action');
      }

      // support for addAction being called internally with string param representing action name
      else if (typeof e === 'string') {
        action = e;
        $el = this.ui.form.find(".gt-add-action[data-action='" + action + "']");
      }

      // extra work if action type is notification
      if (action === 'notification') {
        // build html
        actionHtml = App.Templates['form/actions/notification/index']({});
        noteHtml = App.Templates['form/actions/notification/text']({});

        // add to DOM
        this.ui.actions.append(actionHtml);
        this.ui.actions.find('.gt-notification-actions').html(noteHtml);

        // hide notification button
        this.ui.form.find('.gt-add-notification[data-notification="text"]').hide();
      }

      // default
      else {
        // build html
        actionHtml = App.Templates['form/actions/' + action]({});

        // add to DOM
        this.ui.actions.append(actionHtml);
      }

      // hide action button
      $el.hide();
    },

    removeAction: function(e) {
      var $el, action;

      // expects to be invoked by a DOM event by default
      if (typeof e === 'object' && e.preventDefault) {
        e.preventDefault();
        $el = $(e.target).closest('.gt-property');
        action = $el.data('action');
      }

      // support for addAction being called internally with string param representing action name
      else if (typeof e === 'string') {
        action = e;
        $el = this.ui.form.find(".gt-property[data-action='" + action + "']");
      }

      // remove action form element
      $el.remove();

      // show add action button
      this.ui.form.find('.gt-add-action[data-action="' + action + '"]').show();
    },

    addNotification: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target);
      var notification = $el.data('notification');
      var html = App.Templates['form/actions/notification/' + notification]({});

      // add notification to notification actions section
      this.ui.actions.find('.gt-notification-actions').append(html);

      // hide add notification button
      $el.hide();
    },

    removeNotification: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var $el = $(e.target).closest('.gt-notification-action');
      var notification = $el.data('notification');

      // remove notification form element
      $el.remove();

      // show add notification button
      this.ui.form.find('.gt-add-notification[data-notification="' + notification + '"]').show();
    },

    parseShape: function() {
      var lat, lng, rad;

      // get layer data
      var layer = App.request('draw:layer');

      // DOM references
      var direction = this.ui.form.find('[name="condition[direction]"]');
      var geometry = this.ui.form.find('[name="geometry-type"]');
      var shape = this.ui.form.find('.gt-shape-indicator');
      var sections = this.ui.form.find('.gt-form-section');

      // default direction to enter if it's not already set
      if (direction.val() === null) {
        direction.val('enter');
      }

      // layer is polygon
      if (layer instanceof L.Polygon) {
        lat = Math.round(layer.getCenter().lat * 10000) / 10000;
        lng = Math.round(layer.getCenter().lng * 10000) / 10000;
        geometry.val('polygon');
        shape.text('a polygon around ' + lat + ', ' + lng);
        sections.show();
      }

      // layer is radius
      else if (layer instanceof L.Circle) {
        lat = Math.round(layer.getLatLng().lat * 10000) / 10000;
        lng = Math.round(layer.getLatLng().lng * 10000) / 10000;
        rad = Math.round(layer.getRadius());
        geometry.val('radius');
        shape.text('a ' + rad + 'm radius around ' + lat + ', ' + lng);
        sections.show();
      }

      // hide all form sections besides condition if a shape hasn't been drawn yet
      else {
        sections.filter(':not(:first-child)').hide();
      }
    },

    parseForm: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      var data = this.ui.form.serializeObject();

      // clean data
      data = App.util.removeEmptyStrings(data);

      // clean tags
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

      // condition validation
      if (!data.condition || !data.condition.geo) {
        // condition and condition.geo required
      }

      // action validation
      if (data.action) {
        // tracking profile
        if (!data.action.trackingProfile) {
          data.action.trackingProfile = null;
        }

        // callback URL
        if (!data.action.callbackUrl) {
          data.action.callbackUrl = null;
        }
      } else {
        // at least one action required
      }

      // create or update if all requirements have been satisfied
      if (data && data.tags && data.condition && data.action) {
        this.createOrUpdateTrigger(data);
      }
    },

    createOrUpdateTrigger: function(data) {
      // get layer data
      var layer = App.request('draw:layer');

      // layer is polygon
      if (layer instanceof L.Polygon) {
        data.condition.geo = {
          'geojson': layer.toGeoJSON()
        };
      }

      // layer is radius
      else if (layer instanceof L.Circle) {
        var latlng = layer.getLatLng();
        data.condition.geo = {
          'latitude': latlng.lat,
          'longitude': latlng.lng,
          'distance': Math.round(layer.getRadius())
        };
      }

      // something went horribly wrong!
      else {
        throw new Error('Invalid layer data');
      }

      // create new trigger
      if (!this.model) {
        App.vent.trigger('trigger:create', data);
      }

      // update existing trigger
      else {
        data.triggerId = this.model.get('triggerId');
        App.vent.trigger('trigger:update', data);
      }
    },

    confirmDelete: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // show confirmation state
      this.ui.deleteItem.addClass('gt-item-confirm-delete');
      this.ui.reset.addClass('gt-reset-flyout-right');
    },

    resetDelete: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // hide confirmation state
      this.ui.deleteItem.removeClass('gt-item-confirm-delete');
      this.ui.reset.removeClass('gt-reset-flyout-right');
    },

    destroyModel: function(e) {
      // expects to be invoked by a DOM event by default
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // broadcast trigger:destroy event with model info
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
      App.router.navigate('edit/' + id, { trigger: true });
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
      'keyup .gt-search'     : 'filter',
      'click .gt-icon-clear' : 'clearFilter'
    },

    ui: {
      'header'     : '.gt-list-header',
      'search'     : '.gt-search input',
      'results'    : '.gt-results'
    },

    onShow: function() {
      this.refresh();
      this.listenTo(this.collection, 'change reset add remove', this.refresh);
      this.listenTo(App.vent, 'trigger:list:search', this.search);
      this.listenTo(App.vent, 'trigger:list:reset', this.clearFilter);
    },

    refresh: function() {
      var count = this.collection.length;
      this.model.set('count', count);

      this.render();

      if (!count) {
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
        var route = 'list/' + encodeURIComponent(value).replace(/%20/g, '+');
        App.router.navigate(route, { trigger: true });
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

      // circle
      if (geo.distance) {
        this._shape = App.Map.circle(geo);
      }

      // polygon
      else if (geo.geojson) {
        this._shape = App.Map.polygon(geo.geojson);
      }

      // invalid shape
      else {
        if (console && console.error) {
          console.error('invalid geo data', geo);
        }
        return;
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


})();