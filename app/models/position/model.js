'use strict';

var _ = require('underscore');
_.str = require("underscore.string");
var Backbone = require('backbone');
var moment = require('moment');
var MapUtil = require('../../lib/MapUtil');

var Popup = require('../../map/popup');
var PositionHelper = require('./helper');

var Position = Backbone.RelationalModel.extend({
  url: '/api/position',

  getHelper: function () {
    return new PositionHelper(this);
  },

  parse: function (data, xhr) {
    data.raw = data.raw && JSON.parse(data.raw) || data.raw;
    return Backbone.RelationalModel.prototype.parse.call(this, data, xhr);
  },

  getCoordinate: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
  },

  getLngLat: function () {
    return {
      lng: this.get('longitude'),
      lat: this.get('latitude')
    }
  },

  get: function (name) {
    if (name === 'timestamp') {
      var timestamp = moment.utc(this.attributes.datetime);
      timestamp.seconds(this.attributes.timestamp);
      return timestamp.format("YYYY-MM-DD HH:mm:ss UTC");
    }
    return Backbone.RelationalModel.prototype.get.apply(this, arguments);
  },

  distanceTo: function (LngLat) {
    var coords = this.getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Position;
