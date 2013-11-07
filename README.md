# ArcGIS Geotrigger Editor

White-label client-side editor for creating and editing Geotrigger rules.

## Features

* Create, edit and delete Geotrigger rules from your browser using a dynamic form.
* Search for Geotrigger rules by tag, nickname, ID or property.
* Draw shapes directly on the map to create a new Geotrigger rule.

## Instructions

### Installation

**TL;DR**:

* The `dist` folder contains all the files you need to include the Geotrigger Editor in your project.
* The built JavaScript and CSS files are available in both expanded and minified versions in `dist/js` and `dist/css` respectively.
* All icon images used by the Editor are in `dist/img`.
* The `dist/index.html` file shows the easiest way to get the editor running in a browser.
* If you need to support IE 8/9, you're going to need a server-side [proxy](#proxy).

**Dependencies**:

The Geotrigger Editor has some external dependencies, namely:

* jQuery
* Underscore
* Backbone
* Backbone.Marionette
* Geotriggers.js
* Leaflet
* Esri-Leaflet
* Handlebars

If you plan to support legacy browsers (IE 8), you'll also need [html5shiv](https://github.com/aFarkas/html5shiv) and [json2](https://github.com/douglascrockford/JSON-js).

These dependencies can be included individually, but for convenience they have been bundled together as `dist/geotrigger-editor.dependencies.js` (minified: `dist/geotrigger-editor.dependencies.min.js`), with two exceptions:

* jQuery which we recommend loading from a CDN (either [Google Hosted Libraries](https://developers.google.com/speed/libraries/devguide#jquery) or [jQuery CDN](http://codeorigin.jquery.com/))
* html5shiv and json2, which should be included separately in a conditional comment, like so:

```html
<!--[if lte IE 8]>
  <script src="../vendor/json2.js"></script>
  <script src="../vendor/html5shiv.js"></script>
<![endif]-->
```

You can take a look at the source of `dist/index.html` for an example of how to easily include all the necessary files.

---

### Starting the Editor

The Editor is a [Backbone.Marionette](https://github.com/marionettejs/backbone.marionette) application namespaced as `GeotriggerEditor`. The only method you need to start the application is [`.start`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md#starting-an-application).

### `GeotriggerEditor.start(options)`

```js
GeotriggerEditor.start({
  el: '#gt-editor', // optional: defaults to '#gt-editor'
  session: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX' // required
  }
});
```

**Configuration Options**

The `options` parameter is an object that can contain the following configuration options:

#### `el`

The `el` option represents the HTML element the Geotrigger Editor will be attached to. Upon initialization, it should be an empty `<div>`. The default setting is `#gt-editor` (`el` can be omitted if this element exists).

#### `session`

The `session` object is required to authenticate with ArcGIS and interact with the Geotrigger Service. It has two required properties:

* `clientId` your ArcGIS application's client ID
* `clientSecret`: your ArcGIS application's client secret

The client ID and secret are required in order for the Geotrigger Service to grant editing rights to the user for the associated application.

It can take all of the same properties as those outlined in the geotriggers.js [config options](https://github.com/Esri/geotriggers-js#config-options).

#### more

There are a lot more configuration options, look at `src/js/modules/config.js` to see them all.

---

### Proxy

The Geotrigger Editor is a client-side only application that relies on [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS) to communicate with the Geotrigger Service.

**If you need to serve browsers that don't support CORS, you're going to need a proxy.** This means Internet Explorer 8 and 9 in particular -- see [caniuse.com/cors](http://caniuse.com/cors). Thankfully Internet Explorer 10 supports CORS along with all the latest versions of modern browsers (Chrome, Firefox, Safari).

#### Client

On the client side, just be sure to start the editor with a path to the proxy, like so:

```js
GeotriggerEditor.start({
  el: '#gt-editor', // optional: defaults to '#gt-editor'
  session: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX' // required
  },
  proxy: '/proxy/'
});
```

The `proxy` option should be an absolute path to the proxy server endpoint (starts with `/`). For the proxy to work it must be on the same domain.

#### Server

On the server side, you'll need a working proxy to forward API requests to `geotrigger.arcgis.com/*` and `arcgis.com/sharing/oauth2/*` and return the response back to the browser. `/examples/proxy/` shows how to do this using Node.js.

---

### Browser Support

The Geotrigger Editor is tested against the latest versions of Chrome, Firefox, Safari, and Internet Explorer versions 8, 9, and 10.

---

### Developing & Building

To run the development environment, you will need the following:

1. [Node.js](http://nodejs.org/)
1. [Grunt](http://gruntjs.com/)

To install `node` on your system follow [these instructions](https://github.com/joyent/node/wiki/Installation#installing-without-building).

*Note: if you're a mac developer I recommend simply using homebrew to `brew install node`.*

Once Node.js is installed, you can install the Grunt command line interface by running `npm install -g grunt-cli`. This will install the grunt-cli package locally ([reference](https://npmjs.org/doc/install.html)).

#### Local Setup

Clone the repository, `cd` into it, then run `npm install`.

#### Working locally

You'll need an HTTP server to serve files from the root of the repository. The `grunt dev` task takes care of building all source files to a temporary `dev` folder, watching local files for changes, and running a local server for you at http://localhost:8080 (see the `Grunt Tasks` section for more information).

#### Testing locally

Testing requires PhantomJS to be running. You can install it with homebrew (`brew install phantomjs`), and get it started by running `phantomjs --webdriver=4444`. The local server should already be running too. The `grunt test` task takes care of the latter part (see `Grunt Tasks` below).

#### Grunt Tasks

##### 1. `grunt dev`

This task will clean out the dev folder and build out all the necessary files for development, run a server at `localhost:8080`, then continuously watch for changes in the `src` directory until you end the process.

##### 2. `grunt test`

This task will start a test server at `localhost:8081`, then run the jshint, complexity, and cucumber tasks to see if the code does not smell.

##### 3. `grunt build`

This task will build the production version of the editor into the `dist` folder.

##### 4. `grunt build_img`

This task will build the production version of the editor's image assets into the `dist` folder. This task has been broken out of the main `build` task because [smushit](https://github.com/heldr/grunt-smushit) takes a long time.

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/geoloqi/geotrigger-editor/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://raw.github.com/geoloqi/geotrigger-editor/master/LICENSE) file.

[](Esri Tags: ArcGIS Geotrigger Editor Geolocation Web Mobile)
[](Esri Language: JavaScript)
