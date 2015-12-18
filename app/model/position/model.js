'use strict';

var _ = require('underscore');
_.str = require('underscore.string');

var Backbone = require('backbone');
var moment = require('moment');
var GeographicLib = require('geographiclib');

var Position = Backbone.RelationalModel.extend({
  idAttribute: "userid",

  getCoordinate: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
  },

  distanceTo: function (LngLat) {
    var coords = this.getLngLat();
    var geod = GeographicLib.Geodesic.WGS84;
    return Math.round(geod.Inverse(LngLat.lat, LngLat.lng, coords.lat, coords.lng).s12);
  }
});

module.exports = Position;
