'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Map = require('../map/map');

var TrackLayer = function (options) {
  this.ships = options.ships;
  this.app = options.app;

  this.mouseoverid = 0;
  this.track = null;
  this.ship = null;
};

_.extend(TrackLayer.prototype, Backbone.Events, {
  onMousemove: function (e) {
    var perimeter = Map.calculatePerimeter();

    if (this.track && this.track.length > 2) {
      var position = _.first(this.track.getPositionsForLngLat(e.lngLat, perimeter));

      if (!position || (position && position.id !== this.mouseoverid)) {
        this.track.invoke('set', 'mouseover', false);
        this.mouseoverid = 0;
      }

      if (position && this.ship.get('mouseover') !== true) {
        Map.setCursor("pointer");

        position.set('mouseover', true);
        this.mouseoverid = position.id;
      }
    }
  },

  onMouseout: function () {
    if (this.mouseoverid) {
      this.track.get(this.mouseoverid).set('mouseover', false);
      this.mouseoverid = 0;
    }
  },

  onAddPosition: function (position) {
    position.getLabel();
    this.updateLayer();
  },

  onRemovePosition: function (position) {
    var id = position.id;

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }

    this.updateLayer();
  },

  updateLayer: function () {
    var range = _(this.track.slice(this.track.from, this.track.length-1)).map(function (position, index) {
      return {
        coordinate: position.getCoordinate(),
        marker: position.getMarker().toMarker()
      }
    });

    var marker = this.ship.getMarker();
    var behind = marker.hasShape() && marker.getMapId('shape') || 'markers';

    var coordinates = _.pluck(range, 'coordinate');
    coordinates.push(this.ship.get('position').getCoordinate());

    Map.addToMap({
      name: 'track',
      data: {
        "type": "LineString",
        "coordinates": coordinates
      },
      layer: [{
        name: 'track',
        behind: behind,
        json: {
          "type": "line",
          "paint": {
            "line-color": "#888",
            "line-width": 2
          }
        }
      }]
    });

    var positions = _.pluck(range, 'marker');
    positions.push(this.ship.get('position').getMarker().toMarker());

    Map.addToMap({
      name: 'positions',
      data: {
        "type": "FeatureCollection",
        "features": positions
      },
      layer: [{
        name: 'positions',
        behind: behind,
        json: {
          "type": "circle",
          "interactive": true,
          "paint": {
            "circle-color": "#444",
          }
        }
      }]
    });
  },

  addToMap: function () {
    if (this.track.length > 2) {
      this.track.invoke('getLabel');
      this.updateLayer();
    }

    this.listenTo(this.ship,  'moved',     this.onAddPosition);
    this.listenTo(this.track, 'add',       this.onAddPosition);
    this.listenTo(this.track, 'remove',    this.onRemovePosition);
    this.listenTo(this.track, 'setrange',  this.updateLayer);
    this.listenTo(Map,        'mousemove', this.onMousemove);
  },

  removeFromMap: function () {
    this.stopListening(this.ship,  'moved',     this.onAddPosition);
    this.stopListening(this.track, 'add',       this.onAddPosition);
    this.stopListening(this.track, 'remove',    this.onRemovePosition);
    this.stopListening(this.track, 'setrange',  this.updateLayer);
    this.stopListening(this.track, 'sync',      this.addToMap);
    this.stopListening(Map,        'mousemove', this.onMousemove);

    Map.removeFromMap({
      name: 'track',
      layer: [ 'track' ]
    });

    Map.removeFromMap({
      name: 'positions',
      layer: [ 'positions' ]
    });

    if (this.track) {
      this.track.invoke('set', 'mouseover', false);
      this.track.reset();
    }

    this.track = null;
    this.ship = null;

    this.mouseoverid = 0;
  },

  execute: function (ship, selected) {
    if (selected) {
      this.ship = ship;
      this.track = ship.get('track');

      window.track = this.track;

      this.listenToOnce(ship,       'remove', this.removeFromMap);
      this.listenToOnce(this.track, 'sync',   this.addToMap);

      ship.fetchTrack();
    }
  },

  process: function (ship, selected) {
    if (!selected) {
      this.removeFromMap();
    } else {
      _.delay(_.bind(this.execute, this), 1000, ship, selected);
    }
  },

  start: function () {
    this.listenTo(this.ships, 'change:selected', this.process);
  },

  stop: function () {
    this.stopListening();
    this.removeFromMap();
  }
});

module.exports = TrackLayer;
