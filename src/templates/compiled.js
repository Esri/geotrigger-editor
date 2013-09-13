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

this["GeotriggerEditor"]["Templates"]["edit"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function";

function program1(depth0,data) {
  
  
  return "\n        <option value='enter'>enters</option>\n        <option value='leave'>leaves</option>\n        ";
  }

function program3(depth0,data) {
  
  
  return "\n        <option value='polygon'>polygon</option>\n        <option value='radius'>circle</option>\n        ";
  }

function program5(depth0,data) {
  
  
  return "\n        <option value='notification'>send the device a message</option>\n        <option value='callbackUrl'>post to a server</option>\n        <option value='trackingProfile'>change tracking profile</option>\n        ";
  }

function program7(depth0,data) {
  
  
  return "\n          <option value='fine'>fine</option>\n          <option value='adaptive'>adaptive</option>\n          <option value='rough'>rough</option>\n          <option value='off'>off</option>\n          ";
  }

  buffer += "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>Edit</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-edit'>\n    <section class='gt-form-section'>\n      <label for='tags'>\n        <span>When a device tagged</span>\n        <input type='text' name='tags' placeholder='enter tags' class='gt-tag-input' value='";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.tagList || depth0.tagList),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagList", depth0.tags, options)))
    + "'>\n      </label>\n\n      <select name='condition[direction]' class='gt-event'>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n\n      <span>a</span>\n\n      <select name='geometry-type' class='gt-geometry-type'>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data};
  stack2 = ((stack1 = helpers.selectShape || depth0.selectShape),stack1 ? stack1.call(depth0, depth0.condition, options) : helperMissing.call(depth0, "selectShape", depth0.condition, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n\n      <span>, </span>\n\n      <select class='gt-action-selector'>\n        ";
  options = {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, depth0.action, options) : helperMissing.call(depth0, "select", depth0.action, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </select>\n      <span>:</span>\n\n      <label class='gt-action gt-action-notification' for='message'>\n        <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.notification)),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</textarea>\n      </label>\n\n      <label class='gt-action gt-action-callbackUrl gt-hide' for='url'>\n        <input type='text' name='action[callbackUrl]' placeholder='url (optional)'>\n      </label>\n\n      <label class='gt-action gt-action-trackingProfile gt-hide' for='url'>\n        <span>to</span>\n        <select class='gt-action-profile-selector' name='action[trackingProfile]'>\n          ";
  options = {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data};
  stack2 = ((stack1 = helpers.select || depth0.select),stack1 ? stack1.call(depth0, ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options) : helperMissing.call(depth0, "select", ((stack1 = depth0.action),stack1 == null || stack1 === false ? stack1 : stack1.trackingProfile), options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </select>\n      </label>\n\n      <label for='title'>\n        Nickname (optional):\n        <input type='text' name='properties[title]' placeholder='Title' class='gt-trigger-title-input' value='"
    + escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n      </label>\n    </section>\n\n    <section class='gt-form-section'>\n      <button class='gt-button gt-button-blue gt-submit'>Update</button>\n      <ul class='gt-edit-controls'>\n        <li>\n          <a class='gt-reset-delete' href='#'>&#x2716;</a>\n        </li>\n        <li>\n          <button class='gt-item-delete gt-button-delete'></button>\n        </li>\n      </ul>\n    </section>\n  </form>\n</div>";
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
  
  var buffer = "", stack1;
  buffer += "<span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.geo)),stack1 == null || stack1 === false ? stack1 : stack1.distance)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " meter radius</span>\n    ";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<span>"
    + escapeExpression(((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.geo)),stack1 == null || stack1 === false ? stack1 : stack1.geojson)),stack1 == null || stack1 === false ? stack1 : stack1.coordinates)),stack1 == null || stack1 === false ? stack1 : stack1[0])),stack1 == null || stack1 === false ? stack1 : stack1.length)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " sided polygon</span>";
  return buffer;
  }

function program9(depth0,data) {
  
  var stack1;
  return escapeExpression(((stack1 = ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program11(depth0,data) {
  
  
  return "this trigger";
  }

  buffer += "<span class='gt-item-edit gt-icon ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.actionIcon || depth0.actionIcon),stack1 ? stack1.call(depth0, ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options) : helperMissing.call(depth0, "actionIcon", ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.direction), options)))
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
    + "/edit'>\n    ";
  stack2 = helpers.unless.call(depth0, ((stack1 = ((stack1 = depth0.condition),stack1 == null || stack1 === false ? stack1 : stack1.geo)),stack1 == null || stack1 === false ? stack1 : stack1.geojson), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </a>\n</h5>\n<div class=\"gt-item-toolbar\">\n  <a class='gt-edit-icon' href='#";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "/edit'></a>\n  <a class='gt-delete-icon' href=\"#\"></a>\n</div>\n<div class='gt-tags'>\n  <strong>Tags:</strong> ";
  options = {hash:{},data:data};
  stack2 = ((stack1 = helpers.tagLinks || depth0.tagLinks),stack1 ? stack1.call(depth0, depth0.tags, options) : helperMissing.call(depth0, "tagLinks", depth0.tags, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n<div class='gt-id'>\n  <strong>Id:</strong> ";
  if (stack2 = helpers.triggerId) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.triggerId; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n</div>\n<div class=\"gt-list-delete\">\n  <h5>Delete ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.properties),stack1 == null || stack1 === false ? stack1 : stack1.title), {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "?</h5>\n  <button class=\"gt-confirm-delete gt-button-small gt-button-delete\">Delete</button>\n  <button class=\"gt-cancel-delete gt-button-small gt-button-delete\">Cancel</button>\n</div>";
  return buffer;
  });

this["GeotriggerEditor"]["Templates"]["list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='gt-list-header gt-hide'>\n  <div class='gt-panel-top-bar'>\n    <a href='#new' class='gt-button gt-button-blue gt-tool-create'>Create</a>\n    <h3 class='gt-panel-top-bar-left'>List</h3>\n    <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n  </div>\n  </div>\n  <div class='gt-search'>\n    <input type='search'></input><span class=\"gt-icon-clear\"></span>\n  </div>\n<ul class='gt-results'></ul>";
  });

this["GeotriggerEditor"]["Templates"]["main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id='gt-controls-region'></div>\n<div id='gt-content'>\n  <div id='gt-drawer-region'></div>\n  <div id='gt-map-region'></div>\n  <div id='gt-notes-region'></div>\n</div>\n";
  });

this["GeotriggerEditor"]["Templates"]["new"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class='gt-panel-top-bar'>\n  <a href='#list' class='gt-panel-top-bar-button gt-back-to-list'></a>\n  <h3>Create</h3>\n  <a href='#' class='gt-panel-top-bar-button gt-close-drawer'></a>\n</div>\n\n<div class='gt-panel-content'>\n  <form class='gt-form gt-form-new'>\n    <section class='gt-form-section'>\n      <label for='tags'>\n        <span>When a device tagged</span>\n        <input type='text' name='setTags' placeholder='tag 1, tag 2..' class='gt-tag-input'>\n      </label>\n\n      <select name='condition[direction]' class='gt-event'>\n        <option value='enter' selected>enters</option>\n        <option value='leave'>leaves</option>\n      </select>\n\n      <span>a</span>\n\n      <select name='geometry-type' class='gt-geometry-type'>\n        <option value='polygon' selected>polygon</option>\n        <option value='radius'>circle</option>\n      </select>\n\n      <span>, </span>\n\n      <!-- <input type='text' name='radius' class='gt-radius'> -->\n\n      <!-- <button class='gt-button gt-button-clear gt-add-action'>add an action</button> -->\n\n      <select class='gt-action-selector'>\n        <option value='notification' selected>send the device a message</option>\n        <option value='callbackUrl'>post to a server</option>\n        <option value='trackingProfile'>change tracking profile</option>\n      </select>\n      <span>:</span>\n\n      <label class='gt-action gt-action-notification' for='message'>\n        <textarea class='gt-action-message-box' name='action[notification][text]' placeholder='message'></textarea>\n      </label>\n\n      <label class='gt-action gt-action-callbackUrl gt-hide' for='url'>\n        <input type='text' name='action[callbackUrl]' placeholder='url (optional)'>\n      </label>\n\n      <label class='gt-action gt-action-trackingProfile gt-hide' for='url'>\n        <span>to</span>\n        <select class='gt-action-profile-selector' name='action[trackingProfile]'>\n          <option disabled='disabled' selected>choose a tracking profile</option>\n          <option value='fine'>fine</option>\n          <option value='adaptive'>adaptive</option>\n          <option value='rough'>rough</option>\n          <option value='off'>off</option>\n        </select>\n      </label>\n\n      <!--\n      <label for='date'>\n        This will start\n        <select class='gt-date-start'>\n          <option value='now'>now</option>\n          <option value='future'>in the future</option>\n        </select>\n        and persist\n        <select class='gt-date-end'>\n          <option value='never'>indefinitely</option>\n          <option value='future'>until a future date</option>\n        </select>\n      </label>\n      -->\n\n      <label for='title'>\n        Nickname (optional):\n        <input type='text' name='properties[title]' placeholder='Title' class='gt-trigger-title-input'>\n      </label>\n    </section>\n\n    <section class='gt-form-section'>\n      <button class='gt-button gt-button-blue gt-submit'>Submit</button>\n      <!-- <ul class='gt-edit-controls'>\n        <li>\n          <input type='reset' class='gt-item-clear gt-button-clear' value='Reset'>\n        </li>\n      </ul> -->\n    </section>\n  </form>\n</div>";
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