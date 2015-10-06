'use strict';

var _ = require('underscore');
var MapUtil = require('../../lib/MapUtil');

var TrackHelper = function (track) {
  this.track = track;
};

_.extend(TrackHelper.prototype, {
  toPropertyList: function () {
    var positions = this.track.map(function (position, index) {
      return {
        index: index + 1,
        latitude: MapUtil.decimalLatToDms(position.get('latitude')),
        longitude: MapUtil.decimalLngToDms(position.get('longitude')),
        nav: position.getHelper().getNav(),
        datetime: position.get('timestamp')
      }
    });
    positions.reverse();
    return positions;
  }
});

module.exports = TrackHelper;
