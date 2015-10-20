'use strict';

var config = require('../../config').server;

var Socket = require('../../lib/socket');

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

    if (typeof(cordova) !== 'undefined' || location.protocol === 'https:') {
      return 'https://' + config.hostname + ':' + config.https + '/api/track/' + this.ship.get('id');
    } else {
      return 'http://' + config.hostname + ':' + config.http + '/api/track/' + this.ship.get('id');
    }
  },

  fetch: function (ship) {
    this.ship = ship;
    this.listenToOnce(this, 'sync', this.startListening);

    return Positions.prototype.fetch.call(this);
  },

  startListening: function () {
    this.socket = null;
    Socket().done(_.bind(function (socket) {
      this.socket = socket;
      this.socket.on('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
    }, this));
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
    if (this.socket) {
      this.socket.removeListener('track:add:' + this.ship.get('userid'), this.onPositionAdded.bind(this));
      this.socket = null;
    }
  }
});

module.exports = Track;
