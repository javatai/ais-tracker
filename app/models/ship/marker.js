'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../../lib/map-util');
var GeographicLib = require("geographiclib");

var ShipMarker = function (ship, mapgl) {
  this.layer = {};

  this.ship = ship;
  this.mapgl = mapgl;

  this.listenTo(this.ship, 'change', this.process);
  this.process();
};

_.extend(ShipMarker.prototype, Backbone.Events, {
  calculateOffsetBounds: function (lnglat) {
    var geod = GeographicLib.Geodesic.WGS84;

    var N = geod.Direct(lnglat.lat, lnglat.lng, 0, 250);
    var E = geod.Direct(lnglat.lat, lnglat.lng, 90, 250);
    var S = geod.Direct(lnglat.lat, lnglat.lng, 180, 250);
    var W = geod.Direct(lnglat.lat, lnglat.lng, 270, 250);

    var wpx = $(this.mapgl.getContainer).width();
    var wm = geod.Inverse(N.lat2, E.lon2, S.lat2, W.lon2).s12;

    var m = 420 * wm / wpx;
    var P = geod.Direct(S.lat2, W.lon2, 270, m);

    var SW = new mapboxgl.LngLat(P.lon2, P.lat2);
    var NE = new mapboxgl.LngLat(E.lon2, N.lat2);

    return new mapboxgl.LngLatBounds(SW, NE);
  },

  moveIntoView: function () {
    var bounds = this.calculateOffsetBounds(this.ship.get('position').getLngLat());
    this.mapgl.fitBounds(bounds);
  },

  process: function () {
    if (this.ship.has('position')) {
      this.addToMap();

      if (this.ship.changed.selected && this.mapgl.getZoom() < 16) {
        _.delay(_.bind(this.moveIntoView, this), 1000);
      }
    }
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

  toShape: function () {
    var dim = this.hasShape();
    if (dim) {
      var ship = this.ship;
      var position = ship.get('position');

      var a = dim.a;
      var b = dim.b;
      var c = dim.c;
      var d = dim.d;

      var geod = GeographicLib.Geodesic.WGS84;
      var azi = position.get('trueheading') || position.get('cog');

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

      return {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [a1.lon2, a1.lat2],
            [c1.lon2, c1.lat2],
            [b1.lon2, b1.lat2],
            [b2.lon2, b2.lat2],
            [d1.lon2, d1.lat2],
            [a1.lon2, a1.lat2]
          ]]
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

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": position.getCoordinate()
      },
      "properties": {
        "title": ship.getHelper().toTitel(),
        "marker-symbol": ship.get('selected') && "triangle" || "triangle-stroked",
        "id": this.getMapId('marker')
      }
    }
  },

  getMapId: function (prefix) {
    return prefix + '-' + this.ship.get('id');
  },

  addShapeSource: function () {
    if (!this.mapgl.getSource(this.getMapId('shape'))) {
      this.mapgl.addSource(this.getMapId('shape'), {
        "type": "geojson",
      });
    }

    this.mapgl.getSource(this.getMapId('shape')).setData(this.toShape());
  },

  addShapeLayer: function () {
    if (!this.layer[this.getMapId('shape')]) {
      this.mapgl.addLayer({
        "id": this.getMapId('shape'),
        "type": "fill",
        "source": this.getMapId('shape'),
        "paint": {
          "fill-color": "rgba(63,63,191,0.5)",
          "fill-outline-color": "rgba(0,0,0,0)"
        }
      }, 'track');
      this.layer[this.getMapId('shape')] = true;
    }
  },

  addMarkerSource: function () {
    if (!this.mapgl.getSource(this.getMapId('marker'))) {
      this.mapgl.addSource(this.getMapId('marker'), {
        "type": "geojson",
      });
    }

    this.mapgl.getSource(this.getMapId('marker')).setData(this.toMarker());
  },

  addMarkerLayer: function () {
    if (!this.layer[this.getMapId('marker')]) {
      this.mapgl.addLayer({
        "id": this.getMapId('marker'),
        "type": "symbol",
        "source": this.getMapId('marker'),
        "interactive": true,
        "layout": {
          "icon-image": "{marker-symbol}-11",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "visibility": "visible"
        }
      });

      this.layer[this.getMapId('marker')] = true;
    }

    var position = this.ship.get('position');
    this.mapgl.setLayoutProperty(this.getMapId('marker'), "icon-rotate", position.has('cog') && position.get('cog') || 0);
  },

  addToMap: function () {
    if (this.hasShape()) {
      this.addShapeSource();
      this.addShapeLayer();
    }
    this.addMarkerSource();
    this.addMarkerLayer();
  },

  removeFromMap: function () {
    this.stopListening(this.ship, 'change', this.process);

    if (this.layer[this.getMapId('marker')]) {
      this.mapgl.removeLayer(this.getMapId('marker'));
    }

    if (this.mapgl.getSource(this.getMapId('marker'))) {
      this.mapgl.removeSource(this.getMapId('marker'));
    }

    if (this.layer[this.getMapId('shape')]) {
      this.mapgl.removeLayer(this.getMapId('shape'));
    }

    if (this.mapgl.getSource(this.getMapId('shape'))) {
      this.mapgl.removeSource(this.getMapId('shape'));
    }
  }
});

module.exports = ShipMarker;
