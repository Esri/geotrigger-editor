(function(){

  function GeotriggerEditor(options) {
    this.el = options.el || '#gt-editor';
    this.map = null;
    this.addMap();
  }

  GeotriggerEditor.prototype.addMap = function() {
    $(this.el).append('<div id="gt-map"/>');

    var map = this.map = L.map('gt-map');

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

    return this;
  };

  window.GeotriggerEditor = GeotriggerEditor;

})();
