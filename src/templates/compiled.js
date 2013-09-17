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

this["GeotriggerEditor"]["Templates"]["form"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
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
  
  
  return "\n          <option value='enter'>enters</option>\n          <option value='leave'>leaves</option>\n          ";
  }

function program7(depth0,data) {
  
  
  return "\n          <option value='polygon'>polygon</option>\n          <option value='radius'>circle</option>\n          ";
  }

function program9(depth0,data) {
  
  
  return "\n              <option value='fine'>fine</option>\n              <option value='adaptive'>adaptive</option>\n              <option value='rough'>rough</option>\n              <option value='off'>off</option>\n              ";
  }

function program11(depth0,data) {
  
  
  return "\n      <ul class='gt-edit-controls'>\n        <li>\n          <a class='gt-reset-delete' href='#'>&#x2716;</a>\n        </li>\n        <li>\n          <button class='gt-item-delete gt-button-delete'></button>\n        </li>\n      </ul>\n      ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>";
  stack1 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-edit'>\n    <section class='gt-form-section'>\n      <label for='tags'>\n        <span class='gt-label-left'>When a device tagged</span>\n        <input type='text' name='tags' placeholder='enter tags' class='gt-input-right' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || depth0.tagList),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagList", depth0.tags, options)))
    + "'>\n      </label>\n\n      <label for='condition'>\n        <select name='condition[direction]' class='gt-direction'>\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </select>\n\n        <span>a</span>\n\n        <select name='geometry-type' class='gt-input-right'>\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.selectShape || depth0.selectShape),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "selectShape", depth0.condition, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </select>\n      </label>\n\n      <div class='gt-actions'>\n        <label for=\"action\">\n          <select name='action-select' class='gt-label-block gt-input-wide'>\n            <option value='notification'>send a notification</option>\n            <option value='callbackUrl'>post the a server</option>\n            <option value='trackingProfile'>change the tracking profile</option>\n          </select>\n        </label>\n\n        <label for='gt-notifications' class=\"gt-trigger-event\">\n          <!-- Action One -->\n          <label for='gt-notification-action'>\n            <span class='gt-label-left'> to the device with</span>\n            <select class='gt-input-right'>\n              <option value='message'>a message:</option>\n              <option value='sound'>a sound:</option>\n              <option value='data'>data:</option>\n              <option value='url'>a URL:</option>\n              <option value='icon'>an icon:</option>\n            </select>\n          </label>\n\n          <label class='gt-action'>\n            <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n          </label>\n\n          <!-- Next Action -->\n          <label for='gt-notification-action'>\n            <span class='gt-label-left'>and </span>\n            <select class='gt-input-left'>\n              <!-- <option value='message'>a message:</option> -->\n              <option value='sound'>a sound:</option>\n              <option value='data'>data:</option>\n              <option value='url'>a URL:</option>\n              <option value='icon'>an icon:</option>\n            </select>\n\n            <input class='gt-input-wide' type='text' name='action[notification][sound]' placeholder='sound' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.sound)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n          </label>\n\n\n          <!-- Next Action -->\n          <label for='gt-notification-action'>\n            <span class='gt-label-left'>and </span>\n            <select class='gt-input-left'>\n              <!-- <option value='message'>a message:</option> -->\n              <!-- <option value='sound'>a sound:</option> -->\n              <option value='data'>data:</option>\n              <option value='url'>a URL:</option>\n              <option value='icon'>an icon:</option>\n            </select>\n          <!-- </label> -->\n\n          <!-- <label class='gt-action'> -->\n            <textarea class='gt-input-wide' name='action[notification][data]' placeholder='{ your: \"data\" }'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.data)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n          </label>\n\n          <!-- Next Action -->\n          <label for='gt-notification-action'>\n            <span class='gt-label-left'>and </span>\n            <select class='gt-input-left'>\n              <!-- <option value='message'>a message:</option> -->\n              <!-- <option value='sound'>a sound:</option> -->\n              <!-- <option value='data'>data:</option> -->\n              <option value='url'>a URL:</option>\n              <option value='icon'>an icon:</option>\n            </select>\n\n            <input class='gt-input-wide' type='text' name='action[notification][url]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n          </label>\n\n          <!-- Next Action -->\n          <label for='gt-notification-action'>\n            <span class='gt-label-left'>and </span>\n            <select class='gt-input-left'>\n              <!-- <option value='message'>a message:</option> -->\n              <!-- <option value='sound'>a sound:</option> -->\n              <!-- <option value='data'>data:</option> -->\n              <!-- <option value='url'>a URL:</option> -->\n              <option value='icon'>an icon:</option>\n            </select>\n\n             <input class='gt-input-wide' type='text' name='action[notification][icon]' placeholder='icon' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n          </label>\n\n          <span class=\"gt-add-notification-event\"><a href=\"#\">+ add an action</a></span>\n        </label>\n\n      <div class='gt-actions'>\n        <label for='action' class=\"gt-trigger-event\">\n          <label>\n            <span class='gt-label-left'>also </span>\n            <select name='action-select' class='gt-input-right gt-label-block gt-input-wide'>\n              <!-- <option vlaue='notification'>send a notification</option> -->\n              <option value='trackingProfile'>change the tracking profile</option>\n              <option value='callbackUrl'>post the a server</option>\n            </select>\n          </label>\n\n          <label for='gt-trackingProfile-action'>\n            <span class='gt-label-left'>to </span>\n            <select class='gt-input-right' name='action[trackingProfile]'>\n              <option>---</option>\n              ";
  options = {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n            </select>\n          </label>\n        </label>\n      </div>\n\n      <div class='gt-actions'>\n        <label for='action' class=\"gt-trigger-event\">\n          <label>\n            <span class='gt-label-left'>and </span>\n            <select name='action-select' class='gt-input-right gt-label-block gt-input-wide'>\n              <!-- <option vlaue='notification'>send a notification</option> -->\n              <!-- <option value='trackingProfile'>change the tracking profile</option> -->\n              <option value='callbackUrl'>post to a server</option>\n            </select>\n          </label>\n\n          <label for='gt-postUrl-action'>\n            <input class='gt-input-fill' type='text' name='action[callbackUrl]' placeholder='http://' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.callbackUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n          </label>\n        </label>\n      </div>\n\n      <span class=\"gt-add-notification-event\"><a class='gt-button' href=\"#\">+ add an event</a></span>\n    </section>\n\n    <section class='gt-form-section gt-nick-wrapper'>\n      <label for='title'>\n        <span class='gt-label-left'>Title <em>(optional)</em></span>\n        <input class='gt-input-right' type='text' name='properties[title]' placeholder='My Cool Trigger' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n      </label>\n    </section>\n\n    <section class='gt-form-section'>\n      <button class='gt-button gt-button-blue gt-submit'>Update</button>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.triggerId, {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
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
  buffer += "\n  <a class='gt-item-edit' href='#";
  if (stack1 = helpers.triggerId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.triggerId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/edit'>\n    <span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</span>\n  </a>\n  ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "gt-item-details-visible";
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
    + " gt-icon-polygon'></span>\n<h5>\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  <a class='gt-item-details ";
  stack2 = helpers.unless.call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "' href='#";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/edit'>\n    <span>";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.defaultTitle || depth0.defaultTitle),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "defaultTitle", depth0.condition, options)))
    + "</span>\n  </a>\n</h5>\n<div class='gt-item-toolbar'>\n  <a class='gt-edit-icon' href='#";
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
  buffer += "?</h5>\n  <button class='gt-confirm-delete gt-button-small gt-button-delete'>Delete</button>\n  <button class='gt-cancel-delete gt-button-small gt-button gt-button-cancel'>Cancel</button>\n</div>";
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