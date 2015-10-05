'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Ship = require('./model');

var Ships = Backbone.Collection.extend({
  url: '/api/ships',
  model: Ship,

  getShipsForLngLat: function (LngLat, min) {
    return this.filter(function (ship) {
      if (ship.has('position')) {
        return ship.distanceTo(LngLat) < min;
      }
      return false;
    });
  }
});

module.exports = Ships;
