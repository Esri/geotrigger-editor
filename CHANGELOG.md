# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

* bump `leaflet` to `0.7.7` and move to CDN
* bump `esri-leaflet` to `1.0.1` and move to CDN
* bump `esri-leaflet-geocoder` to `1.0.2` and move to CDN
* move `Leaflet.draw` to CDN
* changed basemap to [Esri World Topographic](http://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f)
* moved geosearch control below the basemap widget
* corrected relative path links to images in geotrigger-editor.css
* bumped `grunt-contrib-uglify` version to `~0.10.0` to resolve a bug compiling the built source
* corrected relative path links to images
* admitted that our current proxy sample still needs work

## [0.2.1] - 2014-4-10
### Fixed
* Fix IE scrollbar CSS bug
* Add warning notifying users of lack of support for touch-enabled browsers
* Fix underscoreDeepExtend breaking in AMD environments
* bump leaflet.draw to 0.2.3
* bump geotrigger-js to 1.0.0
* bump esri-leaflet-geocoder to 0.0.1-beta.3
* Add basemap switcher ([#160](https://github.com/Esri/geotrigger-editor/issues/160))

## [0.2.0] - 2014-2-11
### Fixed
* bump leaflet to 0.7.1
* bump handlebars to 1.3.0
* bump marionette to 1.4.1
* remove marionette from `vendor` and `.gitmodules`
* fix CSS rules leaking into global scope
* fix bug where callback URL & tracking profile fields were incorrectly filled after trigger/update
* add geocoder control for fast map traversal ([#195](https://github.com/Esri/geotrigger-editor/issues/195))
* use compass `image-url` to allow easily generating URLs for different structures using grunt-compass and `httpImagesPath`
* change image folder from `img/icons` to `img/geotrigger-editor` to avoid conflicts
* move namespace to `Geotrigger.Editor` ([#185](https://github.com/Esri/geotrigger-editor/issues/185))
* add support for `properties`, `rateLimit`, and `times` trigger parameters ([#192](https://github.com/Esri/geotrigger-editor/issues/192) & [#193](https://github.com/Esri/geotrigger-editor/issues/193))
* fix for duplicate triggers appearing in list on trigger/create overwrite ([#189](https://github.com/Esri/geotrigger-editor/issues/189) & [#194](https://github.com/Esri/geotrigger-editor/issues/194))

## [0.1.3] - 2014-1-6
### Fixed
* fix CSS issue causing IDs not to display in title area on edit ([#186](https://github.com/Esri/geotrigger-editor/issues/186))
* bump esri-leaflet to v0.0.1-beta.3
* bump geotrigger-js to v0.1.5
* fix highlight issue for list items
* make some routes (list, new, edit) more forgiving with trailing slashes
* add beautifier tasks (`grunt verify` & `grunt format`), format js & templates

## [0.1.2] - 2013-12-31
### Fixed
* better template compression
* trigger form validation
* proper JSON parsing for notification data ([#180](https://github.com/Esri/geotrigger-editor/issues/180))
* replace optional title with ability to enter custom trigger ID ([#179](https://github.com/Esri/geotrigger-editor/issues/179))

## [0.1.1] - 2013-12-11
### Fixed
* wrap trigger IDs in search link on list ([#168](https://github.com/Esri/geotrigger-editor/issues/168))
* check for distance before geojson when rendering shapes on map ([#175](https://github.com/Esri/geotrigger-editor/pull/175))
* remove compiled.js from source control ([#176](https://github.com/Esri/geotrigger-editor/pull/176))
* update tag label and placeholder text in form ([#176](https://github.com/Esri/geotrigger-editor/pull/176))
* wrap application in a closure ([#176](https://github.com/Esri/geotrigger-editor/pull/176))

## 0.1.0 - 2013-11-19

This is the first public release of the Geotrigger Editor for the ArcGIS Geotrigger Service.

Currently the Geotrigger Editor is in development and should be thought of as a beta or preview.

[Unreleased]: https://github.com/Esri/geotrigger-editor/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/Esri/geotrigger-editor/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Esri/geotrigger-editor/compare/v0.1.3...v0.2.0
[0.1.3]: https://github.com/Esri/geotrigger-editor/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Esri/geotrigger-editor/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Esri/geotrigger-editor/compare/v0.1.0...v0.1.1
