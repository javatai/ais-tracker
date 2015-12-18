'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Map = require('../map');
var GeographicLib = require('geographiclib');

var TrackLayer = function (ships) {
  this.isInit = false;
  this.ships = ships;

  this.selected = new Backbone.Collection();

  this.listenTo(Map, 'click', this.onClick);
  this.listenTo(Map, 'clickout', this.onClickout);

  this.listenTo(Map, 'mouseover', this.onMouseover);
  this.listenTo(Map, 'mouseout', this.onMouseout);

  this.listenTo(this.ships, 'reset', this.onClickout);

  this.listenTo(this.selected, 'add', this.onAdd);
  this.listenTo(this.selected, 'remove', this.onRemove);
};

_.extend(TrackLayer.prototype, Backbone.Events, {
  onMouseover: function (userid) {
    Map.setFilter('tracks-hover', ['==', 'id', userid]);
    Map.setFilter('positions-hover', ['==', 'id', userid]);
  },

  onMouseout: function (userid) {
    Map.setFilter('tracks-hover', ['==', 'id', '']);
    Map.setFilter('positions-hover', ['==', 'id', '']);
  },

  onClick: function (userid) {
    var ship = this.selected.findWhere({ userid: userid });
    if (ship) {
      this.selected.remove(ship);
    } else {
      ship = this.ships.findWhere({ userid: userid });
      this.selected.add(ship);
    }
  },

  onClickout: function (userid) {
    this.selected.each(function (model) {
      this.onRemove(model);
    }, this);

    this.selected.reset();
  },

  onAdd: function (ship) {
    this.listenTo(ship.get('track'), 'update', this.update);
    ship.get('track').fetch();
  },

  onRemove: function (ship) {
    this.stopListening(ship.get('track'), 'update');
    this.listenToOnce(ship.get('track'), 'reset', this.update);

    ship.get('track').reset();
  },

  toTrack: function (track) {
    var range = _(track.slice(track.from, track.length)).map(function (position, index) {
      return {
        coordinate: position.getCoordinate()
      }
    });

    return {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": _.pluck(range, 'coordinate')
      },
      "properties": {
        "id": track.ship.get('userid')
      }
    }
  },

  toTrackCollection: function () {
    var geojson = {
      "type": "FeatureCollection",
      "features": []
    };

    this.selected.each(function (ship) {
      if (ship.get('track').length > 0) {
        geojson.features.push(this.toTrack(ship.get('track')))
      }
    }, this);

    return geojson;
  },

  toPosition: function (track) {
    return _(track.slice(track.from, track.length)).map(function (position, index) {
      return {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": position.getCoordinate()
        },
        "properties": {
          "angle": Math.round(position.has('cog') && position.get('cog') || 0),
          "id": track.ship.get('userid')
        }
      }
    });
  },

  toPositionCollection: function () {
    var geojson = {
      "type": "FeatureCollection",
      "features": []
    };

    this.selected.each(function (ship) {
      if (ship.get('track').length > 0) {
        geojson.features = geojson.features.concat(this.toPosition(ship.get('track')));
      }
    }, this);

    return geojson;
  },

  update: function () {
    Map.addToMap({
      name: 'tracks',
      data: this.toTrackCollection(),
      layer: [{
        name: 'tracks',
        behind: 'shapes',
        json: {
          "type": "line",
          "interactive": true,
          "paint": {
            "line-color": "#999",
            "line-width": 2
          }
        }
      }, {
        name: 'tracks-hover',
        behind: 'shapes',
        json: {
          "type": "line",
          "paint": {
            "line-color": "#666",
            "line-width": 2
          },
          "filter": ["==", "name", ""]
        }
      }]
    });

    Map.addToMap({
      name: 'position',
      data: this.toPositionCollection(),
      layer: [{
        name: 'positions',
        behind: 'shapes',
        json: {
          "type": "circle",
          "interactive": true,
          "paint": {
            "circle-color": "#666",
          }
        }
      }, {
        name: 'positions-hover',
        behind: 'shapes',
        json: {
          "type": "circle",
          "paint": {
            "circle-color": "#222",
          },
          "filter": ["==", "name", ""]
        }
      }]
    });
  }
});

module.exports = TrackLayer;
