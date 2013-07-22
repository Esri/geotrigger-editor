# ArcGIS Geotrigger Editor

White-label client-side editor for creating and editing Geotriggers. May the best fork win!

## Mission Objectives

Natural Language Trigger Editor with full impementation of:

* tag selection
* place selection (geocoding, radius, drivetime)
* interaction (enters, exits, dwells)
* action (send message, post to server, log event, change tracking profile)
* duration (active between DATE and DATE)

Draw Tool with support for:

* circle (point with radius)
* polygon
* point (for drivetime w/ default time value & slider thing)

List view with support for:

* Listing all triggers
* Searching triggers by tag name
* Searching triggers by location (lat/lng or reverse geocode) and radius
* Filtering by trigger properties (action, interaction, etc)

### Bonus Objectives

Config options to change:

* basemap
* renderers

## Teams

* Team Mod Squad
* Team Quoin

## Winning Criteria

* Time to complete
* Grunt complexity (LOC etc)
* Test coverage
* Time to first pixel / overall speed of interface / happiness factor
* Payload size

---

## Getting Started

### Development Requirements

To run the development environment, you will need the following:

1. Node
1. NPM
1. PhantomJS
1. Grunt

#### Mac OS X

If you haven't already done so, install your dependencies.

1. brew install node
1. brew install phantomjs
1. npm install -g grunt-cli

Next, `cd` into the `geotrigger-editor` working directory and run `npm install` to make sure all node modules are present.

### Working locally

You need a HTTP server at `localhost:8080` serving files from the root of the repository. `/` uses files from `dist`, and `/dev/` uses files from `dev`. The `grunt dev` task takes care of this for you (see `Grunt Tasks` below).

### Testing locally

Testing requires PhantomJS to be running. You can get it started by running `phantomjs --webdriver=4444`. The local server should already be running too. The `grunt test` task takes care of the latter part (see `Grunt Tasks` below).

## Grunt Tasks

1. `grunt test`

  This task will start a test server at `localhost:8080`, then run the jshint, complexity, and cucumber tasks to see if the code does not smell.

2. `grunt dev`

  This task will clean out the dev folder and build out all the necessary files for development, run a server at `localhost:8080`, then continuously watch for changes in the `src` directory until you end the process.

3. `grunt build`

  This task will build the production version of the editor into the `dist` folder.

The `default` grunt task runs `test` followed by `build` to ensure all tests are running successfully before building a production version.
