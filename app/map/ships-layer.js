'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');
var MapGL = require('./map');
var TrackLayer = require('./track-layer');

var ShipsLayer = function (ships) {
  this.ships = ships;
  this.mapgl = MapGL;

  this.trackLayer = new TrackLayer(this.ships);

  this.mapgl.on('style.load', _.bind(this.process, this));
};

_.extend(ShipsLayer.prototype, Backbone.Events, {
  layer: { },

  process: function () {
    this.listenTo(this.ships, 'add', this.onAddShip);
    this.listenTo(this.ships, 'remove', this.onRemoveShip);
    this.listenTo(this.ships, 'sync', this.addToMap);

    this.ships.fetch();

    this.mapgl.on('mousemove', _.bind(this.onMousemove, this));
    this.mapgl.on('click', _.bind(this.onClick, this));
  },

  clickid: 0,
  onClick: function (e) {
    this.mapgl.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, _.bind(function (err, features) {
      var id = !_.isEmpty(features) ? _.first(features).properties.id : 0;

      if (this.clickid) {
        if (!id || (id !== this.clickid)) {
          this.ships.get(this.clickid).set('selected', false);
          this.clickid = 0;
        }
      }

      if (id) {
        this.ships.get(id).set('selected', true);
        this.clickid = id;
        this.trackLayer.onClickout();
      } else {
        this.trackLayer.onClick(e);
      }
    }, this));
  },

  mouseoverid: 0,
  onMousemove: function (e) {
    this.mapgl.getCanvas().style.cursor = "";

    var bounds = this.mapgl.getBounds();
    var nw = bounds.getNorthWest();
    var ne = bounds.getNorthEast();

    var dist = Math.round(MapUtil.distance(nw.lat, nw.lng, ne.lat, ne.lng));
    var width = $('#map').width();

    var perimeter = 10 * (dist/width);
    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (this.mouseoverid) {
      if (!ship || (ship && ship.get('id') !== this.mouseoverid)) {
        this.ships.get(this.mouseoverid).set('mouseover', false);
        this.mouseoverid = 0;
      }
    }

    if (ship) {
      this.mapgl.getCanvas().style.cursor = "pointer";
      ship.set('mouseover', true);
      this.mouseoverid = ship.get('id');
      this.trackLayer.onMouseout();
    } else {
      this.trackLayer.onMousemove(e.lngLat, perimeter);
    }
  },

  onAddShip: function (ship) {
    ship.getLabel(this.mapgl);
    ship.getMarker(this.mapgl);

    this.updateSource();
  },

  onRemoveShip: function (ship) {
    var id = ship.get('id');

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }
    if (this.clickid === id) {
      this.clickid = 0;
    }

    this.updateSource();
  },

  addSource: function () {
    if (!this.mapgl.getSource('ships')) {
      this.mapgl.addSource('ships', {
        "type": "geojson",
      });
    }

    this.updateSource();
  },

  updateSource: function () {
    if (!this.mapgl.getSource('ships')) return;

    var features = this.ships.map(function (ship) {
      if (!ship.has('position')) return;

      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": ship.get('position').getCoordinate()
        },
        "properties": {
          "title": ship.getHelper().toTitel(),
          "id": ship.get('id')
        }
      }
    });

    this.mapgl.getSource('ships').setData({
      "type": "FeatureCollection",
      "features": _.filter(features, function(feature) { return feature; })
    });
  },

  addShipsLayer: function () {
    if (!this.layer['ships']) {
      this.mapgl.addLayer({
        "id": "ships",
        "type": "circle",
        "source": "ships",
        "interactive": true,
        "paint": {
          "circle-radius": 10,
          "circle-color": "rgba(255,255,255,0)",
        }
      });

      this.layer['ships'] = true;
    }
  },

  addLabelsLayer: function () {
    if (!this.layer['labels']) {
      this.mapgl.addLayer({
        "id": "labels",
        "type": "symbol",
        "source": "ships",
        "layout": {
          "text-field": "{title}",
          "text-font": [
            "DIN Offc Pro Medium",
            "Arial Unicode MS Regular"
          ],
          "text-offset": [0, 1.5],
          "text-anchor": "center",
          "text-size": {
            "base": 1,
            "stops": [
              [ 13, 12 ],
              [ 18, 16 ]
            ],
          },
          "text-allow-overlap": true,
          "visibility": "visible"
        },
        "maxzoom": 22,
        "minzoom": 14,
        "paint": {
          "text-color": "#000000",
          "text-halo-blur": 0.5,
          "text-halo-color": "#ffffff",
          "text-halo-width": 0.5
        }
      });

      this.layer['labels'] = true;
    }
  },

  addToMap: function () {
    this.addSource();
    this.addShipsLayer();
    this.addLabelsLayer();
  },

  removeFromMap: function () {
    this.stopListening(this.ships, 'sync', this.addToMap);
    this.stopListening(this.ships, 'add', this.addShipMarker);
    this.stopListening(this.ships, 'remove', this.removeShipMarker);

    this.mapgl.off('click', _.bind(this.onClick, this));
    this.mapgl.off('mousemove', _.bind(this.onMousemove, this));

    if (this.layer['labels']) {
      this.mapgl.removeLayer('labels');
    }

    if (this.layer['ships']) {
      this.mapgl.removeLayer('ships');
    }

    if (this.mapgl.getSource('ships')) {
      this.mapgl.removeSource('ships');
    }

    this.layer = { };
    this.mouseoverid = 0;
    this.clickid = 0;
    this.first = null;
  }
})

module.exports = ShipsLayer;
