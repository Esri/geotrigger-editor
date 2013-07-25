L.Tooltip.prototype.updatePosition = function(latlng) {
  var pos = this._map.latLngToLayerPoint(latlng);

  L.DomUtil.setPosition(this._container, pos);
  this._container.style.display = 'inline-block';

  return this;
};