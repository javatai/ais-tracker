'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Map = require('../map');
var GeographicLib = require('geographiclib');

var ShapeLayer = function (ships) {
  this.isInit = false;
  this.ships = ships;
  this.listenTo(this.ships, 'socket:sync', this.update);

  this.listenTo(Map, 'mouseover', this.onMouseover);
  this.listenTo(Map, 'mouseout', this.onMouseout);
};

_.extend(ShapeLayer.prototype, Backbone.Events, {
  onMouseover: function (userid) {
    Map.setFilter('shapes-hover', ['==', 'id', userid]);
  },

  onMouseout: function (userid) {
    Map.setFilter('shapes-hover', ['==', 'id', '']);
  },

  toFeature: function (ship) {
    var dim = ship.hasShape();
    if (dim) {
      var position = ship.get('position');

      var positionCoordinate = position.getCoordinate();

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
          "id": ship.get('userid')
        }
      }
    }
  },

  toFeatureCollection: function (ships) {
    var geojson = {
      "type": "FeatureCollection",
      "features": _.without(ships.map(function (ship) {
        return this.toFeature(ship);
      }, this), undefined)
    };

    return geojson;
  },

  update: function (ships) {
    Map.addToMap({
      name: 'shapes',
      data: this.toFeatureCollection(ships),
      layer: [{
        name: 'shapes',
        behind: 'markers',
        json: {
          "type": "fill",
          "interactive": true,
          "minzoom": 14,
          "paint": {
            "fill-color": "rgba(63,63,191,0.5)",
            "fill-outline-color": "rgba(0,0,0,0)"
          },
        }
      },{
        name: 'shapes-hover',
        behind: 'markers',
        json: {
          "type": "fill",
          "minzoom": 14,
          "paint": {
            "fill-color": "rgba(63,191,63,0.5)",
            "fill-outline-color": "rgba(0,0,0,0)"
          },
          "filter": ["==", "name", ""]
        }
      }]
    });
  }
});

module.exports = ShapeLayer;
