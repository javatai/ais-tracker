'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');
var MapGL = require('./map');
var TrackLayer = require('./track-layer');

var ShipsLayer = function (options) {
  this.hasLayer = false;

  this.ships = options.ships;
  this.app = options.app;
  this.mapgl = MapGL;

  this.perimeter = -1;
  this.mouseoverid = 0;
  this.clickid = 0;

  this.trackLayer = new TrackLayer(options);

  this.mapgl.on('zoom', _.bind(this.onZoom, this));

  this.mapgl.on('mousemove', _.bind(this.onMousemove, this));
  this.mapgl.on('click', _.bind(this.onClick, this));

  this.mapgl.on('load', _.bind(this.onReady, this));
};

_.extend(ShipsLayer.prototype, Backbone.Events, {
  calculatePerimeter: function () {
    if (this.perimeter > 0) {
      return this.perimeter;
    }

    var bounds = this.mapgl.getBounds();
    var nw = bounds.getNorthWest();
    var ne = bounds.getNorthEast();

    var dist = Math.round(MapUtil.distance(nw.lat, nw.lng, ne.lat, ne.lng));
    var width = $(this.mapgl.getContainer).width();

    this.perimeter = 10 * (dist/width);

    return this.perimeter;
  },

  onZoom: function () {
    this.perimeter = -1;
  },

  onClick: function (e) {
    var perimeter = this.calculatePerimeter();
    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (!ship || (ship && ship.get('id') !== this.clickid)) {
      this.ships.invoke('set', 'selected', false);
      this.clickid = 0;
    }

    if (ship) {
      ship.set('selected', true);
      this.clickid = ship.get('id');
    } else {
      this.app.trigger('clickout');
    }
  },

  onMousemove: function (e) {
    this.mapgl.getCanvas().style.cursor = "";

    var perimeter = this.calculatePerimeter();
    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (!ship || (ship && ship.get('id') !== this.mouseoverid)) {
      this.ships.invoke('set', 'mouseover', false);
      this.mouseoverid = 0;
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

  updateLayer: function () {
    var geojson = this.ships.toGeoJSON();

    if (!this.mapgl.getSource('markers')) {
      this.mapgl.addSource('markers', {
        "type": "geojson",
        "data": geojson
      });
    } else {
      this.mapgl.getSource('markers').setData(geojson);
    }

    if (this.hasLayer) return;
    this.hasLayer = true;

    var markers = {
      "id": "markers",
      "type": "symbol",
      "source": "markers",
      "interactive": true,
      "layout": {
        "symbol-spacing": 0,
        "symbol-placement": "point",
        "icon-image": "{marker-symbol}",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "visibility": "visible"
      }
    }

    this.mapgl.addLayer(markers);

    var labels = {
      "id": "labels",
      "type": "symbol",
      "source": "markers",
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
    }

    this.mapgl.addLayer(labels);
  },

  onReady: function () {
    this.updateLayer();

    this.listenTo(this.app,   'clickout', this.updateLayer);
    this.listenTo(this.ships, 'add', this.updateLayer);
    this.listenTo(this.ships, 'change:selected', this.updateLayer);
    this.listenTo(this.ships, 'moved', this.updateLayer);
    this.listenTo(this.ships, 'remove', this.onRemoveShip);
  },

  onRemoveShip: function (ship) {
    var id = ship.get('id');

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }
    if (this.clickid === id) {
      this.clickid = 0;
    }

    _.delay(_.bind(this.updateLayer, this), 1);
  },

  removeFromMap: function () {
    this.stopListening(this.app,   'clickout', this.updateLayer);
    this.stopListening(this.ships, 'add', this.updateLayer);
    this.stopListening(this.ships, 'change:selected', this.updateLayer);
    this.stopListening(this.ships, 'moved', this.updateLayer);
    this.stopListening(this.ships, 'remove', this.onRemoveShip);

    this.mapgl.off('zoom',      _.bind(this.onZoom, this));
    this.mapgl.off('click',     _.bind(this.onClick, this));
    this.mapgl.off('mousemove', _.bind(this.onMousemove, this));
  }
})

module.exports = ShipsLayer;
