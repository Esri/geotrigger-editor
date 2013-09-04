/*! geotriggers-js - v0.0.3 - 2013-09-03
*   Copyright (c) 2013 Environmental Systems Research Institute, Inc.
*   Apache License*/

(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(factory);
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Geotriggers = factory();
  }

}(this, function() {
  /*
  Configuration Variables
  -----------------------------------
  */
  var version           = "0.0.3";
  var geotriggersUrl    = "https://geotrigger.arcgis.com/";
  var tokenUrl          = "https://arcgis.com/sharing/oauth2/token";
  var registerDeviceUrl = "https://arcgis.com/sharing/oauth2/registerDevice";
  var exports           = {};
  var IS_IE             = typeof XDomainRequest !== "undefined";

  /*
  Custom Deferred Callbacks.
  -----------------------------------
  */

  var Deferred = function Deferred() {
    this._thens = [];
  };

  Deferred.prototype = {
    then: function (onResolve, onReject) {
      // capture calls to then()
      this._thens.push({ resolve: onResolve, reject: onReject });
      return this;
    },
    success: function(onResolve){
      this.then(onResolve);
      return this;
    },
    error: function(onReject){
      this.then(null, onReject);
      return this;
    },
    resolve: function (val) {
      this._complete('resolve', val);
    },
    reject: function (ex) {
      this._complete('reject', ex);
    },
    _complete: function (which, arg) {
      // switch over to sync then()
      this.then = (which === 'resolve') ?
        function (resolve, reject) { resolve(arg); } :
        function (resolve, reject) { reject(arg); };
      this.success = function(resolve){
        resolve(arg);
      };
      this.error = function(reject){
        reject(arg);
      };
      // disallow multiple calls to resolve or reject
      this.resolve = this.reject = function() {
        throw new Error('Deferred already completed.');
      };

      // complete all waiting (async) then()s
      for (var i = 0; i < this._thens.length; i++) {
        var aThen = this._thens[i];
        if(aThen[which]) {
          aThen[which](arg);
        }
      }
      delete this._thens;
    }
  };

  exports.Deferred = Deferred;

  /*
  Main Session Object
  -----------------------------------
  */

  function Session(options){
    this._requestQueue = [];
    this._events = {};
    this._failedRefreshes = 0;
    this.refreshTries = 3;

    var defaults = {
      preferLocalStorage: true,
      persistSession: (typeof module !== 'undefined' && module.exports) ? false : true,
      geotriggersUrl: geotriggersUrl,
      tokenUrl: tokenUrl,
      registerDeviceUrl: registerDeviceUrl,
      debug: false,
      automaticRegistation: true
    };

    // set application id
    if(!options.clientId) {
      throw new Error("Geotriggers.Session requires an `clientId` or a `session` parameter.");
    }

    // merge defaults and options into `this`
    util.merge(this, util.merge(defaults, options));

    this.authenticatedAs = (this.clientId && this.clientSecret) ? "application" : "device";
    this.key = "_geotriggers_" + this.authenticatedAs + "_" + this.clientId;

    //restore a stored session if we have one
    if(this.persistSession) {
      if(this.preferLocalStorage && hasLocalStorage){
        util.merge(this, localStorage.get(this.key));
      } else if (hasCookies) {
        util.merge(this, cookie.get(this.key));
      }
    }

    // if there is an access token and it is after when the token expires or there is no access token
    if((this.token && (Date.now() > new Date(this.expiresOn).getTime())) || !this.token){
      this.refresh();
    }
  }

  Session.prototype.authenticated = function(){
    return !!this.token;
  };

  Session.prototype._runQueue = function(){
    for (var i = 0; i < this._requestQueue.length; i++) {
      var request = this._requestQueue[i];
      this.request(request.method, request.options, request.deferred);
    }
  };

  Session.prototype.refresh = function(){
    this.log("refrehsing session");
    if(this._failedRefreshes >= this.refreshTries){
      this.emit("authentication:cannotrefresh");
      this.log("failed to refresh token " + this._failedRefreshes + " times not continuing to refresh");
      return;
    }
    // if we have an application secret just request a new token
    if(this.clientSecret){
      this.log("getting new application token");
      this.request(this.tokenUrl, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          f: "json",
          grant_type: "client_credentials"
        }
      }).then(util.bind(this, function(response){
        this.token = response.access_token;
        this.expiresOn = new Date(new Date().getTime() + ((response.expires_in-(60*5)) *1000));
        this._processAuth();
      }), util.bind(this, this._authError));

    // if we have a refresh token lets use it to get a new token
    } else if (this.refreshToken){
      this.log("getting new device token with a refresh token");
      this.request(this.tokenUrl, {
        params: {
          client_id: this.clientId,
          refresh_token: this.refreshToken,
          f: "json",
          grant_type: "refresh_token"
        }
      }).then(util.bind(this, function(response){
        this.token = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresOn = new Date(new Date().getTime() + ((response.expires_in-(60*5)) *1000));
        this._processAuth();
      }), util.bind(this, this._authError));

    // else register a new device
    } else if (this.automaticRegistation) {
      this.log("no applicaitonSecret or refreshToken, registering a new device");
      this.request(this.registerDeviceUrl, {
        params: {
          client_id: this.clientId,
          f: "json"
        }
      }).then(util.bind(this, function(response){
        this.deviceId = response.device.deviceId;
        this.token = response.deviceToken.access_token;
        this.refreshToken = response.deviceToken.refresh_token;
        this.expiresOn = new Date(new Date().getTime() + ((response.deviceToken.expires_in-(60*5)) *1000));
        this._processAuth(response);
      }), util.bind(this, this._authError));
    }
  };

  Session.prototype.toJSON = function(){
    var obj = {};
      for (var key in this) {
        if (this.hasOwnProperty(key) && this[key] && !key.match(/^_.+/)) {
          obj[key] = this[key];
        }
      }
      return obj;
  };

  Session.prototype.on = function(type, listener){
    if (typeof this._events[type] === "undefined"){
      this._events[type] = [];
    }

    this._events[type].push(listener);
  };

  Session.prototype.emit = function(type){
    var args = [].splice.call(arguments,1);
    if (this._events[type] instanceof Array){
      var listeners = this._events[type];
      for (var i=0, len=listeners.length; i < len; i++){
        listeners[i].apply(this, args);
      }
    }
  };

  Session.prototype.off = function(type, listener){
    if (this._events[type] instanceof Array){
      var listeners = this._events[type];
      for (var i=0, len=listeners.length; i < len; i++){
        if (listeners[i] === listener){
          listeners.splice(i, 1);
          break;
        }
      }
    }
  };

  Session.prototype._processAuth = function(response){
    this._failedRefreshes = 0;
    if(this.persistSession){
      this.persist();
    }
    this.log("session refreshed running queue");
    this._runQueue();
    this.emit("authentication:success", response);
    this.emit("authenticated", response);
  };

  Session.prototype._authError = function(error){
    this._failedRefreshes++;
    this.log("error getting token or registering device from ArcGIS, " + error.error_description);
    this.emit("authentication:failure", error);
    this.refresh();
  };

  Session.prototype.log = function(){
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(this.key);
    if(this.debug){
      util.log.apply(this, args);
    }
  };

  Session.prototype.request = function(method, options, dfd){
    var session = this;

    // set defaults for parameters, callback, XHR
    var defaults = {
      params: {},
      callback: null,
      addCallbacksToDeferred: true
    };

    // make a new deferred for callbacks
    var deferred = dfd || new exports.Deferred();

    // empty var for httpRequest which is set later
    var httpRequest;

    // merge settings and defaults
    var settings = util.merge(defaults, options);

    // assume this is a request to getriggers is it doesn't start with (http|https)://
    var geotriggersRequest = !method.match(/^https?:\/\//);

    // create the url for the request
    var url = (geotriggersRequest) ? this.geotriggersUrl + method : method;

    this.log("making request to " + url + " as a " + this.authenticatedAs);

    // callback for handling a successful request
    var handleSuccessfulResponse = function(){
      session.log("successful http request to " + url + " as a " + session.authenticatedAs);
      var json = JSON.parse(httpRequest.responseText);
      var response = (json.error) ? null : json;
      var error = (json.error) ? json.error : null;

      // did our token expire?
      // if it didn't resolve or reject the callback
      // if it did refresh the auth and run the request again
      if(error && error.type === "invalidHeader" && error.headers.Authorization){
        session.log("invalid authentication for http request to " + url +" trying to refresh token");

        // push our request options and deferred into the request queue
        session._requestQueue.push({
          method: method,
          options: settings,
          deferred: deferred
        });
        // refresh the auth
        session.refresh();
      } else {
        if (!error){
          session.log("running success callback for request to " + url + " with ", response);
          deferred.resolve(response, httpRequest);
          if(settings.callback) {
            settings.callback(null, response, httpRequest);
          }
        } else if (error){
          session.log("running error callback for request to " + url + " with ", response);
          deferred.reject(error, httpRequest);
          if(settings.callback) {
            settings.callback(error, null, httpRequest);
          }
        } else {
          var errorMessage = {
            type: "unexpected_response",
            message: "the api returned a non json or unexpected data"
          };
          session.log("running error callback for request to " + url + " with ", errorMessage);
          deferred.reject(errorMessage, httpRequest);
          if(settings.callback) {
            settings.callback(errorMessage, null, httpRequest);
          }
        }
      }
    };

    // callback for handling an http error
    var handleErrorResponse = function(){
      var errorMessage = JSON.parse(httpRequest.responseText);
      session.log("request to " + url + " as a " + session.authenticatedAs + " failed with ", errorMessage);
      var error = {
        type: "http_error",
        message: errorMessage
      };
      deferred.reject(error);
    };

    // callback for handling state change
    var handleStateChange = function(){
      if(httpRequest.readyState === 4 && httpRequest.status < 400){
        handleSuccessfulResponse();
      } else if(httpRequest.readyState === 4 && httpRequest.status >= 400) {
        handleErrorResponse();
      }
    };

    // use XDomainRequest (ie8) or XMLHttpRequest (standard)
    if (IS_IE) {
      httpRequest = new XDomainRequest();
      httpRequest.onload = handleSuccessfulResponse;
      httpRequest.onerror = handleErrorResponse;
      httpRequest.ontimeout = handleErrorResponse;
    } else if (typeof XMLHttpRequest !== "undefined") {
      httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = handleStateChange;
    } else {
      throw new Error("This browser does not support XMLHttpRequest or XDomainRequest");
    }

    // set the access token in the body
    if(geotriggersRequest){
      settings.params.token = this.token;
    }

    // Convert parameters to form encoded (AGO) or a JSON sting (Geotriggers)
    var body = (geotriggersRequest) ? JSON.stringify(settings.params) : util.serialize(settings.params);

    httpRequest.open("POST", url);

    if(!IS_IE){
      var contentType = (geotriggersRequest) ? 'application/json' : 'application/x-www-form-urlencoded';
      httpRequest.setRequestHeader('Content-Type', contentType);
    }

    httpRequest.send(body);

    this.log("sent request to "+ url + " as a " + this.authenticatedAs + " with", settings.params);

    return deferred;
  };

  Session.prototype.persist = function() {
    var value = {};
    if(this.clientSecret){ value.clientSecret = this.clientSecret; }
    if(this.token){ value.token = this.token; }
    if(this.refreshToken){ value.refreshToken = this.refreshToken; }
    if(this.deviceId){ value.deviceId = this.deviceId; }
    if(this.preferLocalStorage && hasLocalStorage){
      this.log("persisting session to localStorage ", value);
      localStorage.set(this.key, value);
    } else if (hasCookies) {
      this.log("persisting session to cookie ", value);
      cookie.set(this.key, value);
    }
  };

  Session.prototype.destroy = function() {
    this.log("destorying persisted session");
    if(this.preferLocalStorage && hasLocalStorage) {
      localStorage.erase(this.key);
    } else if (hasCookies) {
      cookie.erase(this.key);
    }
  };

  exports.Session = Session;

  /*
  General Purpose Utilities
  -----------------------------------
  */

  var util = {
    bind: function(context, func) {
      var bound, args;

      if (typeof func !== "function") {
        throw new TypeError();
      }

      if (typeof Function.prototype.bind === 'function') {
        return func.bind(context);
      }

      args = Array.prototype.slice.call(arguments, 2);

      return bound = function() {
        if (!(this instanceof bound)) {
          return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        }

        var Ctor;
        Ctor.prototype = func.prototype;

        var self = new Ctor();
        var result = func.apply(self, args.concat(Array.prototype.slice.call(arguments)));

        if (Object(result) === result) {
          return result;
        }

        return self;
      };
    },

    // Merge Object 1 and Object 2.
    // Properties from Object 2 will override properties in Object 1.
    // Returns Object 1
    merge: function(target, obj){
      for (var attr in obj) {
        if(obj.hasOwnProperty(attr)){
          target[attr] = obj[attr];
        }
      }
      return target;
    },

    // Makes it safe to log from anywhere
    log: function(){
      var args = Array.prototype.slice.apply(arguments);
      if (Function.prototype.bind && typeof console !== undefined && console.log) {
        var log = Function.prototype.bind.call(console.log, console);
        log.apply(console, args);
      }
    },

    isObject: function(thing){
      return Object.prototype.toString.call(thing) === '[object Object]';
    },

    isArray: function(thing){
      return Object.prototype.toString.call(thing) === '[object Array]';
    },

    serialize: function(obj, prefix) {

        var enc = encodeURIComponent;

        // make an array to hold each peice
        var str = [];

        // for every key in our object
        for(var p in obj) {
          var e;
          var k = (prefix) ? prefix + "[" + p + "]" : p, v = obj[p];
          if(k === "properties" || k === "condition[geo][geojson]" || k === "locations" || k === "data"){
            e = enc(k) + "=" + enc(JSON.stringify(v));
          } else {
            e = (util.isObject(v)) ? util.serialize(v, k) : enc(k) + "=" + enc(v);
          }
          str.push(e);
        }

        // join with ampersands
        return str.join("&");
    }
  };

  /*
  Utilities for manipulating sessions
  -----------------------------------
  */

  var hasLocalStorage = (typeof window === "object" && typeof window.localStorage === "object") ? true : false;
  var hasCookies = (typeof document === "object" && typeof document.cookie === "string") ? true : false;

  var localStorage = {
    set:function(key, value){
      window.localStorage.setItem(key, JSON.stringify(value));
    },
    get: function(key){
      return JSON.parse(window.localStorage.getItem(key));
    },
    erase: function(key){
      window.localStorage.removeItem(key);
    }
  };

  var cookie = {
    get: function(key) {
      // Still not sure that "[a-zA-Z0-9.()=|%/_]+($|;)" match *all* allowed characters in cookies
      var tmp =  document.cookie.match((new RegExp(key +'=[a-zA-Z0-9.()=|%/_]+($|;)','g')));
      if(!tmp || !tmp[0]){
        return null;
      } else {
        return JSON.parse(tmp[0].substring(key.length+1,tmp[0].length).replace(';','')) || null;
      }
    },

    set: function(key, value, secure) {
      var cookie = [
        key+'='+JSON.stringify(value),
        'path=/',
        'domain='+window.location.host
      ];

      var expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 1);
      cookie.push(expiration_date.toGMTString());

      if (secure){
        cookie.push('secure');
      }
      return document.cookie = cookie.join('; ');
    },

    erase: function(key) {
      document.cookie = key + "; " + new Date(0).toUTCString();
    }
  };

  return exports;
}));