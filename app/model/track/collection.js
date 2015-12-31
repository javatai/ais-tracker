'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');

var Socket = require('../../socket');

var TrackPosition = require('./model');

var Track = Backbone.Collection.extend({
  model: TrackPosition,

  comparator: function (a, b) {
    return new Date(a.get('datetime')) - new Date(b.get('datetime'));
  },

  initialize: function () {
    this.from = 0;
    this.listenTo(this, 'reset', this.stop);
  },

  start: function () {
    this.doUpdate = true;
  },

  stop: function () {
    this.doUpdate = false;
  },

  update: function (position) {
    if (!this.doUpdate) return;

    var p = position.toJSON();
    delete p.userid;

    this.add(p);

    this.trigger('update', this);
  },

  fetch: function () {
    var mmsi = this.ship.id;

    Socket.connect().done(function (io) {
      io.emit('track', mmsi);

      io.once('track:' + mmsi, function (positions) {
        this.add(positions);
        this.start();
      }.bind(this));

    }.bind(this));
  },

  setRange: function (value) {
    this.from = value;
    this.trigger('change:range', value, this);
  }
});

module.exports = Track;
