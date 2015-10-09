'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');

var ShipMarker = require('./ship-marker');
var TrackLayer = require('./track-layer');
var ShipLabel = require('./ship-label');

var ShipsLayer = Backbone.Collection.extend({
  model: ShipMarker,
  layer: { },
  label: null,

  initialize: function (models, options) {
    this.mapgl = options.map;
    this.ships = options.collection;
    this.appevents = options.appevents;

    this.shipLabel = new ShipLabel(this.mapgl);

    this.trackLayer = new TrackLayer(null, {
      map: this.mapgl,
      shipsLayer: this
    });

    this.mapgl.on('style.load', _.bind(this.process, this));
  },

  process: function () {
    this.listenTo(this.ships, 'add', this.addShipMarker);
    this.listenTo(this.ships, 'sync', this.addToMap);

    this.ships.fetch();

    this.mapgl.on('mousemove', _.bind(this.onMousemove, this));
    this.mapgl.on('click', _.bind(this.onClick, this));

    this.listenTo(this.appevents, 'map:select', this.selectByShip);
  },

  selectByShip: function (ship) {
    this.selectById('ship-' + ship.get('id'));
  },

  selectById: function (id) {
    var selected = this.findWhere({ selected: true });
    if (selected) {
      selected.set('selected', false);
    }

    if (id) {
      selected = this.get(id);
      if (selected.get('ship').has('position')) {
        selected.set('selected', true);
      } else {
        alert('No position yet');
      }
    }
  },

  onClick: function (e) {
    this.mapgl.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, _.bind(function (err, features) {
      if (!_.isEmpty(features)) {
        var id = _.first(features).properties.id;
        this.appevents.trigger('map:selected', this.get(id).get('ship'));
        this.selectById(id);
      } else {
        this.appevents.trigger('map:unselected', true);
        this.selectById(false)
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

  addSource: function () {
    var ships = this.filter(function (marker) {
      return marker.get('ship').has('position');
    });

    var features = this.map(function (marker) {
      var ship = marker.get('ship');
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": ship.get('position').getCoordinate()
        },
        "properties": {
          "title": ship.getHelper().toTitel(),
          "id": marker.get('id')
        }
      }
    });

    if (!this.mapgl.getSource('ships')) {
      this.mapgl.addSource('ships', {
        "type": "geojson",
      });
    }

    this.mapgl.getSource('ships').setData({
      "type": "FeatureCollection",
      "features": features
    });
  },

  addLayer: function () {
    if (!_.isEmpty(this.layer)) {
      return;
    }

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
  },

  addToMap: function () {
    this.addSource();
    this.addLayer();
  },

  removeFromMap: function () {
    this.stopListening(this.ships, 'sync', this.addToMap);
    this.stopListening(this.ships, 'add', this.addShipMarker);

    this.mapgl.off('click', _.bind(this.onClick, this));
    this.mapgl.off('mousemove', _.bind(this.onMousemove, this));

    this.stopListening(this.appevents, 'map:select', selectByShip);

    if (this.layer['labels']) {
      this.mapgl.removeLayer('labels');
    }

    if (this.layer['ships']) {
      this.mapgl.removeSource('ships');
      this.mapgl.removeLayer('ships');
    }

    this.layer = { };
    this.reset();
  }
})

module.exports = ShipsLayer;
