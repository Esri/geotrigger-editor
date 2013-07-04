(function(){

  function dependencyTest() {
    var deps = [
      [JSON, 'JSON'],
      [$,'jQuery'],
      [_,'underscore'],
      [Backbone,'Backbone'],
      [Backbone.Marionette,'Backbone.Marionette'],
      [Geoservices,'Geoservices'],
      [Geotriggers,'Geotriggers'],
      [L,'Leaflet'],
      [L.esri,'Esri-leaflet']
    ];

    console.log('Dependency Check:');

    for (var i=0; i<deps.length; i++) {
      console.log(typeof deps[i][0] !== 'undefined' ? '√' : 'x', deps[i][1]);
    }
  }

  function mapTest() {

    var map = L.map('gt-map');

    map.zoomControl.setPosition('topright');

    // ArcGIS Online Basemaps - Streets, Topographic, Gray, Gray Labels, Ocean, NationalGeographic, Imagery, ImageryLabels
    L.esri.basemapLayer("Imagery", {
      zIndex: 1,
      detectRetina: true
    }).addTo(map);

    L.esri.basemapLayer("ImageryLabels", {
      zIndex: 3
    }).addTo(map);

    function onLocationFound(e) {
      var radius = e.accuracy / 2;
      L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
      L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    map.locate({setView: true, maxZoom: 16});
  }

  function init() {
    dependencyTest();
    mapTest();
  }

  if (typeof window === 'object') {
    window.onload = init;
  } else {
    console.log('hello console');
  }

})();
