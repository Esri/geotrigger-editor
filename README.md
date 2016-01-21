# Geotrigger Editor

The Geotrigger Editor is a client-side web application for creating and editing Geotrigger rules.

This is the open source version of the Geotrigger Editor available for Esri customers on the ArcGIS for Developers site. Read more about the editor [here](https://developers.arcgis.com/geotrigger-service/guide/geotrigger-editor/), and find out more about the Esri Geotrigger Service [here](https://developers.arcgis.com/en/features/geotrigger-service/).

## Features

* **Draw** trigger boundaries on a map
* **List** all of an application's triggers
* **Create**, **Edit** and **Delete** trigger conditions, actions, and boundaries
* **Search** for triggers by tag or ID

## Instructions

### Installation

Tagged releases include a `dist` folder which contains all the files you need to include the Geotrigger Editor in your project.

* The built JavaScript and CSS files are available in both expanded and minified versions in `dist/js` and `dist/css` respectively.
* All images used by the Editor are in `dist/img`.
* The files in `examples/default` show the easiest way to get the editor running in a browser.
* If you need to support IE 8/9, you're going to need a server-side [proxy](#proxy) to communicate with ArcGIS Online and the Geotrigger server. The files in `examples/proxy` show a quick way to do this using node.js.

**Dependencies**:

The Geotrigger Editor has some external dependencies:

* jQuery [1.10.2](https://github.com/jquery/jquery/releases/tag/1.10.2) (CDN: [Google](//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js), [jQuery](http://codeorigin.jquery.com/jquery-1.10.2.min.js))
* Underscore [1.5.2](https://github.com/jashkenas/underscore/releases/tag/1.5.2) (CDN: [cdnjs](http://cdnjs.com/libraries/underscore.js/))
* Backbone [1.1.0](https://github.com/jashkenas/backbone/releases/tag/1.1.0) (CDN: [cdnjs](http://cdnjs.com/libraries/backbone.js/))
* Backbone.Marionette [1.4.1-bundled](https://github.com/marionettejs/backbone.marionette/releases/tag/v1.4.1) (CDN: [cdnjs](http://cdnjs.com/libraries/backbone.marionette/))
* Handlebars [1.3.0](https://github.com/wycats/handlebars.js/releases/tag/v1.3.0) (runtime only) (CDN: [cdnjs](http://cdnjs.com/libraries/handlebars.js/))
* Leaflet [0.7.7](https://github.com/Leaflet/Leaflet/releases/tag/v0.7.7) (CDN: [leaflet](http://leafletjs.com/download.html), [cdnjs](http://cdnjs.com/libraries/leaflet/))
* Leaflet.draw [0.2.3](https://github.com/Leaflet/Leaflet.draw/releases/tag/0.2.3)
* Geotrigger.js [1.0.0](https://github.com/Esri/geotrigger-js)
* Esri-Leaflet [1.0.1](https://github.com/Esri/esri-leaflet/releases/tag/v1.0.1) (CDN: [jsdelivr](http://www.jsdelivr.com/projects/leaflet.esri))
* Esri-Leaflet Geocoder [1.0.2](https://github.com/Esri/esri-leaflet-geocoder/releases/tag/v1.0.2) (CDN: [jsdelivr](http://www.jsdelivr.com/projects/leaflet.esri.geocoder))

We recommend loading dependencies from a CDN when possible. All dependencies are hosted on CDNs with the exception of Geotrigger.js, which you'll need to host yourself.

If you plan to support legacy browsers (IE 8), you'll also need [html5shiv](https://github.com/aFarkas/html5shiv) and [json2](https://github.com/douglascrockford/JSON-js), which can be included with a conditional comment like so:

```html
<!--[if lte IE 8]>
  <script src="//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/r29/html5.min.js"></script>
<![endif]-->
```

You can take a look at `examples/default` to see how to easily include all the necessary files.

**Browser Support**:

The Geotrigger Editor is tested against the latest versions of Chrome, Firefox, Safari, and Internet Explorer versions 8, 9, and 10. IE 8 & 9 only work with a [proxy](#proxy).

---

### Starting the Editor

The Editor is a [Backbone.Marionette](https://github.com/marionettejs/backbone.marionette) application namespaced as `Geotrigger.Editor`. The only method you need to start the application is [`.start`](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md#starting-an-application).

### `Geotrigger.Editor.start(options)`

```js
Geotrigger.Editor.start({
  session: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX', // required
    proxy: '/path/to/proxy' // required if you need to support IE 8/9
  }
});
```

The Editor requires an empty `#gt-editor` element in the DOM to attach to, e.g. `<div id="gt-editor"></div>`. See `examples/default` for an example.

**Configuration Options**

The `options` parameter is an object that can contain the following configuration options:

#### `session`

The `session` object is required to authenticate with ArcGIS and interact with the Geotrigger Service. It has two required properties:

* `clientId`: your ArcGIS application's client ID
* `clientSecret`: your ArcGIS application's client secret

The client ID and secret are required in order for the Geotrigger Service to grant editing rights to the user for the associated application.

It can take all of the same properties as those outlined in the geotrigger.js [config options](https://github.com/Esri/geotrigger-js#config-options).

#### more

There are a lot more configuration options, look at `src/js/modules/config.js` to see them all.

---

### Proxy

The Geotrigger Editor is a client-side only application that relies on [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS) to communicate with the Geotrigger Service.

**If you need to serve browsers that don't support CORS, you're going to need a proxy.** This means Internet Explorer 8 and 9 in particular -- see [caniuse.com/cors](http://caniuse.com/cors). Thankfully Internet Explorer 10 supports CORS along with all the latest versions of modern browsers (Chrome, Firefox, Safari).

#### Client

On the client side, just be sure to start the editor with a path to the proxy, like so:

```js
Geotrigger.Editor.start({
  session: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX', // required
    proxy: '/proxy/'
  }
});
```

The `proxy` option should be an absolute path to the proxy server endpoint (starts with `/`). For the proxy to work it must be on the same domain.

#### Server

On the server side, you'll need a working proxy to forward API requests to `geotrigger.arcgis.com/*` and `arcgis.com/sharing/oauth2/*` and return the response back to the browser. `/examples/proxy/` shows how to do this using Node.js.

---

### Developing & Building

To run the development environment, you will need the following:

1. [Node.js](http://nodejs.org/)
1. [Grunt](http://gruntjs.com/)
1. [Ruby](https://www.ruby-lang.org/en/downloads/) and [Compass](http://compass-style.org/install/) (to compile SASS)

Once [Node.js](https://nodejs.org/en/download/) is installed, you can install the Grunt command line interface by running `npm install -g grunt-cli`. This will install the grunt-cli package locally ([reference](https://npmjs.org/doc/install.html)).

#### Local Setup

1. Clone the repository and `cd` into the `geotrigger-editor` directory.
2. Run `npm install` to lay down the  project's dependencies.
3. Run `grunt` to compile the source code and spin up a local server which watches the source code for changes.

#### Working locally

You'll need an HTTP server to serve files from the root of the repository. The `grunt dev` task takes care of building all source files to the `dist` folder (`dist/js/geotrigger-editor.js` and `dist/css/geotrigger-editor.css`), watching local files for changes, and running a local server for you at http://localhost:8080 (see the `Grunt Tasks` section for more information).

#### Testing locally (todo)

Testing requires PhantomJS to be running. You can install it with homebrew (`brew install phantomjs`), and get it started by running `phantomjs --webdriver=4444`. The local server should already be running too. The `grunt test` task takes care of the latter part (see `Grunt Tasks` below).

#### Grunt Tasks

##### 1. `grunt dev`

This task will rebuild temporary files for development, run a server at `localhost:8080`, then continuously watch for changes in the `src` directory until you end the process. The `index.html` file in the root of the repository is already set up to use these files.

##### 2. `grunt test` **not yet implemented**

This task will start a test server at `localhost:8081`, then run the jshint, complexity, and cucumber tasks to see if the code does not smell.

##### 3. `grunt build`

This task will build the production version of the editor into the `dist` folder.

##### 4. `grunt build_img`

This task will build the production version of the editor's image assets into the `dist` folder. This task has been broken out of the main `build` task because [smushit](https://github.com/heldr/grunt-smushit) takes a long time.

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/Esri/geotrigger-editor/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing

Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://raw.github.com/Esri/geotrigger-editor/master/LICENSE) file.

[](Esri Tags: Geotrigger Editor Geolocation Web Mobile Browser HTML5)
[](Esri Language: JavaScript)
