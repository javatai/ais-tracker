'use strict';

var config = require('../../config').server;

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');

var Platform = require('../../lib/platform');
var Socket = require('../../lib/socket');

var Position = require('../position/model');
var Positions = require('../position/collection');

var Track = Positions.extend({
  comparator: function (a, b) {
    return new Date(a.get('datetime')) - new Date(b.get('datetime'));
  },

  fetch: function (ship) {
    this.ship = ship;

    var dfd = Backbone.$.Deferred();

    this.socket = null;
    Socket.connect().done(function (socket) {
      this.socket = socket;
      this.socket.emit('track', this.ship.id);
      this.socket.once('track:' + this.ship.id, function (positions) {
        _.each(positions, function (position) {
          this.add(position);
        }, this);
        dfd.done();
        this.trigger('sync');
        this.listenTo(this.ship.get('position'), 'change', this.changed);
      }.bind(this));
    }.bind(this));

    return dfd;
  },

  changed: function (position) {
    var p = position.toJSON();
    delete p.userid;
    this.add(new Position(p));
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
    if (this.ship) {
      this.stopListening(this.ship.get('position'), 'change', this.changed);
    }
    Positions.prototype.reset.call(this);
  }
});

module.exports = Track;
