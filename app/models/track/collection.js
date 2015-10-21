'use strict';

var config = require('../../config').server;

var _ = require('underscore');

var Platform = require('../../lib/platform');
var Socket = require('../../lib/socket');

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

    return Platform.setPrefix('/api/track/' + this.ship.get('id'));
  },

  fetch: function (ship) {
    this.ship = ship;
    return Positions.prototype.fetch.call(this);
  },

  startListening: function () {
    this.socket = null;
    Socket.connect().done(_.bind(function (socket) {
      this.socket = socket;
      this.socket.on('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
    }, this));
  },

  stopListening: function () {
    if (this.socket) {
      this.socket.removeListener('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
      this.socket = null;
    }
  },

  getPositionsForLngLat: function (LngLat, min) {
    return this.filter(function (position) {
      return position.distanceTo(LngLat) < min;
    });
  },

  initialize: function () {
    this.ship = null;
    this.from = 0;
  },

  setRange: function (value) {
    this.from = value;
    this.trigger('setrange', this, value);
  },

  onPositionAdded: function (message) {
    this.add(Position.findOrCreate(message.position));
  },

  reset: function () {
    this.stopListening();
    Positions.prototype.reset.call(this);
  }
});

module.exports = Track;
