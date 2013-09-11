(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    exports = module.exports = factory();
  }

  // Browser Global.
  if(typeof window === "object") {
    root.Geotriggers = factory();
  }

}(this, function() {

  var version           = "0.0.3";
  var geotriggersUrl    = "https://geotrigger.arcgis.com/";
  var tokenUrl          = "https://arcgis.com/sharing/oauth2/token";
  var registerDeviceUrl = "https://arcgis.com/sharing/oauth2/registerDevice";
  var exports           = {};
  var IS_IE             = typeof XDomainRequest !== "undefined";

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          FNOP = function() {},
          fBound = function() {
            return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      FNOP.prototype = this.prototype;
      fBound.prototype = new FNOP();

      return fBound;
    };
  }

  function Session(options){
    this._requestQueue = [];
    this._events = {};

    var defaults = {
      preferLocalStorage: true,
      persistSession: (typeof module !== 'undefined' && module.exports) ? false : true,
      geotriggersUrl: geotriggersUrl,
      tokenUrl: tokenUrl,
      registerDeviceUrl: registerDeviceUrl,
      automaticRegistation: true
    };

    // set application id
    if(!options || !options.clientId) {
      throw new Error("Geotriggers.Session requires an `clientId` or a `session` parameter.");
    }

    // merge defaults and options into `this`
    util.merge(this, util.merge(defaults, options));

    this.authenticatedAs = (this.clientId && this.clientSecret) ? "application" : "device";

    this.key = "geotriggers_" + this.authenticatedAs + "_" + this.clientId;

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

  Session.prototype.refresh = function(){
    if(this.refreshing){
      return;
    }
    this.refreshing = true;
    var url = this.tokenUrl;
    var params = {
      client_id: this.clientId,
      f: "json"
    };

    if(this.clientSecret){
      params.client_secret = this.clientSecret;
      params.grant_type =  "client_credentials";
    } else if (this.refreshToken){
      params.refresh_token = this.refreshToken;
      params.grant_type = "refresh_token";
    } else if (this.automaticRegistation) {
      url = this.registerDeviceUrl;
    }

    this.request(url, params, function(error, response, xhr){
      this.refreshing = false;

      if(error){
        this.emit("authentication:error", error);
        return;
      }

      this.expiresOn = new Date(new Date().getTime() + ((response.expires_in-(60*5)) *1000));

      if(response.deviceToken){
        this.refreshToken = response.deviceToken.refresh_token;
        this.token = response.deviceToken.access_token;
        this.deviceId = response.device.device;
      } else {
        this.refreshToken = response.refresh_token;
        this.token = response.access_token;
      }

      if(this.persistSession){
        this.persist();
      }

      while(this._requestQueue.length){
        this.request.apply(this, this._requestQueue.shift());
      }

      this.emit("authentication:success");
    }.bind(this));
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

  Session.prototype.request = function(method, params, callback){
    var args = Array.prototype.slice.apply(arguments);
    var json;
    var error;
    var response;
    var httpRequest;

    // assume this is a request to getriggers is it doesn't start with (http|https)://
    var geotriggersRequest = !method.match(/^https?:\/\//);

    // create the url for the request
    var url = (geotriggersRequest) ? this.geotriggersUrl + method : method;


    if(typeof params === "function"){
      callback = params;
      params = {};
    }

    if(geotriggersRequest && !this.token){
      this._requestQueue.push(args);
      this.refresh();
      return;
    }

    // callback for handling a successful request
    var handleSuccessfulResponse = function(){

      try {
        json = JSON.parse(httpRequest.responseText);
        response = (json.error) ? null : json;
        error = (json.error) ? json.error : null;
      } catch (e){
        response = null;
        error = {
          type: "parse_error",
          message: "cound not parse response as JSON"
        };
      }

      // did our token expire?
      // if it didn't resolve or reject the callback
      // if it did refresh the auth and run the request again
      if(error && error.type === "invalidHeader" && error.headers.Authorization){
        this._requestQueue.push(args);
        this.refresh();
      } else {
        if (!error){
          callback(null, response, httpRequest);
        } else if (error){
          callback(error, null, httpRequest);
        } else {
          var errorMessage = {
            type: "unexpected_response",
            message: "the api returned a non JSON or unexpected data"
          };
          callback(errorMessage, null, httpRequest);
        }
      }
    }.bind(this);

    // callback for handling an http error
    var handleErrorResponse = function(){
      var errorMessage = JSON.parse(httpRequest.responseText);
      var error = {
        type: "http_error",
        message: errorMessage
      };
    }.bind(this);

    // callback for handling state change
    var handleStateChange = function(){
      if(httpRequest.readyState === 4 && httpRequest.status < 400){
        handleSuccessfulResponse();
      } else if(httpRequest.readyState === 4 && httpRequest.status >= 400) {
        handleErrorResponse();
      }
    }.bind(this);

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

    var body;

    // set the access token in the body
    if(geotriggersRequest){
      params.token = this.token;
      body = JSON.stringify(params);
    } else {
      body = util.serialize(params);
    }

    httpRequest.open("POST", url);

    if(!IS_IE){
      httpRequest.setRequestHeader('Content-Type', (geotriggersRequest) ? 'application/json' : 'application/x-www-form-urlencoded');
    }
    httpRequest.send(body);

  };

  Session.prototype.persist = function() {
    var value = {};
    if(this.clientSecret){ value.clientSecret = this.clientSecret; }
    if(this.token){ value.token = this.token; }
    if(this.refreshToken){ value.refreshToken = this.refreshToken; }
    if(this.deviceId){ value.deviceId = this.deviceId; }
    if(this.preferLocalStorage && hasLocalStorage){
      localStorage.set(this.key, value);
    } else if (hasCookies) {
      cookie.set(this.key, value);
    }
  };

  Session.prototype.destroy = function() {
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

    isObject: function(thing){
      return Object.prototype.toString.call(thing) === '[object Object]';
    },

    serialize: function(obj, prefix) {

      var enc = encodeURIComponent;

      // make an array to hold each peice
      var str = [];

      // for every key in our object
      for(var p in obj) {
        if(obj.hasOwnProperty(p)){
          var e;
          var k = (prefix) ? prefix + "[" + p + "]" : p, v = obj[p];
          e = (util.isObject(v)) ? util.serialize(v, k) : enc(k) + "=" + enc(v);
          str.push(e);
        }
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