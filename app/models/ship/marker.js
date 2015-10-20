'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Position = require('../position/model');
var MapUtil = require('../../lib/map-util');
var GeographicLib = require("geographiclib");
var mapboxgl = require('mapbox-gl');
var MapGL = require('../../map/map');

var ShipMarker = function (ship, mapgl) {
  this.haslayer = false;

  this.ship = ship;
  this.mapgl = MapGL;
  this.shapeCoordinates = [];
  this.positionCoordinate = [];

  this.listenTo(this.ship, 'moved', this.chkUpdate);
  this.listenTo(this.ship, 'change:mouseover', this.highlite);
  this.listenTo(this.ship, 'change:selected', this.onSelected);
  this.listenTo(this.ship, 'change:shipdata', this.chkShipdata);
  this.updateMap();
};

_.extend(ShipMarker.prototype, Backbone.Events, {
  chkUpdate: function () {
    var position = this.ship.has('position') && this.ship.get('position').getCoordinate() || [];
    if (!_.isEmpty(_.difference(this.positionCoordinate, position))) {
      this.updateMap();
    }
  },

  updateMap: function () {
    if (!this.mapgl._loaded) {
      this.mapgl.on('load', _.bind(this.updateShapeLayer, this));
    } else {
      this.updateShapeLayer();
    }
  },

  chkShipdata: function () {
    if (!this.mapgl.getSource(this.getMapId('shape')) && this.ship.has('shipdata')) {
      this.updateMap();
    }
  },

  center: function () {
    if (this.ship.has('position')) {
      var bounds = this.calculateOffsetBounds(this.ship.get('position').getLngLat());
      this.mapgl.fitBounds(bounds);
    }
  },

  onSelected: function (ship, selected) {
    if (selected) {
      this.center();
      this.listenTo(this.ship, 'moved', this.onPositionChange);
    } else {
      this.stopListening(this.ship, 'moved', this.onPositionChange);
    }
  },

  removeFromMap: function () {
    this.stopListening(this.ship, 'moved', this.chkUpdate);
    this.stopListening(this.ship, 'change:mouseover', this.highlite);
    this.stopListening(this.ship, 'change:shipdata', this.chkShipdata);
    this.stopListening(this.ship, 'change:selected', this.onSelected);

    if (this.hasLayer) {
      this.mapgl.removeLayer(this.getMapId('shape'));
      this.hasLayer = false;
    }

    if (this.mapgl.getSource(this.getMapId('shape'))) {
      this.mapgl.removeSource(this.getMapId('shape'));
    }
  },

  onPositionChange: function () {
    var lnglat = this.ship.get('position').getLngLat();
    var bounds = this.mapgl.getBounds();

    if (bounds.getNorth() < lnglat.lat) {
      // console.log('N', bounds.getNorth(), lnglat.lat, bounds.getNorth() < lnglat.lat);
      this.mapgl.flyTo({ center: this.ship.get('position').getCoordinate() });
    }

    if (bounds.getEast() < lnglat.lng) {
      // console.log('E', bounds.getEast(), lnglat.lng, bounds.getEast() < lnglat.lng);
      this.mapgl.flyTo({ center: this.ship.get('position').getCoordinate() });
    }

    if (bounds.getSouth() > lnglat.lat) {
      // console.log('S', bounds.getSouth(), lnglat.lat, bounds.getSouth() > lnglat.lat);
      this.mapgl.flyTo({ center: this.ship.get('position').getCoordinate() });
    }

    if (bounds.getWest() > lnglat.lng) {
      // console.log('W', bounds.getWest(), lnglat.lng, bounds.getWest() > lnglat.lng);
      this.mapgl.flyTo({ center: this.ship.get('position').getCoordinate() });
    }
  },

  calculateOffsetBounds: function (lnglat) {
    var geod = GeographicLib.Geodesic.WGS84;

    var padding = 500;

    var N = geod.Direct(lnglat.lat, lnglat.lng, 0, padding);
    var E = geod.Direct(lnglat.lat, lnglat.lng, 90, padding);
    var S = geod.Direct(lnglat.lat, lnglat.lng, 180, padding);
    var W = geod.Direct(lnglat.lat, lnglat.lng, 270, padding);

    var wpx = $(this.mapgl.getContainer).width();
    var wm = geod.Inverse(N.lat2, E.lon2, S.lat2, W.lon2).s12;

    var m = 420 * wm / wpx;
    var P = geod.Direct(S.lat2, W.lon2, 270, m);

    var SW = new mapboxgl.LngLat(P.lon2, P.lat2);
    var NE = new mapboxgl.LngLat(E.lon2, N.lat2);

    return new mapboxgl.LngLatBounds(SW, NE);
  },

  hasShape: function () {
    if (this.ship.has('shipdata')) {
      var data = this.ship.get('shipdata');
      var a = data.get('dima') || 0;
      var b = data.get('dimb') || 0;
      var c = data.get('dimc') || 0;
      var d = data.get('dimd') || 0;

      if ((a || b) && (c || d)) {
        return { a: a, b: b, c: c, d: d };
      }
    }
  },

  latLngInPolygon: function (latlng) {
    if (_.isEmpty(this.shapeCoordinates)) return;

    var polyX = [], polyY = [];
    _.each(this.shapeCoordinates, function (coord) {
      polyX.push(coord[0]);
      polyY.push(coord[1]);
    });

    var x = latlng.lng;
    var y = latlng.lat;

    var polyCorners = 6;
    var j=polyCorners-1;
    var oddNodes=false;

    for (var i=0; i<polyCorners; i++) {
      if (polyY[i]<y && polyY[j]>=y ||  polyY[j]<y && polyY[i]>=y) {
        if (polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x) {
          oddNodes =! oddNodes;
        }
      }
      j=i;
    }

    return oddNodes;
  },

  getMapId: function (prefix) {
    return prefix + '-' + this.ship.get('id');
  },

  toShape: function () {
    var dim = this.hasShape();
    if (dim) {
      var ship = this.ship;
      var position = ship.get('position');

      this.positionCoordinate = position.getCoordinate();

      var a = dim.a;
      var b = dim.b;
      var c = dim.c;
      var d = dim.d;

      var geod = GeographicLib.Geodesic.WGS84;
      var azi = position.has('trueheading') && position.get('trueheading') || position.get('cog');

      var w = c + d;
      var h = w/2;
      var l = Math.sqrt(2*Math.pow(h, 2));

      var lon0 = position.get('longitude');
      var lat0 = position.get('latitude');

      var m, lon1 = lon0, lat1 = lat0;
      if (d>c) {
        m = geod.Direct(lat0, lon0, azi+90, (d-c)/2);
        lon1 = m.lon2;
        lat1 = m.lat2;
      }
      if (c>d) {
        m = geod.Direct(lat0, lon0, azi-90, (c-d)/2);
        lon1 = m.lon2;
        lat1 = m.lat2;
      }

      c = d = h;
      var ax = a-h;

      var a1 = geod.Direct(lat1, lon1, azi, a);
      var c1 = geod.Direct(a1.lat2, a1.lon2, azi-135, l);
      var a2 = geod.Direct(c1.lat2, c1.lon2, azi-180, ax);

      var d1 = geod.Direct(a1.lat2, a1.lon2, azi+135, l);
      var a3 = geod.Direct(d1.lat2, d1.lon2, azi+180, ax);

      var b1 = geod.Direct(a2.lat2, a2.lon2, azi+180, b);
      var c2 = geod.Direct(b1.lat2, b1.lon2, azi+90, c);

      var b2 = geod.Direct(a3.lat2, a3.lon2, azi+180, b);

      this.shapeCoordinates = [
        [a1.lon2, a1.lat2],
        [c1.lon2, c1.lat2],
        [b1.lon2, b1.lat2],
        [b2.lon2, b2.lat2],
        [d1.lon2, d1.lat2],
        [a1.lon2, a1.lat2]
      ];

      return {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [ this.shapeCoordinates ]
        },
        "properties": {
          "id": this.getMapId('shape')
        }
      }
    }
  },

  toMarker: function () {
    var ship = this.ship;
    var position = ship.get('position');

    if (!position) return;

    var angle = position.has('trueheading') && position.get('trueheading')
      || position.has('cog') && position.get('cog')
      || 0;

    angle = Math.round(angle);

    var icon = ship.get('selected') && 'triangle-' + angle || 'triangle-' + angle + '-stroked';

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": position.getCoordinate()
      },
      "properties": {
        "title": ship.getHelper().toTitle(),
        "marker-symbol": icon,
        "id": this.getMapId('marker')
      }
    }
  },

  updateShapeLayer: function () {
    if (!this.ship.has('position') || !this.hasShape()) return;

    if (!this.mapgl.getSource(this.getMapId('shape'))) {
      this.mapgl.addSource(this.getMapId('shape'), {
        "type": "geojson",
        "data": this.toShape()
      });
    } else {
      this.mapgl.getSource(this.getMapId('shape')).setData(this.toShape());
    }

    if (this.hasLayer) return;
    this.hasLayer = true;

    var layer = {
      "id": this.getMapId('shape'),
      "type": "fill",
      "source": this.getMapId('shape'),
      "minzoom": 14,
      "paint": {
        "fill-color": "rgba(63,63,191,0.5)",
        "fill-outline-color": "rgba(0,0,0,0)"
      }
    }

    this.mapgl.addLayer(layer, 'markers');
  },

  highlite: function (ship, highlited) {
    if (!this.hasShape()) return;
    if (highlited) {
      this.mapgl.setPaintProperty(this.getMapId('shape'), 'fill-color', 'rgba(63,191,63,0.5)');
    } else {
      this.mapgl.setPaintProperty(this.getMapId('shape'), 'fill-color', 'rgba(63,63,191,0.5)');
    }
  }
});

module.exports = ShipMarker;
