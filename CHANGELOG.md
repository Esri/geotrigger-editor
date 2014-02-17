# Geotrigger Editor Changelog

## master
* Fix scrollbar css bug (`overflow: hidden` needs to be set on controls and notes regions)

## v0.2.0
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

## v0.1.3
* fix CSS issue causing IDs not to display in title area on edit ([#186](https://github.com/Esri/geotrigger-editor/issues/186))
* bump esri-leaflet to v0.0.1-beta.3
* bump geotrigger-js to v0.1.5
* fix highlight issue for list items
* make some routes (list, new, edit) more forgiving with trailing slashes
* add beautifier tasks (`grunt verify` & `grunt format`), format js & templates

## v0.1.2
* better template compression
* trigger form validation
* proper JSON parsing for notification data ([#180](https://github.com/Esri/geotrigger-editor/issues/180))
* replace optional title with ability to enter custom trigger ID ([#179](https://github.com/Esri/geotrigger-editor/issues/179))

## v0.1.1
* wrap trigger IDs in search link on list ([#168](https://github.com/Esri/geotrigger-editor/issues/168))
* check for distance before geojson when rendering shapes on map ([#175](https://github.com/Esri/geotrigger-editor/pull/175))
* remove compiled.js from source control ([#176](https://github.com/Esri/geotrigger-editor/pull/176))
* update tag label and placeholder text in form ([#176](https://github.com/Esri/geotrigger-editor/pull/176))
* wrap application in a closure ([#176](https://github.com/Esri/geotrigger-editor/pull/176))

## v0.1.0
* First public release
