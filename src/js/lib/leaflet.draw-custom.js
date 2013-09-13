/*
  Leaflet.draw, a plugin that adds drawing and editing tools to Leaflet powered maps.
  (c) 2012-2013, Jacob Toye, Smartrak

  https://github.com/Leaflet/Leaflet.draw
  http://leafletjs.com
  https://github.com/jacobtoye
*/
(function (window, document, undefined) {
/*
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */

L.drawVersion = '0.2.1-dev';

L.drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: 'Cancel drawing',
        text: 'Cancel'
      },
      buttons: {
        polyline: 'Draw a polyline',
        polygon: 'Draw a polygon',
        rectangle: 'Draw a rectangle',
        circle: 'Draw a circle',
        marker: 'Draw a marker'
      }
    },
    handlers: {
      circle: {
        tooltip: {
          start: 'Click and drag to draw circle.'
        }
      },
      marker: {
        tooltip: {
          start: 'Click map to place marker.'
        }
      },
      polygon: {
        tooltip: {
          start: 'Click to start drawing shape.',
          cont: 'Click to continue drawing shape.',
          end: 'Click first point to close this shape.'
        }
      },
      polyline: {
        error: '<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: 'Click to start drawing line.',
          cont: 'Click to continue drawing line.',
          end: 'Click last point to finish line.'
        }
      },
      rectangle: {
        tooltip: {
          start: 'Click and drag to draw rectangle.'
        }
      },
      simpleshape: {
        tooltip: {
          end: 'Release mouse to finish drawing.'
        }
      }
    }
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Save changes.',
          text: 'Save'
        },
        cancel: {
          title: 'Cancel editing, discards all changes.',
          text: 'Cancel'
        }
      },
      buttons: {
        edit: 'Edit layers',
        remove: 'Delete layers'
      }
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Drag handles, or marker to edit feature.',
          subtext: 'Click cancel to undo changes.'
        }
      },
      remove: {
        tooltip: {
          text: 'Click on a feature to remove'
        }
      }
    }
  }
};

L.Draw = {};

L.Draw.Feature = L.Handler.extend({
  includes: L.Mixin.Events,

  initialize: function (map, options) {
    this._map = map;
    this._container = map._container;
    this._overlayPane = map._panes.overlayPane;
    this._popupPane = map._panes.popupPane;

    // Merge default shapeOptions options with custom shapeOptions
    if (options && options.shapeOptions) {
      options.shapeOptions = L.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
    }
    L.Util.extend(this.options, options);
  },

  enable: function () {
    if (this._enabled) { return; }

    L.Handler.prototype.enable.call(this);

    this.fire('enabled', { handler: this.type });

    this._map.fire('draw:drawstart', { layerType: this.type });
  },

  disable: function () {
    if (!this._enabled) { return; }

    L.Handler.prototype.disable.call(this);

    this.fire('disabled', { handler: this.type });

    this._map.fire('draw:drawstop', { layerType: this.type });
  },

  addHooks: function () {
    if (this._map) {
      L.DomUtil.disableTextSelection();

      this._tooltip = new L.Tooltip(this._map);

      L.DomEvent.addListener(this._container, 'keyup', this._cancelDrawing, this);
    }
  },

  removeHooks: function () {
    if (this._map) {
      L.DomUtil.enableTextSelection();

      this._tooltip.dispose();
      this._tooltip = null;

      L.DomEvent.removeListener(this._container, 'keyup', this._cancelDrawing);
    }
  },

  setOptions: function (options) {
    L.setOptions(this, options);
  },

  _fireCreatedEvent: function (layer) {
    this._map.fire('draw:created', { layer: layer, layerType: this.type });
  },

  // Cancel drawing when the escape key is pressed
  _cancelDrawing: function (e) {
    if (e.keyCode === 27) {
      this.disable();
    }
  }
});

L.Draw.Polyline = L.Draw.Feature.extend({
  statics: {
    TYPE: 'polyline'
  },

  Poly: L.Polyline,

  options: {
    allowIntersection: true,
    drawError: {
      color: '#b00b00',
      message: L.drawLocal.draw.handlers.polyline.error,
      timeout: 2500
    },
    icon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon'
    }),
    guidelineDistance: 20,
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: false,
      clickable: true
    },
    zIndexOffset: 2000 // This should be > than the highest z-index any map layers
  },

  initialize: function (map, options) {
    // Merge default drawError options with custom options
    if (options && options.drawError) {
      options.drawError = L.Util.extend({}, this.options.drawError, options.drawError);
    }

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Polyline.TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },

  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);
    if (this._map) {
      this._markers = [];

      this._markerGroup = new L.LayerGroup();
      this._map.addLayer(this._markerGroup);

      this._poly = new L.Polyline([], this.options.shapeOptions);

      this._tooltip.updateContent(this._getTooltipText());

      // Make a transparent marker that will used to catch click events. These click
      // events will create the vertices. We need to do this so we can ensure that
      // we can create vertices over other map layers (markers, vector layers). We
      // also do not want to trigger any click handlers of objects we are clicking on
      // while drawing.
      if (!this._mouseMarker) {
        this._mouseMarker = L.marker(this._map.getCenter(), {
          icon: L.divIcon({
            className: 'leaflet-mouse-marker',
            iconAnchor: [20, 20],
            iconSize: [40, 40]
          }),
          opacity: 0,
          zIndexOffset: this.options.zIndexOffset
        });
      }

      this._mouseMarker
        .on('click', this._onClick, this)
        .addTo(this._map);

      this._map
        .on('mousemove', this._onMouseMove, this)
        .on('zoomend', this._onZoomEnd, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);

    this._clearHideErrorTimeout();

    this._cleanUpShape();

    // remove markers from map
    this._map.removeLayer(this._markerGroup);
    delete this._markerGroup;
    delete this._markers;

    this._map.removeLayer(this._poly);
    delete this._poly;

    this._mouseMarker.off('click', this._onClick, this);
    this._map.removeLayer(this._mouseMarker);
    delete this._mouseMarker;

    // clean up DOM
    this._clearGuides();

    this._map
      .off('mousemove', this._onMouseMove, this)
      .off('zoomend', this._onZoomEnd, this);
  },

  _finishShape: function () {
    var intersects = this._poly.newLatLngIntersects(this._poly.getLatLngs()[0], true);

    if ((!this.options.allowIntersection && intersects) || !this._shapeIsValid()) {
      this._showErrorTooltip();
      return;
    }

    this._fireCreatedEvent();
    this.disable();
  },

  //Called to verify the shape is valid when the user tries to finish it
  //Return false if the shape is not valid
  _shapeIsValid: function () {
    return true;
  },

  _onZoomEnd: function () {
    this._updateGuide();
  },

  _onMouseMove: function (e) {
    var newPos = e.layerPoint,
      latlng = e.latlng;

    // Save latlng
    // should this be moved to _updateGuide() ?
    this._currentLatLng = latlng;

    this._updateTooltip(latlng);

    // Update the guide line
    this._updateGuide(newPos);

    // Update the mouse marker position
    this._mouseMarker.setLatLng(latlng);

    L.DomEvent.preventDefault(e.originalEvent);
  },

  _onClick: function (e) {
    var latlng = e.target.getLatLng(),
      markerCount = this._markers.length;

    if (markerCount > 0 && !this.options.allowIntersection && this._poly.newLatLngIntersects(latlng)) {
      this._showErrorTooltip();
      return;
    }
    else if (this._errorShown) {
      this._hideErrorTooltip();
    }

    this._markers.push(this._createMarker(latlng));

    this._poly.addLatLng(latlng);

    if (this._poly.getLatLngs().length === 2) {
      this._map.addLayer(this._poly);
    }

    this._updateFinishHandler();

    this._vertexAdded(latlng);

    this._clearGuides();

    this._updateTooltip();
  },

  _updateFinishHandler: function () {
    var markerCount = this._markers.length;
    // The last marker should have a click handler to close the polyline
    if (markerCount > 1) {
      this._markers[markerCount - 1].on('click', this._finishShape, this);
    }

    // Remove the old marker click handler (as only the last point should close the polyline)
    if (markerCount > 2) {
      this._markers[markerCount - 2].off('click', this._finishShape, this);
    }
  },

  _createMarker: function (latlng) {
    var marker = new L.Marker(latlng, {
      icon: this.options.icon,
      zIndexOffset: this.options.zIndexOffset * 2
    });

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _updateGuide: function (newPos) {
    newPos = newPos || this._map.latLngToLayerPoint(this._currentLatLng);

    var markerCount = this._markers.length;

    if (markerCount > 0) {
      // draw the guide line
      this._clearGuides();
      this._drawGuide(
        this._map.latLngToLayerPoint(this._markers[markerCount - 1].getLatLng()),
        newPos
      );
    }
  },

  _updateTooltip: function (latLng) {
    var text = this._getTooltipText();

    if (latLng) {
      this._tooltip.updatePosition(latLng);
    }

    if (!this._errorShown) {
      this._tooltip.updateContent(text);
    }
  },

  _drawGuide: function (pointA, pointB) {
    var length = Math.floor(Math.sqrt(Math.pow((pointB.x - pointA.x), 2) + Math.pow((pointB.y - pointA.y), 2))),
      i,
      fraction,
      dashPoint,
      dash;

    //create the guides container if we haven't yet
    if (!this._guidesContainer) {
      this._guidesContainer = L.DomUtil.create('div', 'leaflet-draw-guides', this._overlayPane);
    }

    //draw a dash every GuildeLineDistance
    for (i = this.options.guidelineDistance; i < length; i += this.options.guidelineDistance) {
      //work out fraction along line we are
      fraction = i / length;

      //calculate new x,y point
      dashPoint = {
        x: Math.floor((pointA.x * (1 - fraction)) + (fraction * pointB.x)),
        y: Math.floor((pointA.y * (1 - fraction)) + (fraction * pointB.y))
      };

      //add guide dash to guide container
      dash = L.DomUtil.create('div', 'leaflet-draw-guide-dash', this._guidesContainer);
      dash.style.backgroundColor =
        !this._errorShown ? this.options.shapeOptions.color : this.options.drawError.color;

      L.DomUtil.setPosition(dash, dashPoint);
    }
  },

  _updateGuideColor: function (color) {
    if (this._guidesContainer) {
      for (var i = 0, l = this._guidesContainer.childNodes.length; i < l; i++) {
        this._guidesContainer.childNodes[i].style.backgroundColor = color;
      }
    }
  },

  // removes all child elements (guide dashes) from the guides container
  _clearGuides: function () {
    if (this._guidesContainer) {
      while (this._guidesContainer.firstChild) {
        this._guidesContainer.removeChild(this._guidesContainer.firstChild);
      }
    }
  },

  _getTooltipText: function () {
    var labelText,
      distance,
      distanceStr;

    if (this._markers.length === 0) {
      labelText = {
        text: L.drawLocal.draw.handlers.polyline.tooltip.start
      };
    } else {
      // calculate the distance from the last fixed point to the mouse position
      distance = this._measurementRunningTotal + this._currentLatLng.distanceTo(this._markers[this._markers.length - 1].getLatLng());
      // show metres when distance is < 1km, then show km
      distanceStr = distance  > 1000 ? (distance  / 1000).toFixed(2) + ' km' : Math.ceil(distance) + ' m';

      if (this._markers.length === 1) {
        labelText = {
          text: L.drawLocal.draw.handlers.polyline.tooltip.cont,
          subtext: distanceStr
        };
      } else {
        labelText = {
          text: L.drawLocal.draw.handlers.polyline.tooltip.end,
          subtext: distanceStr
        };
      }
    }
    return labelText;
  },

  _showErrorTooltip: function () {
    this._errorShown = true;

    // Update tooltip
    this._tooltip
      .showAsError()
      .updateContent({ text: this.options.drawError.message });

    // Update shape
    this._updateGuideColor(this.options.drawError.color);
    this._poly.setStyle({ color: this.options.drawError.color });

    // Hide the error after 2 seconds
    this._clearHideErrorTimeout();
    this._hideErrorTimeout = setTimeout(L.Util.bind(this._hideErrorTooltip, this), this.options.drawError.timeout);
  },

  _hideErrorTooltip: function () {
    this._errorShown = false;

    this._clearHideErrorTimeout();

    // Revert tooltip
    this._tooltip
      .removeError()
      .updateContent(this._getTooltipText());

    // Revert shape
    this._updateGuideColor(this.options.shapeOptions.color);
    this._poly.setStyle({ color: this.options.shapeOptions.color });
  },

  _clearHideErrorTimeout: function () {
    if (this._hideErrorTimeout) {
      clearTimeout(this._hideErrorTimeout);
      this._hideErrorTimeout = null;
    }
  },

  _vertexAdded: function (latlng) {
    if (this._markers.length === 1) {
      this._measurementRunningTotal = 0;
    }
    else {
      this._measurementRunningTotal +=
        latlng.distanceTo(this._markers[this._markers.length - 2].getLatLng());
    }
  },

  _cleanUpShape: function () {
    if (this._markers.length > 1) {
      this._markers[this._markers.length - 1].off('click', this._finishShape, this);
    }
  },

  _fireCreatedEvent: function () {
    var poly = new this.Poly(this._poly.getLatLngs(), this.options.shapeOptions);
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, poly);
  }
});

L.Draw.Polygon = L.Draw.Polyline.extend({
  statics: {
    TYPE: 'polygon'
  },

  Poly: L.Polygon,

  options: {
    showArea: false,
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    L.Draw.Polyline.prototype.initialize.call(this, map, options);

    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Polygon.TYPE;
  },

  _updateFinishHandler: function () {
    var markerCount = this._markers.length;

    // The first marker shold have a click handler to close the polygon
    if (markerCount === 1) {
      this._markers[0].on('click', this._finishShape, this);
    }

    // Add and update the double click handler
    if (markerCount > 2) {
      this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
      // Only need to remove handler if has been added before
      if (markerCount > 3) {
        this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
      }
    }
  },

  _getTooltipText: function () {
    var text, subtext;

    if (this._markers.length === 0) {
      text = L.drawLocal.draw.handlers.polygon.tooltip.start;
    } else if (this._markers.length < 3) {
      text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
    } else {
      text = L.drawLocal.draw.handlers.polygon.tooltip.end;
      subtext = this._area;
    }

    return {
      text: text,
      subtext: subtext
    };
  },

  _shapeIsValid: function () {
    return this._markers.length >= 3;
  },

  _vertexAdded: function () {
    // Check to see if we should show the area
    if (this.options.allowIntersection || !this.options.showArea) {
      return;
    }

    var latLngs = this._poly.getLatLngs(),
      area = L.PolygonUtil.geodesicArea(latLngs);

    // Convert to most appropriate units
    if (area > 10000) {
      area = (area * 0.0001).toFixed(2) + ' ha';
    } else {
      area = area.toFixed(2) + ' m&sup2;';
    }

    this._area = area;
  },

  _cleanUpShape: function () {
    var markerCount = this._markers.length;

    if (markerCount > 0) {
      this._markers[0].off('click', this._finishShape, this);

      if (markerCount > 2) {
        this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
      }
    }
  }
});


L.SimpleShape = {};

L.Draw.SimpleShape = L.Draw.Feature.extend({
  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);
    if (this._map) {
      this._map.dragging.disable();
      //TODO refactor: move cursor to styles
      this._container.style.cursor = 'crosshair';

      this._tooltip.updateContent({ text: this._initialLabelText });

      this._map
        .on('mousedown', this._onMouseDown, this)
        .on('mousemove', this._onMouseMove, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);
    if (this._map) {
      this._map.dragging.enable();
      //TODO refactor: move cursor to styles
      this._container.style.cursor = '';

      this._map
        .off('mousedown', this._onMouseDown, this)
        .off('mousemove', this._onMouseMove, this);

      L.DomEvent.off(document, 'mouseup', this._onMouseUp);

      // If the box element doesn't exist they must not have moved the mouse, so don't need to destroy/return
      if (this._shape) {
        this._map.removeLayer(this._shape);
        delete this._shape;
      }
    }
    this._isDrawing = false;
  },

  _onMouseDown: function (e) {
    this._isDrawing = true;
    this._startLatLng = e.latlng;

    L.DomEvent
      .on(document, 'mouseup', this._onMouseUp, this)
      .preventDefault(e.originalEvent);
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng;

    this._tooltip.updatePosition(latlng);
    if (this._isDrawing) {
      this._tooltip.updateContent({ text: L.drawLocal.draw.handlers.simpleshape.tooltip.end });
      this._drawShape(latlng);
    }
  },

  _onMouseUp: function () {
    if (this._shape) {
      this._fireCreatedEvent();
    }

    this.disable();
  }
});

L.Draw.Rectangle = L.Draw.SimpleShape.extend({
  statics: {
    TYPE: 'rectangle'
  },

  options: {
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Rectangle.TYPE;

    L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
  },
  _initialLabelText: L.drawLocal.draw.handlers.rectangle.tooltip.start,

  _drawShape: function (latlng) {
    if (!this._shape) {
      this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
      this._map.addLayer(this._shape);
    } else {
      this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));
    }
  },

  _fireCreatedEvent: function () {
    var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
    L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, rectangle);
  }
});


L.Draw.Circle = L.Draw.SimpleShape.extend({
  statics: {
    TYPE: 'circle'
  },

  options: {
    shapeOptions: {
      stroke: true,
      color: '#f06eaa',
      weight: 4,
      opacity: 0.5,
      fill: true,
      fillColor: null, //same as color by default
      fillOpacity: 0.2,
      clickable: true
    }
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Circle.TYPE;

    L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
  },

  _initialLabelText: L.drawLocal.draw.handlers.circle.tooltip.start,

  _drawShape: function (latlng) {
    if (!this._shape) {
      this._shape = new L.Circle(this._startLatLng, this._startLatLng.distanceTo(latlng), this.options.shapeOptions);
      this._map.addLayer(this._shape);
    } else {
      this._shape.setRadius(this._startLatLng.distanceTo(latlng));
    }
  },

  _fireCreatedEvent: function () {
    var circle = new L.Circle(this._startLatLng, this._shape.getRadius(), this.options.shapeOptions);
    L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, circle);
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng,
      radius;

    this._tooltip.updatePosition(latlng);
    if (this._isDrawing) {
      this._drawShape(latlng);

      // Get the new radius (rouded to 1 dp)
      radius = this._shape.getRadius().toFixed(1);

      this._tooltip.updateContent({
        text: 'Release mouse to finish drawing.',
        subtext: 'Radius: ' + radius + ' m'
      });
    }
  }
});

L.Draw.Marker = L.Draw.Feature.extend({
  statics: {
    TYPE: 'marker'
  },

  options: {
    icon: new L.Icon.Default(),
    zIndexOffset: 2000 // This should be > than the highest z-index any markers
  },

  initialize: function (map, options) {
    // Save the type so super can fire, need to do this as cannot do this.TYPE :(
    this.type = L.Draw.Marker.TYPE;

    L.Draw.Feature.prototype.initialize.call(this, map, options);
  },

  addHooks: function () {
    L.Draw.Feature.prototype.addHooks.call(this);

    if (this._map) {
      this._tooltip.updateContent({ text: L.drawLocal.draw.handlers.marker.tooltip.start });

      // Same mouseMarker as in Draw.Polyline
      if (!this._mouseMarker) {
        this._mouseMarker = L.marker(this._map.getCenter(), {
          icon: L.divIcon({
            className: 'leaflet-mouse-marker',
            iconAnchor: [20, 20],
            iconSize: [40, 40]
          }),
          opacity: 0,
          zIndexOffset: this.options.zIndexOffset
        });
      }

      this._mouseMarker
        .on('click', this._onClick, this)
        .addTo(this._map);

      this._map.on('mousemove', this._onMouseMove, this);
    }
  },

  removeHooks: function () {
    L.Draw.Feature.prototype.removeHooks.call(this);

    if (this._map) {
      if (this._marker) {
        this._marker.off('click', this._onClick, this);
        this._map
          .off('click', this._onClick, this)
          .removeLayer(this._marker);
        delete this._marker;
      }

      this._mouseMarker.off('click', this._onClick, this);
      this._map.removeLayer(this._mouseMarker);
      delete this._mouseMarker;

      this._map.off('mousemove', this._onMouseMove, this);
    }
  },

  _onMouseMove: function (e) {
    var latlng = e.latlng;

    this._tooltip.updatePosition(latlng);
    this._mouseMarker.setLatLng(latlng);

    if (!this._marker) {
      this._marker = new L.Marker(latlng, {
        icon: this.options.icon,
        zIndexOffset: this.options.zIndexOffset
      });
      // Bind to both marker and map to make sure we get the click event.
      this._marker.on('click', this._onClick, this);
      this._map
        .on('click', this._onClick, this)
        .addLayer(this._marker);
    }
    else {
      this._marker.setLatLng(latlng);
    }
  },

  _onClick: function () {
    this._fireCreatedEvent();

    this.disable();
  },

  _fireCreatedEvent: function () {
    var marker = new L.Marker(this._marker.getLatLng(), { icon: this.options.icon });
    L.Draw.Feature.prototype._fireCreatedEvent.call(this, marker);
  }
});

L.Edit = L.Edit || {};

/*
 * L.Edit.Poly is an editing handler for polylines and polygons.
 */

L.Edit.Poly = L.Handler.extend({
  options: {
    icon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon'
    })
  },

  initialize: function (poly, options) {
    this._poly = poly;
    L.setOptions(this, options);
  },

  addHooks: function () {
    if (this._poly._map) {
      if (!this._markerGroup) {
        this._initMarkers();
      }
      this._poly._map.addLayer(this._markerGroup);
    }
  },

  removeHooks: function () {
    if (this._poly._map) {
      this._poly._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
      delete this._markers;
    }
  },

  updateMarkers: function () {
    this._markerGroup.clearLayers();
    this._initMarkers();
  },

  _initMarkers: function () {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }
    this._markers = [];

    var latlngs = this._poly._latlngs,
      i, j, len, marker;

    // TODO refactor holes implementation in Polygon to support it here

    for (i = 0, len = latlngs.length; i < len; i++) {

      marker = this._createMarker(latlngs[i], i);
      marker.on('click', this._onMarkerClick, this);
      this._markers.push(marker);
    }

    var markerLeft, markerRight;

    for (i = 0, j = len - 1; i < len; j = i++) {
      if (i === 0 && !(L.Polygon && (this._poly instanceof L.Polygon))) {
        continue;
      }

      markerLeft = this._markers[j];
      markerRight = this._markers[i];

      this._createMiddleMarker(markerLeft, markerRight);
      this._updatePrevNext(markerLeft, markerRight);
    }
  },

  _createMarker: function (latlng, index) {
    var marker = new L.Marker(latlng, {
      draggable: true,
      icon: this.options.icon
    });

    marker._origLatLng = latlng;
    marker._index = index;

    marker.on('drag', this._onMarkerDrag, this);
    marker.on('dragend', this._fireEdit, this);

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _removeMarker: function (marker) {
    var i = marker._index;

    this._markerGroup.removeLayer(marker);
    this._markers.splice(i, 1);
    this._poly.spliceLatLngs(i, 1);
    this._updateIndexes(i, -1);

    marker
      .off('drag', this._onMarkerDrag, this)
      .off('dragend', this._fireEdit, this)
      .off('click', this._onMarkerClick, this);
  },

  _fireEdit: function () {
    this._poly.edited = true;
    this._poly.fire('edit');
  },

  _onMarkerDrag: function (e) {
    var marker = e.target;

    L.extend(marker._origLatLng, marker._latlng);

    if (marker._middleLeft) {
      marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
    }
    if (marker._middleRight) {
      marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
    }

    this._poly.redraw();
  },

  _onMarkerClick: function (e) {
    // we want to remove the marker on click, but if latlng count < 3, polyline would be invalid
    if (this._poly._latlngs.length < 3) { return; }

    var marker = e.target;

    // remove the marker
    this._removeMarker(marker);

    // update prev/next links of adjacent markers
    this._updatePrevNext(marker._prev, marker._next);

    // remove ghost markers near the removed marker
    if (marker._middleLeft) {
      this._markerGroup.removeLayer(marker._middleLeft);
    }
    if (marker._middleRight) {
      this._markerGroup.removeLayer(marker._middleRight);
    }

    // create a ghost marker in place of the removed one
    if (marker._prev && marker._next) {
      this._createMiddleMarker(marker._prev, marker._next);

    } else if (!marker._prev) {
      marker._next._middleLeft = null;

    } else if (!marker._next) {
      marker._prev._middleRight = null;
    }

    this._fireEdit();
  },

  _updateIndexes: function (index, delta) {
    this._markerGroup.eachLayer(function (marker) {
      if (marker._index > index) {
        marker._index += delta;
      }
    });
  },

  _createMiddleMarker: function (marker1, marker2) {
    var latlng = this._getMiddleLatLng(marker1, marker2),
        marker = this._createMarker(latlng),
        onClick,
        onDragStart,
        onDragEnd;

    marker.setOpacity(0.6);

    marker1._middleRight = marker2._middleLeft = marker;

    onDragStart = function () {
      var i = marker2._index;

      marker._index = i;

      marker
          .off('click', onClick, this)
          .on('click', this._onMarkerClick, this);

      latlng.lat = marker.getLatLng().lat;
      latlng.lng = marker.getLatLng().lng;
      this._poly.spliceLatLngs(i, 0, latlng);
      this._markers.splice(i, 0, marker);

      marker.setOpacity(1);

      this._updateIndexes(i, 1);
      marker2._index++;
      this._updatePrevNext(marker1, marker);
      this._updatePrevNext(marker, marker2);
    };

    onDragEnd = function () {
      marker.off('dragstart', onDragStart, this);
      marker.off('dragend', onDragEnd, this);

      this._createMiddleMarker(marker1, marker);
      this._createMiddleMarker(marker, marker2);
    };

    onClick = function () {
      onDragStart.call(this);
      onDragEnd.call(this);
      this._fireEdit();
    };

    marker
        .on('click', onClick, this)
        .on('dragstart', onDragStart, this)
        .on('dragend', onDragEnd, this);

    this._markerGroup.addLayer(marker);
  },

  _updatePrevNext: function (marker1, marker2) {
    if (marker1) {
      marker1._next = marker2;
    }
    if (marker2) {
      marker2._prev = marker1;
    }
  },

  _getMiddleLatLng: function (marker1, marker2) {
    var map = this._poly._map,
        p1 = map.latLngToLayerPoint(marker1.getLatLng()),
        p2 = map.latLngToLayerPoint(marker2.getLatLng());

    return map.layerPointToLatLng(p1._add(p2)._divideBy(2));
  }
});

L.Polyline.addInitHook(function () {

  // Check to see if handler has already been initialized. This is to support versions of Leaflet that still have L.Handler.PolyEdit
  if (this.editing) {
    return;
  }

  if (L.Edit.Poly) {
    this.editing = new L.Edit.Poly(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }

  this.on('add', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.addHooks();
    }
  });

  this.on('remove', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.removeHooks();
    }
  });
});


L.Edit = L.Edit || {};

L.Edit.SimpleShape = L.Handler.extend({
  options: {
    moveIcon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
    }),
    resizeIcon: new L.DivIcon({
      iconSize: new L.Point(8, 8),
      className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize'
    })
  },

  initialize: function (shape, options) {
    this._shape = shape;
    L.Util.setOptions(this, options);
  },

  addHooks: function () {
    if (this._shape._map) {
      this._map = this._shape._map;

      if (!this._markerGroup) {
        this._initMarkers();
      }
      this._map.addLayer(this._markerGroup);
    }
  },

  removeHooks: function () {
    if (this._shape._map) {
      this._unbindMarker(this._moveMarker);

      for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
        this._unbindMarker(this._resizeMarkers[i]);
      }
      this._resizeMarkers = null;

      this._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
    }

    this._map = null;
  },

  updateMarkers: function () {
    this._markerGroup.clearLayers();
    this._initMarkers();
  },

  _initMarkers: function () {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }

    // Create center marker
    this._createMoveMarker();

    // Create edge marker
    this._createResizeMarker();
  },

  _createMoveMarker: function () {
    // Children override
  },

  _createResizeMarker: function () {
    // Children override
  },

  _createMarker: function (latlng, icon) {
    var marker = new L.Marker(latlng, {
      draggable: true,
      icon: icon,
      zIndexOffset: 10
    });

    this._bindMarker(marker);

    this._markerGroup.addLayer(marker);

    return marker;
  },

  _bindMarker: function (marker) {
    marker
      .on('dragstart', this._onMarkerDragStart, this)
      .on('drag', this._onMarkerDrag, this)
      .on('dragend', this._onMarkerDragEnd, this);
  },

  _unbindMarker: function (marker) {
    marker
      .off('dragstart', this._onMarkerDragStart, this)
      .off('drag', this._onMarkerDrag, this)
      .off('dragend', this._onMarkerDragEnd, this);
  },

  _onMarkerDragStart: function (e) {
    var marker = e.target;
    marker.setOpacity(0);
  },

  _fireEdit: function () {
    this._shape.edited = true;
    this._shape.fire('edit');
  },

  _onMarkerDrag: function (e) {
    var marker = e.target,
      latlng = marker.getLatLng();

    if (marker === this._moveMarker) {
      this._move(latlng);
    } else {
      this._resize(latlng);
    }

    this._shape.redraw();
  },

  _onMarkerDragEnd: function (e) {
    var marker = e.target;
    marker.setOpacity(1);

    this._shape.fire('edit');
    this._fireEdit();
  },

  _move: function () {
    // Children override
  },

  _resize: function () {
    // Children override
  }
});

L.Edit = L.Edit || {};

L.Edit.Rectangle = L.Edit.SimpleShape.extend({
  _createMoveMarker: function () {
    var bounds = this._shape.getBounds(),
      center = bounds.getCenter();

    this._moveMarker = this._createMarker(center, this.options.moveIcon);
  },

  _createResizeMarker: function () {
    var corners = this._getCorners();

    this._resizeMarkers = [];

    for (var i = 0, l = corners.length; i < l; i++) {
      this._resizeMarkers.push(this._createMarker(corners[i], this.options.resizeIcon));
      // Monkey in the corner index as we will need to know this for dragging
      this._resizeMarkers[i]._cornerIndex = i;
    }
  },

  _onMarkerDragStart: function (e) {
    L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this, e);

    // Save a reference to the opposite point
    var corners = this._getCorners(),
      marker = e.target,
      currentCornerIndex = marker._cornerIndex;

    this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

    this._toggleCornerMarkers(0, currentCornerIndex);
  },

  _onMarkerDragEnd: function (e) {
    var marker = e.target,
      bounds, center;

    // Reset move marker position to the center
    if (marker === this._moveMarker) {
      bounds = this._shape.getBounds();
      center = bounds.getCenter();

      marker.setLatLng(center);
    }

    this._toggleCornerMarkers(1);

    this._repositionCornerMarkers();

    L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this, e);
  },

  _move: function (newCenter) {
    var latlngs = this._shape.getLatLngs(),
      bounds = this._shape.getBounds(),
      center = bounds.getCenter(),
      offset, newLatLngs = [];

    // Offset the latlngs to the new center
    for (var i = 0, l = latlngs.length; i < l; i++) {
      offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
      newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
    }

    this._shape.setLatLngs(newLatLngs);

    // Respoition the resize markers
    this._repositionCornerMarkers();
  },

  _resize: function (latlng) {
    var bounds;

    // Update the shape based on the current position of this corner and the opposite point
    this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

    // Respoition the move marker
    bounds = this._shape.getBounds();
    this._moveMarker.setLatLng(bounds.getCenter());
  },

  _getCorners: function () {
    var bounds = this._shape.getBounds(),
      nw = bounds.getNorthWest(),
      ne = bounds.getNorthEast(),
      se = bounds.getSouthEast(),
      sw = bounds.getSouthWest();

    return [nw, ne, se, sw];
  },

  _toggleCornerMarkers: function (opacity) {
    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setOpacity(opacity);
    }
  },

  _repositionCornerMarkers: function () {
    var corners = this._getCorners();

    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setLatLng(corners[i]);
    }
  }
});

L.Rectangle.addInitHook(function () {
  if (L.Edit.Rectangle) {
    this.editing = new L.Edit.Rectangle(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }
});

L.Edit = L.Edit || {};

L.Edit.Circle = L.Edit.SimpleShape.extend({
  _createMoveMarker: function () {
    var center = this._shape.getLatLng();

    this._moveMarker = this._createMarker(center, this.options.moveIcon);
  },

  _createResizeMarker: function () {
    var center = this._shape.getLatLng(),
      resizemarkerPoint = this._getResizeMarkerPoint(center);

    this._resizeMarkers = [];
    this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon));
  },

  _getResizeMarkerPoint: function (latlng) {
    // From L.shape.getBounds()
    var delta = this._shape._radius * Math.cos(Math.PI / 4),
      point = this._map.project(latlng);
    return this._map.unproject([point.x + delta, point.y - delta]);
  },

  _move: function (latlng) {
    var resizemarkerPoint = this._getResizeMarkerPoint(latlng);

    // Move the resize marker
    this._resizeMarkers[0].setLatLng(resizemarkerPoint);

    // Move the circle
    this._shape.setLatLng(latlng);
  },

  _resize: function (latlng) {
    var moveLatLng = this._moveMarker.getLatLng(),
      radius = moveLatLng.distanceTo(latlng);

    this._shape.setRadius(radius);
  }
});

L.Circle.addInitHook(function () {
  if (L.Edit.Circle) {
    this.editing = new L.Edit.Circle(this);

    if (this.options.editable) {
      this.editing.enable();
    }
  }

  this.on('add', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.addHooks();
    }
  });

  this.on('remove', function () {
    if (this.editing && this.editing.enabled()) {
      this.editing.removeHooks();
    }
  });
});

/*
 * L.LatLngUtil contains different utility functions for LatLngs.
 */

L.LatLngUtil = {
  // Clones a LatLngs[], returns [][]
  cloneLatLngs: function (latlngs) {
    var clone = [];
    for (var i = 0, l = latlngs.length; i < l; i++) {
      clone.push(this.cloneLatLng(latlngs[i]));
    }
    return clone;
  },

  cloneLatLng: function (latlng) {
    return L.latLng(latlng.lat, latlng.lng);
  }
};

/*
 * L.PolygonUtil contains different utility functions for Polygons.
 */

L.PolygonUtil = {
  // Ported from the OpenLayers implementation. See https://github.com/openlayers/openlayers/blob/master/lib/OpenLayers/Geometry/LinearRing.js#L270
  geodesicArea: function (latLngs) {
    var pointsCount = latLngs.length,
      area = 0.0,
      d2r = L.LatLng.DEG_TO_RAD,
      p1, p2;

    if (pointsCount > 2) {
      for (var i = 0; i < pointsCount; i++) {
        p1 = latLngs[i];
        p2 = latLngs[(i + 1) % pointsCount];
        area += ((p2.lng - p1.lng) * d2r) *
            (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
      }
      area = area * 6378137.0 * 6378137.0 / 2.0;
    }

    return Math.abs(area);
  }
};

L.Util.extend(L.LineUtil, {
  // Checks to see if two line segments intersect. Does not handle degenerate cases.
  // http://compgeom.cs.uiuc.edu/~jeffe/teaching/373/notes/x06-sweepline.pdf
  segmentsIntersect: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2, /*Point*/ p3) {
    return  this._checkCounterclockwise(p, p2, p3) !==
        this._checkCounterclockwise(p1, p2, p3) &&
        this._checkCounterclockwise(p, p1, p2) !==
        this._checkCounterclockwise(p, p1, p3);
  },

  // check to see if points are in counterclockwise order
  _checkCounterclockwise: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
    return (p2.y - p.y) * (p1.x - p.x) > (p1.y - p.y) * (p2.x - p.x);
  }
});

L.Polyline.include({
  // Check to see if this polyline has any linesegments that intersect.
  // NOTE: does not support detecting intersection for degenerate cases.
  intersects: function () {
    var points = this._originalPoints,
      len = points ? points.length : 0,
      i, p, p1;

    if (this._tooFewPointsForIntersection()) {
      return false;
    }

    for (i = len - 1; i >= 3; i--) {
      p = points[i - 1];
      p1 = points[i];


      if (this._lineSegmentsIntersectsRange(p, p1, i - 2)) {
        return true;
      }
    }

    return false;
  },

  // Check for intersection if new latlng was added to this polyline.
  // NOTE: does not support detecting intersection for degenerate cases.
  newLatLngIntersects: function (latlng, skipFirst) {
    // Cannot check a polyline for intersecting lats/lngs when not added to the map
    if (!this._map) {
      return false;
    }

    return this.newPointIntersects(this._map.latLngToLayerPoint(latlng), skipFirst);
  },

  // Check for intersection if new point was added to this polyline.
  // newPoint must be a layer point.
  // NOTE: does not support detecting intersection for degenerate cases.
  newPointIntersects: function (newPoint, skipFirst) {
    var points = this._originalPoints,
      len = points ? points.length : 0,
      lastPoint = points ? points[len - 1] : null,
      // The previous previous line segment. Previous line segement doesn't need testing.
      maxIndex = len - 2;

    if (this._tooFewPointsForIntersection(1)) {
      return false;
    }

    return this._lineSegmentsIntersectsRange(lastPoint, newPoint, maxIndex, skipFirst ? 1 : 0);
  },

  // Polylines with 2 sides can only intersect in cases where points are collinear (we don't support detecting these).
  // Cannot have intersection when < 3 line segments (< 4 points)
  _tooFewPointsForIntersection: function (extraPoints) {
    var points = this._originalPoints,
      len = points ? points.length : 0;
    // Increment length by extraPoints if present
    len += extraPoints || 0;

    return !this._originalPoints || len <= 3;
  },

  // Checks a line segment intersections with any line segements before its predecessor.
  // Don't need to check the predecessor as will never intersect.
  _lineSegmentsIntersectsRange: function (p, p1, maxIndex, minIndex) {
    var points = this._originalPoints,
      p2, p3;

    minIndex = minIndex || 0;

    // Check all previous line segments (beside the immediately previous) for intersections
    for (var j = maxIndex; j > minIndex; j--) {
      p2 = points[j - 1];
      p3 = points[j];

      if (L.LineUtil.segmentsIntersect(p, p1, p2, p3)) {
        return true;
      }
    }

    return false;
  }
});

L.Polygon.include({
  // Checks a polygon for any intersecting line segments. Ignores holes.
  intersects: function () {
    var polylineIntersects,
      points = this._originalPoints,
      len, firstPoint, lastPoint, maxIndex;

    if (this._tooFewPointsForIntersection()) {
      return false;
    }

    polylineIntersects = L.Polyline.prototype.intersects.call(this);

    // If already found an intersection don't need to check for any more.
    if (polylineIntersects) {
      return true;
    }

    len = points.length;
    firstPoint = points[0];
    lastPoint = points[len - 1];
    maxIndex = len - 2;

    // Check the line segment between last and first point. Don't need to check the first line segment (minIndex = 1)
    return this._lineSegmentsIntersectsRange(lastPoint, firstPoint, maxIndex, 1);
  }
});

}(this, document));

/* leaflet.draw.toolip.js */

L.Tooltip = L.Class.extend({
  initialize: function (map) {
    this._map = map;
    this._popupPane = map._panes.popupPane;

    this._container = L.DomUtil.create('div', 'leaflet-draw-tooltip', this._popupPane);
    this._singleLineLabel = false;
  },

  dispose: function () {
    this._popupPane.removeChild(this._container);
    this._container = null;
  },

  updateContent: function (labelText) {
    labelText.subtext = labelText.subtext || '';

    // update the vertical position (only if changed)
    if (labelText.subtext.length === 0 && !this._singleLineLabel) {
      L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
      this._singleLineLabel = true;
    }
    else if (labelText.subtext.length > 0 && this._singleLineLabel) {
      L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
      this._singleLineLabel = false;
    }

    this._container.innerHTML =
      (labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
      '<span>' + labelText.text + '</span>';

    return this;
  },

  updatePosition: function (latlng) {
    var pos = this._map.latLngToLayerPoint(latlng);

    L.DomUtil.setPosition(this._container, pos);

    return this;
  },

  showAsError: function () {
    L.DomUtil.addClass(this._container, 'leaflet-error-draw-tooltip');
    return this;
  },

  removeError: function () {
    L.DomUtil.removeClass(this._container, 'leaflet-error-draw-tooltip');
    return this;
  }
});