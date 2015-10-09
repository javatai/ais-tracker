'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var GeographicLib = require("geographiclib");

var ShipMarker = Backbone.Model.extend({
  layer: { },

  initialize: function (model, options) {
    this.mapgl = options.map;
    this.collection = options.collection;
    this.on('change:selected', this.addToMap, this);
    this.listenTo(this.get('ship'), 'change', this.process);
    this.process();
  },

  process: function () {
    if (this.get('ship').has('position')) {
      this.addToMap();
    }
  },

  toShape: function () {
    var ship = this.get('ship');
    var position = ship.get('position');

    if (ship.has('shipdata')) {
      var data = ship.get('shipdata');
      var a = data.get('dima') || 0;
      var b = data.get('dimb') || 0;
      var c = data.get('dimc') || 0;
      var d = data.get('dimd') || 0;

      if ((a || b) && (c || d)) {
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
          }
        }
      }
    }
    return null;
  },

  toFeature: function () {
    var ship = this.get('ship');
    var position = ship.get('position');

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": position.getCoordinate()
      },
      "properties": {
        "title": this.get('ship').getHelper().toTitel(),
        "marker-symbol": this.get('selected') && "triangle" || "triangle-stroked",
        "id": this.get('id')
      }
    }
  },

  getMapId: function (suffix) {
    return this.get('id') + (suffix ? '-' + suffix : '');
  },

  addSource: function () {
    if (!this.mapgl.getSource(this.getMapId(1))) {
      this.mapgl.addSource(this.getMapId(1), {
        "type": "geojson",
      });
    }

    this.mapgl.getSource(this.getMapId(1)).setData(this.toFeature());

    var shape = this.toShape();
    if (shape) {
      if (!this.mapgl.getSource(this.getMapId(2))) {
        this.mapgl.addSource(this.getMapId(2), {
          "type": "geojson",
        });
      }

      this.mapgl.getSource(this.getMapId(2)).setData(shape);
    }
  },

  addLayer: function () {
    var ship = this.get('ship');
    var position = ship.get('position');

    if (this.layer[this.getMapId(2)]) {
      this.mapgl.removeLayer(this.getMapId(2));
    }

    if (this.mapgl.getSource(this.getMapId(2))) {
      this.mapgl.addLayer({
        "id": this.getMapId(2),
        "type": "fill",
        "source": this.getMapId(2),
        "paint": {
          "fill-color": "rgba(63,63,191,0.5)",
          "fill-outline-color": "rgba(0,0,0,0)"
        }
      }, 'track');

      this.layer[this.getMapId(2)] = true;
    }

    if (this.layer[this.getMapId(1)]) {
      this.mapgl.removeLayer(this.getMapId(1));
    }

    this.mapgl.addLayer({
      "id": this.getMapId(1),
      "type": "symbol",
      "source": this.getMapId(1),
      "interactive": true,
      "layout": {
        "icon-image": "{marker-symbol}-11",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-rotate": position.has('cog') && position.get('cog') || 0,
        "visibility": "visible"
      }
    });

    this.layer[this.getMapId(1)] = true;
  },

  addToMap: function () {
    this.addSource();
    this.addLayer();
  },

  removeFromMap: function () {
    this.off('change:selected', this.addToMap, this);
    this.stopListening(this.get('ship'), 'change', this.process);

    if (this.layer[this.getMapId(1)]) {
      this.mapgl.removeSource(this.getMapId(1));
      this.mapgl.removeLayer(this.getMapId(1));
    }

    if (this.layer[this.getMapId(2)]) {
      this.mapgl.removeSource(this.getMapId(2));
      this.mapgl.removeLayer(this.getMapId(2));
    }

    this.layer = { };
  }
});

module.exports = ShipMarker;
