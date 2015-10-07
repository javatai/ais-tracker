'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');

var PositionMarker = require('./position-marker');
var PositionLabel = require('./position-label');

var TrackLayer = Backbone.Collection.extend({
  model: PositionMarker,
  source: { },
  layer: { },
  label: null,
  ship: null,
  ships: [],

  initialize: function (attributes, options) {
    this.mapgl = options.map;
    this.shipsLayer = options.shipsLayer;

    this.positionLabel = new PositionLabel(this.mapgl);

    this.shipsLayer.on('change:selected', this.process, this);
  },

  process: function (marker, selected) {
    if (selected) {
      this.ship = marker.get('ship');

      if (_.indexOf(this.ships, marker) > -1) {
        this.ship.get('track').each(function (position) {
        this.addPositionMarker(position);
        }, this);
      } else {
        this.ships.push(this.ship);
      }

      this.ship.get('track').on('add', this.addPositionMarker, this);
      this.ship.get('track').on('sync', this.addToMap, this);
      this.ship.fetchTrack();
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

  addSource: function (track, positions) {
    if (_.isEmpty(this.source)) {
      this.source.track = this.mapgl.addSource("track", {
        "type": "geojson"
      });

      this.source.position = this.mapgl.addSource("positions", {
        "type": "geojson"
      });
    }

    this.mapgl.getSource("track").setData(track);
    this.mapgl.getSource("positions").setData(positions);
  },

  addLayer: function () {
    if (!_.isEmpty(this.layer)) {
      return;
    }

    this.layer.track = this.mapgl.addLayer({
      "id": "track",
      "type": "line",
      "source": "track",
      "paint": {
        "line-color": "#888",
        "line-width": 3
      }
    }, "ships");

    this.layer.positions = this.mapgl.addLayer({
      "id": "positions",
      "type": "circle",
      "source": "positions",
      "interactive": true,
      "paint": {
        "circle-color": "#444",
      }
    }, "ships");
  },

  addToMap: function () {
    if (this.length < 2) {
      return;
    }

    var data = [];
    this.each(function (positionMarker, index) {
      if (index < this.length-1) {
        var feature = positionMarker.toFeature();
        data.push(feature);
      }
    }, this);

    var positions = {
      "type": "FeatureCollection",
      "features": data
    }

    var track = {
      "type": "LineString",
      "coordinates": this.map(function (positionMarker) {
        return positionMarker.get('position').getCoordinate();
      })
    }

    this.addSource(track, positions);
    this.addLayer();
  },

  removeFromMap: function () {
    if (this.ship) {
      this.ship.get('track').off('add', this.addPositionMarker, this);
      this.ship.get('track').off('sync', this.addToMap, this);
      this.ship.get('track').reset();
    }

    if (!_.isEmpty(this.layer)) {
      this.mapgl.removeLayer("track");
      this.mapgl.removeLayer("positions");

      delete this.layer.track;
      delete this.layer.positions;
      this.layer = { };
    }

    if (!_.isEmpty(this.source)) {
      this.mapgl.removeSource("track");
      this.mapgl.removeSource("positions");

      delete this.source.track;
      delete this.source.positions;
      this.source = { };
    }

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
