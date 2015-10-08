'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');

var PositionMarker = require('./position-marker');
var PositionLabel = require('./position-label');

var TrackLayer = Backbone.Collection.extend({
  model: PositionMarker,
  layer: [],
  label: null,
  ship: null,
  ships: [],

  initialize: function (attributes, options) {
    this.mapgl = options.map;
    this.shipsLayer = options.shipsLayer;

    this.positionLabel = new PositionLabel(this.mapgl);

    this.listenTo(this.shipsLayer, 'change:selected', this.process);
  },

  process: function (marker, selected) {
    if (selected) {
      this.ship = marker.get('ship');

      this.listenToOnce(this.ship, 'sync', function () {
        if (_.indexOf(this.ships, marker) > -1) {
          this.ship.get('track').each(function (position) {
            this.addPositionMarker(position);
          }, this);
        } else {
          this.ships.push(this.ship);
        }

        this.listenTo(this.ship.get('track'), 'add', this.addPositionMarker);
        this.listenTo(this.ship.get('track'), 'sync', this.addToMap);

        this.ship.fetchTrack();
      });

      this.ship.fetch();
    } else {
      this.removeFromMap();
    }
  },

  addPositionMarker: function (position) {
    this.add(new PositionMarker({
      id: 'position-' + position.get('id'),
      position: position
    }, {
      map: this.mapgl,
      collection: this
    }));
  },

  addSource: function () {
    this.last().set('position', this.ship.get('position'));

    var track = {
      "type": "LineString",
      "coordinates": this.map(function (positionMarker) {
        return positionMarker.get('position').getCoordinate();
      })
    }

    var positions = {
      "type": "FeatureCollection",
      "features": this.map(function (positionMarker) {
        return positionMarker.toFeature();
      })
    }

    if (!this.mapgl.getSource('track')) {
      this.mapgl.addSource('track', {
        "type": "geojson",
      });
    }

    this.mapgl.getSource('track').setData(track);

    if (!this.mapgl.getSource('positions')) {
      this.mapgl.addSource('positions', {
        "type": "geojson",
      });
    }

    this.mapgl.getSource('positions').setData(positions);
  },

  addLayer: function () {
    if (!_.isEmpty(this.layer)) {
      return;
    }

    this.mapgl.addLayer({
      "id": "track",
      "type": "line",
      "source": "track",
      "paint": {
        "line-color": "#888",
        "line-width": 3
      }
    }, "ships");

    this.layer['track'] = true;

    this.mapgl.addLayer({
      "id": "positions",
      "type": "circle",
      "source": "positions",
      "interactive": true,
      "paint": {
        "circle-color": "#444",
      }
    }, "ships");

    this.layer['positions'] = true;
  },

  addToMap: function () {
    this.mapgl.flyTo({ center: this.ship.get('position').getCoordinate(), zoom: 15 });

    if (this.length < 2) {
      return;
    }

    this.addSource();
    this.addLayer();
  },

  removeFromMap: function () {
    if (this.ship) {
      this.stopListening(this.ship.get('track'), 'add', this.addPositionMarker);
      this.stopListening(this.ship.get('track'), 'sync', this.addToMap);

      this.ship.get('track').reset();
    }

    if (this.layer['track']) {
      this.mapgl.removeSource('track');
      this.mapgl.removeLayer('track');
    }

    if (this.layer['positions']) {
      this.mapgl.removeSource('positions');
      this.mapgl.removeLayer('positions');
    }

    this.layer = [];
    this.reset();
  },

  hideLabel: function () {
    this.positionLabel.hideLabel();
  },

  showLabel: function (lngLat, perimeter) {
    if (this.ship && this.ship.get('track').length > 0) {
      var position = _.first(this.ship.get('track').getPositionsForLngLat(lngLat, perimeter));

      if (position) {
        this.mapgl.getCanvas().style.cursor = "pointer";
        this.positionLabel.setPosition(position);
        this.positionLabel.showLabel();
      }
    }
  }
});

module.exports = TrackLayer;
