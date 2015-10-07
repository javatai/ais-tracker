'use strict';

var _ = require('underscore');
var MapUtil = require('../../lib/map-util');

var Positions = require('../position/collection');
var TrackHelper = require('./helper');

var Track = Positions.extend({
  id: null,

  url: function () {
    if (!this.id) {
      throw 'Track: No Id specified';
    }
    return '/api/track/' + this.id;
  },

  setId: function (id) {
    this.id = id;
  },

  getPositionsForLngLat: function (LngLat, min) {
    return this.filter(function (position) {
      return position.distanceTo(LngLat) < min;
    });
  },

  getHelper: function () {
    return new TrackHelper(this);
  }
});

module.exports = Track;
