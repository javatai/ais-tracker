'use strict';

var socket = require('../../lib/socket');

var _ = require('underscore');
var MapUtil = require('../../lib/map-util');

var Position = require('../position/model');
var Positions = require('../position/collection');

var Track = Positions.extend({
  comparator: function (a, b) {
    return new Date(a.get('datetime')) - new Date(b.get('datetime'));
  },

  url: function () {
    if (!this.ship) {
      throw 'Track: No Id specified';
    }
    return '/api/track/' + this.ship.get('id');
  },

  fetch: function (ship) {
    this.ship = ship;
    this.listenToOnce(this, 'sync', this.startListening);

    return Positions.prototype.fetch.call(this);
  },

  startListening: function () {
    socket.on('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
  },

  getPositionsForLngLat: function (LngLat, min) {
    return this.filter(function (position) {
      return position.distanceTo(LngLat) < min;
    });
  },

  initialize: function () {
    this.ship = null;
  },

  onPositionAdded: function (message) {
    this.add(Position.findOrCreate(message.position));
  },

  reset: function () {
    if (this.ship) {
      socket.removeListener('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
    }
  }
});

module.exports = Track;
