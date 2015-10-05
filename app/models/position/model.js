'use strict';

var _ = require('underscore');
_.str = require("underscore.string");
var Backbone = require('backbone');
var moment = require('moment');
var MapUtil = require('../../lib/MapUtil');

var Popup = require('../../map/popup');

var Position = Backbone.RelationalModel.extend({
  url: '/api/position',

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

  getCOG: function () {
    if (this.has('cog')) {
      return _.str.sprintf('%03d&deg;', this.get('cog'));
    }
    return;
  },

  getSOG: function () {
    if (this.has('sog')) {
      return _.str.sprintf('%0.1f kts', this.get('sog'));
    }
    return;
  },

  toTitel: function () {
    var title = [
      'Lat: ' + MapUtil.decimalLatToDms(this.get('latitude')),
      'Lon: ' + MapUtil.decimalLngToDms(this.get('longitude')),
    ];

    var cog = this.getCOG();
    var sog = this.getSOG();

    if (cog && sog) {
      title.push('Course/speed: ' + cog + ' at ' + sog);
    } else if (cog) {
      title.push('Course: ' + cog);
      title.push('Speed: n/a');
    } else if (sog) {
      title.push('Course:  n/a');
      title.push('Speed: ' + sog);
    } else {
      title.push('Course/speed: n/a');
    }

    title.push('');
    title.push(this.get('timestamp'));

    return title.join('<br>');
  },

  distanceTo: function (LngLat) {
    var coords = this.getLngLat();
    return MapUtil.distance(LngLat.lat, LngLat.lng, coords.lat, coords.lng);
  }
});

module.exports = Position;
