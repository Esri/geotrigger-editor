# Geotrigger Editor Changelog

## master
* bump leaflet to 0.7.1
* bump handlebars to 1.3.0
* bump marionette to 1.4.1
* remove marionette from `vendor` and `.gitmodules`
* fix CSS rules leaking into global scope
* fix incorrectly filled callback URL & tracking profile fields after update

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
