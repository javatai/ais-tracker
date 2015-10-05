'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/MapUtil');

var ShipMarker = require('./ship-marker');
var TrackLayer = require('./track-layer');
var ShipLabel = require('./ship-label');

var ShipsLayer = Backbone.Collection.extend({
  model: ShipMarker,
  source: null,
  layer: { },
  label: null,
  trackLayer: null,

  initialize: function (attributes, options) {
    this.mapgl = options.map;
    this.ships = options.ships;

    this.shipLabel = new ShipLabel(this.mapgl);

    this.trackLayer = new TrackLayer(null, {
      map: this.mapgl,
      shipsLayer: this
    });

    this.mapgl.on('style.load', _.bind(this.process, this));
  },

  process: function () {
    this.ships.on('add', this.addShipMarker, this);
    this.ships.on('sync', this.addToMap, this);
    this.ships.fetch();

    this.mapgl.on('mousemove', _.bind(this.onMousemove, this));
    this.mapgl.on('click', _.bind(this.onClick, this));
  },

  onClick: function (e) {
    this.mapgl.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, _.bind(function (err, features) {
      var selected = this.findWhere({ selected: true });
      if (selected) {
        selected.set('selected', false);
      }

      if (!_.isEmpty(features)) {
        var feature = _.first(features);
        this.mapgl.flyTo({ center: feature.geometry.coordinates, zoom: 15 });

        var id = feature.properties.id;
        this.get(id).set('selected', true);
      }
    }, this));
  },

  onMousemove: function (e) {
    this.mapgl.getCanvas().style.cursor = "";
    this.shipLabel.hideLabel();
    this.trackLayer.hideLabel();

    var bounds = this.mapgl.getBounds();
    var nw = bounds.getNorthWest();
    var ne = bounds.getNorthEast();

    var dist = Math.round(MapUtil.distance(nw.lat, nw.lng, ne.lat, ne.lng));
    var width = $('#map').width();

    var perimeter = 10 * (dist/width);

    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (ship) {
      this.mapgl.getCanvas().style.cursor = "pointer";
      this.shipLabel.setShip(ship);
      this.shipLabel.showLabel();
    } else {
      this.trackLayer.showLabel(e.lngLat, perimeter);
    }
  },

  addShipMarker: function (ship) {
    this.add(new ShipMarker({
      id: 'ship-' + ship.get('id'),
      selected: false,
      ship: ship
    }, {
      map: this.mapgl,
      collection: this
    }));
  },

  addSource: function (data) {
    if (!this.source) {
      this.source = this.mapgl.addSource("ships", {
        "type": "geojson"
      });
    }
    this.mapgl.getSource("ships").setData(data);
  },

  addLayer: function () {
    if (!_.isEmpty(this.layer)) {
      return;
    }

    this.layer.ships = this.mapgl.addLayer({
      "id": "ships",
      "type": "circle",
      "source": "ships",
      "interactive": true,
      "paint": {
        "circle-radius": 10,
        "circle-color": "rgba(255,255,255,0)",
      }
    });

    this.layer.labels = this.mapgl.addLayer({
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
  },

  addToMap: function () {
    var ships = this.filter(function (marker) {
      return marker.get('ship').has('position');
    });

    var data = this.map(function (marker) {
      var ship = marker.get('ship');
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": ship.get('position').getCoordinate()
        },
        "properties": {
          "title": ship.toTitel(),
          "id": marker.get('id')
        }
      }
    });

    this.addSource({
      "type": "FeatureCollection",
      "features": data
    });

    this.addLayer();
  },

  removeFromMap: function () {
    this.ships.off('sync', this.addToMap, this);
    this.ships.off('add', this.addShipMarker, this);
    this.mapgl.off('mousemove', _.bind(this.onMousemove, this));

    if (this.source) {
      this.mapgl.removeSource("ships");

      delete this.source;
    }

    if (!_.isEmpty(this.layer)) {
      this.mapgl.removeLayer("ships");
      this.mapgl.removeLayer("labels");

      delete this.layer.ships;
      delete this.layer.labels;
      this.layer = { };
    }
  }
})

module.exports = ShipsLayer;