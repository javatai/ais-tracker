'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var Platform = require("../../lib/platform");

var Position = require('../position/model');
var Map = require('../../map/map');

var ShipMarker = function (ship) {
  this.ship = ship;

  this.shapeCoordinates = [];
  this.positionCoordinate = [];
  this.dimension = {};

  this.listenTo(this.ship, 'moved',            this.chkUpdate);
  this.listenTo(this.ship, 'change:shipdata',  this.chkUpdate);

  this.listenTo(this.ship, 'change:mouseover', this.highlite);
  this.listenTo(this.ship, 'change:selected',  this.onSelected);

  this.addToMap();
};

_.extend(ShipMarker.prototype, Backbone.Events, {
  chkUpdate: function () {
    var position = this.ship.has('position') && this.ship.get('position').getCoordinate() || [];

    if (_.isEmpty(this.dimension) || !_.isEmpty(_.difference(this.positionCoordinate, position))) {
      this.addToMap();
    }
  },

  center: function () {
    if (this.ship.has('position')) {
      Map.center(this.ship.get('position').getLngLat());
    }
  },

  onPositionChange: function () {
    Map.moveIntoView(this.ship.get('position'));
  },

  onSelected: function (ship, selected) {
    if (selected) {
      this.center();
      this.listenTo(this.ship, 'moved', this.onPositionChange);
    } else {
      this.stopListening(this.ship, 'moved', this.onPositionChange);
    }
  },

  hasShape: function () {
    if (!_.isEmpty(this.dimension)) {
      return this.dimension;
    }

    if (this.ship.has('shipdata')) {
      var data = this.ship.get('shipdata');
      var a = data.get('dima') || 0;
      var b = data.get('dimb') || 0;
      var c = data.get('dimc') || 0;
      var d = data.get('dimd') || 0;

      if ((a || b) && (c || d)) {
        this.dimension = { a: a, b: b, c: c, d: d };
        return this.dimension;
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
        "angle": angle,
        "selected": ship.get('selected'),
        "id": this.getMapId('marker'),
      }
    }
  },

  onLoad: function () {
    Map.addToMap({
      name: this.getMapId('shape'),
      data: this.toShape(),
      layer: [{
        name: this.getMapId('shape'),
        behind: 'markers',
        json: {
          "type": "fill",
          "minzoom": 14,
          "paint": {
            "fill-color": "rgba(63,63,191,0.5)",
            "fill-outline-color": "rgba(0,0,0,0)"
          }
        }
      }]
    });
  },

  addToMap: function () {
    if (!this.ship.has('position') || !this.hasShape()) return;

    Map.onReady().done(_.bind(function () {
      this.onLoad();
    }, this));
  },

  removeFromMap: function () {
    this.stopListening(this.ship, 'moved',            this.chkUpdate);
    this.stopListening(this.ship, 'change:shipdata',  this.chkUpdate);

    this.stopListening(this.ship, 'change:mouseover', this.highlite);
    this.stopListening(this.ship, 'change:selected',  this.onSelected);

    this.stopListening(this.ship, 'moved',            this.onPositionChange);

    if (!this.ship.get('id')) return;

    Map.removeFromMap({
      name: this.getMapId('shape'),
      layer: [ this.getMapId('shape') ]
    });
  },

  highlite: function (ship, highlited) {
    if (!this.hasShape() || Platform.isTouchDevice) return;
    if (highlited) {
      Map.setPaintProperty(this.getMapId('shape'), 'fill-color', 'rgba(63,191,63,0.5)');
    } else {
      Map.setPaintProperty(this.getMapId('shape'), 'fill-color', 'rgba(63,63,191,0.5)');
    }
  }
});

module.exports = ShipMarker;
