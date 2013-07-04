console.log('Hello Loqi, we doin this Team Quoin thing!');

require([
	"esri/map", 
  "dojo/query",
	"dojo/domReady!",
  "dojo/NodeList-data",
  "dojo/NodeList-dom",
  "dojo/NodeList-fx",
  "dojo/NodeList-html",
  "dojo/NodeList-manipulate",
  "dojo/NodeList-traverse"
  ], function(Map, $) {

    var mapDiv = $('.map');
    console.log(mapDiv);

    var map = new Map("mapDiv", {
      center: [-56.049, 38.485],
      zoom: 3,
      basemap: "gray"
    });
    console.log(map);
});