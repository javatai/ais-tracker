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

  this.hasLayer = false;
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

      window.track = this.track;

      this.listenToOnce(ship, 'remove', this.removeFromMap);
      this.listenToOnce(this.track, 'sync', this.addToMap);
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

      if (!position || (position && position.get('id') !== this.mouseoverid)) {
        this.track.invoke('set', 'mouseover', false);
        this.mouseoverid = 0;
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

      if (!id || (id !== this.clickid)) {
        this.track.invoke('set', 'selected', false);
        this.clickid = 0;
      }

      if (id && this.track.get(id)) {
        this.track.get(id).set('selected', true);
        this.clickid = id;

        dfd.resolve();
      } else {
        dfd.resolve();
      }
    }, this));

    return dfd.promise();
  },

  onClickout: function () {
    if (this.clickid) {
      this.track.get(this.clickid).set('selected', false);
      this.clickid = 0;

      this.removeFromMap();
    }
  },

  onAddPosition: function (position) {
    position.getLabel();
    this.updateSource();
  },

  onRemovePosition: function (position) {
    var id = position.get('id');

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }
    if (this.clickid === id) {
      this.clickid = 0;
    }

    this.updateSource();
  },

  addToMap: function () {
    if (this.track.length > 2) {
      this.track.invoke('getLabel', this.mapgl);

      this.addSource();
      this.addLayer();
    }

    this.listenTo(this.ship, 'moved', this.onAddPosition);
    this.listenTo(this.track, 'add', this.onAddPosition);
    this.listenTo(this.track, 'remove', this.onRemovePosition);
    this.listenTo(this.track, 'setrange', this.updateSource);
  },

  addSource: function () {
    if (!this.mapgl.getSource('track')) {
      this.mapgl.addSource('track', {
        "type": "geojson"
      });
    }

    if (!this.mapgl.getSource('positions')) {
      this.mapgl.addSource('positions', {
        "type": "geojson",
      });
    }

    this.updateSource();
  },

  updateSource: function () {
    if (!this.mapgl.getSource('track') || !this.mapgl.getSource('positions')) return this.addSource();

    var range = _(this.track.slice(this.track.from, this.track.length-1)).map(function (position, index) {
      return {
        coordinate: position.getCoordinate(),
        marker: position.getMarker().toMarker()
      }
    });

    var coordinates = _.pluck(range, 'coordinate');
    coordinates.push(this.ship.get('position').getCoordinate());

    var track = {
      "type": "LineString",
      "coordinates": coordinates
    }

    this.mapgl.getSource('track').setData(track);

    var features = _.pluck(range, 'marker');
    features.push(this.ship.get('position').getMarker().toMarker());

    var positions = {
      "type": "FeatureCollection",
      "features": features
    }

    this.mapgl.getSource('positions').setData(positions);
  },

  addLayer: function () {
    if (this.hasLayer) {
      this.mapgl.removeLayer('positions');
      this.mapgl.removeLayer('track');
    }

    this.mapgl.addLayer({
      "id": "positions",
      "type": "circle",
      "source": "positions",
      "interactive": true,
      "paint": {
        "circle-color": "#444",
      }
    }, this.ship.getMarker().getMapId('shape'));

    this.mapgl.addLayer({
      "id": "track",
      "type": "line",
      "source": "track",
      "paint": {
        "line-color": "#888",
        "line-width": 2
      }
    }, this.ship.getMarker().getMapId('shape'));

    this.hasLayer = true;
  },

  removeFromMap: function () {
    this.stopListening(this.ship,  'moved', this.onAddPosition);
    this.stopListening(this.track, 'add', this.onAddPosition);
    this.stopListening(this.track, 'remove', this.onRemovePosition);
    this.stopListening(this.track, 'setrange', this.updateSource);

    if (this.hasLayer) {
      this.mapgl.removeLayer('positions');
      this.mapgl.removeLayer('track');
    }
    this.hasLayer = false;

    if (this.mapgl.getSource('track')) {
      this.mapgl.removeSource('track');
    }

    if (this.mapgl.getSource('positions')) {
      this.mapgl.removeSource('positions');
    }

    if (this.track) {
      this.track.invoke('set', 'mouseover', false);
      this.track.reset();
    }
    this.track = null;
    this.ship = null;

    this.mouseoverid = 0;
    this.clickid = 0;
  }
});

module.exports = TrackLayer;
