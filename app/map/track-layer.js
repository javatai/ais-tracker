'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var MapUtil = require('../lib/map-util');
var MapGL = require('./map');

var TrackLayer = function (options) {
  this.ships = options.ships;
  this.app = options.app;
  this.mapgl = MapGL;

  this.layer = {};
  this.mouseoverid = 0;
  this.clickid = 0;
  this.track = null;
  this.ship = null;

  this.listenTo(this.ships, 'change:selected', this.process);
};

_.extend(TrackLayer.prototype, Backbone.Events, {
  execute: function (ship) {
    if (ship.get('selected') === true) {
      this.ship = ship;
      this.track = ship.get('track');

      this.listenToOnce(ship, 'onBeforeRemove', this.removeFromMap);

      this.listenToOnce(this.track, 'sync', this.addToMap);
      this.listenToOnce(this.track, 'sync', function () {
        this.listenTo(this.track, 'add', this.onAddPosition);
        this.listenTo(this.track, 'remove', this.onRemovePosition);
      }, this);

      ship.fetchTrack();
    }

    if (ship.get('selected') === false) {
      this.removeFromMap();
    }
  },

  process: function (ship) {
    _.delay(_.bind(this.execute, this), 1000, ship);
  },

  onMousemove: function (lngLat, perimeter) {
    if (this.track && this.track.length > 2) {
      var position = _.first(this.track.getPositionsForLngLat(lngLat, perimeter));

      if (this.mouseoverid) {
        if (!position || (position && position.get('id') !== this.mouseoverid)) {
          this.track.get(this.mouseoverid).set('mouseover', false);
          this.mouseoverid = 0;
        }
      }

      if (position) {
        this.mapgl.getCanvas().style.cursor = "pointer";
        position.set('mouseover', true);
        this.mouseoverid = position.get('id');
      }
    }
  },

  onMouseout: function () {
    if (this.mouseoverid) {
      this.track.get(this.mouseoverid).set('mouseover', false);
      this.mouseoverid = 0;
    }
  },

  onClick: function (e) {
    var dfd = $.Deferred();

    if (!this.track) {
      dfd.resolve();
    }

    this.mapgl.featuresAt(e.point, { layer: 'positions', radius: 10, includeGeometry: true }, _.bind(function (err, features) {
      var id = !_.isEmpty(features) ? Number(_.first(features).properties.id.substr(1)) : 0;

      if (this.clickid) {
        if (!id || (id !== this.clickid)) {
          this.track.get(this.clickid).set('selected', false);
          this.clickid = 0;
        }
      }

      if (id) {
        this.track.get(id).set('selected', true);
        this.clickid = id;

        dfd.resolve();
      } else {
        dfd.resolve();
      }
    }, this));

    return dfd;
  },

  onClickout: function () {
    if (this.clickid) {
      this.track.get(this.clickid).set('selected', false);
      this.clickid = 0;
    }
  },

  onAddPosition: function (position) {
    this.updateTrackSource();
    this.updatePositionSource();
  },

  onRemovePosition: function (position) {
    var id = position.get('id');

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }
    if (this.clickid === id) {
      this.clickid = 0;
    }

    this.updateTrackSource();
    this.updatePositionSource();
  },

  addToMap: function () {
    if (this.track.length > 2) {
      this.track.invoke('getLabel', this.mapgl);

      this.addTrackSource();
      this.addTrackLayer();

      this.addPositionSource();
      this.addPositionLayer();
    }
  },

  addTrackSource: function () {
    if (!this.mapgl.getSource('track')) {
      this.mapgl.addSource('track', {
        "type": "geojson",
      });
    }

    this.updateTrackSource();
  },

  updateTrackSource: function () {
    if (!this.mapgl.getSource('track')) return;

    var coordinates = this.track.map(function (position) {
      return position.getCoordinate();
    });
    coordinates.pop();
    coordinates.push(this.ship.get('position').getCoordinate());

    var track = {
      "type": "LineString",
      "coordinates": coordinates
    }

    this.mapgl.getSource('track').setData(track);
  },

  addPositionSource: function () {
    if (!this.mapgl.getSource('positions')) {
      this.mapgl.addSource('positions', {
        "type": "geojson",
      });
    }

    this.updatePositionSource();
  },

  updatePositionSource: function () {
    if (!this.mapgl.getSource('positions')) return;

    var features = this.track.map(function (position) {
      return position.getMarker().toMarker();
    });
    features.pop();
    features.push(this.ship.get('position').getMarker().toMarker());

    var positions = {
      "type": "FeatureCollection",
      "features": features
    }

    this.mapgl.getSource('positions').setData(positions);
  },

  addPositionLayer: function () {
    if (!this.layer['positions']) {
      this.mapgl.addLayer({
        "id": "positions",
        "type": "circle",
        "source": "positions",
        "interactive": true,
        "paint": {
          "circle-color": "#444",
        }
      }, this.ship.getMarker().getMapId('marker'));

      this.layer['positions'] = true;
    }
  },

  addTrackLayer: function () {
    if (!this.layer['track']) {
      this.mapgl.addLayer({
        "id": "track",
        "type": "line",
        "source": "track",
        "paint": {
          "line-color": "#888",
          "line-width": 3
        }
      }, this.ship.getMarker().getMapId('marker'));

      this.layer['track'] = true;
    }
  },

  removeFromMap: function () {
    this.stopListening(this.track, 'add', this.addToMap);
    this.stopListening(this.track, 'remove', this.addToMap);

    if (this.mapgl.getSource('track')) {
      this.mapgl.removeSource('track');
    }

    if (this.layer['track']) {
      this.mapgl.removeLayer('track');
    }

    if (this.mapgl.getSource('positions')) {
      this.mapgl.removeSource('positions');
    }

    if (this.layer['positions']) {
      this.mapgl.removeLayer('positions');
    }

    if (this.track) {
      this.track.reset();
    }

    this.layer = {};
    this.mouseoverid = 0;
    this.clickid = 0;
    this.track = null;
    this.ship = null;
  }
});

module.exports = TrackLayer;
