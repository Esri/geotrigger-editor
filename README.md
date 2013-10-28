# ArcGIS Geotrigger Editor

White-label client-side editor for creating and editing Geotriggers.

## Features

* Create, edit and delete Geotriggers from your browser.
* Search for Geotriggers by tag, nickname, ID or property.
* Draw shapes directly on the map to create a new Geotrigger.
* Use a natural language form to seamlessly create a new Geotrigger.

## Instructions

### Installation

#### Starting the Editor

```js
GeotriggerEditor.start({
  el: '#gt-editor', // optional: defaults to '#gt-editor'
  credentials: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX' // required
  },
  proxy: '/proxy/' // optional, defaults to false
});
```

Lots more configuration options, look at `src/js/modules/config.js` to see them all.

##### Todo

More docs

#### Proxy

The Geotrigger Editor is a client-side only application, **but** if you need to serve browsers that don't support CORS, you'll need to use a proxy. On the client side, just be sure to start the editor with a path to the proxy, like so:

```js
GeotriggerEditor.start({
  el: '#gt-editor', // optional: defaults to '#gt-editor'
  credentials: { // required
    clientId: 'XXXXXX', // required
    clientSecret: 'XXXXXX' // required
  },
  proxy: '/proxy/'
});
```

On the server side, you'll need a working proxy to forward API requests to `geotrigger.arcgis.com/*` and `arcgis.com/sharing/oauth2/*`. The `proxy.js` included in this repo shows how to do this using Node.js.

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an [issue](https://github.com/geoloqi/geotrigger-editor/issues).

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

### Development Requirements

To run the development environment, you will need the following:

1. [Node](http://nodejs.org/)
1. [Grunt](http://gruntjs.com/)

#### Mac OS X

If you haven't already done so, install your global dependencies. These instructions assume you have [homebrew](http://brew.sh/) installed.

1. `brew install node`
1. `npm install -g grunt-cli`

Next, `cd` into the `geotrigger-editor` working directory and run `npm install` to make sure all node modules are present.

### Working locally

You need an HTTP server at `localhost:8080` serving files from the root of the repository. `/` uses files from `dev`, and `/dist/` uses production-ready files created by the `grunt build` task. The `grunt dev` task takes care of running a local server for you (see `Grunt Tasks` below).

### Testing locally

Testing requires PhantomJS to be running. You can install it with homebrew (`brew install phantomjs`), and get it started by running `phantomjs --webdriver=4444`. The local server should already be running too. The `grunt test` task takes care of the latter part (see `Grunt Tasks` below).

### Grunt Tasks

1. `grunt dev`

  This task will clean out the dev folder and build out all the necessary files for development, run a server at `localhost:8080`, then continuously watch for changes in the `src` directory until you end the process.

2. `grunt test`

  This task will start a test server at `localhost:8081`, then run the jshint, complexity, and cucumber tasks to see if the code does not smell.

3. `grunt build`

  This task will build the production version of the editor into the `dist` folder.

The `default` grunt task is `dev`.

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
