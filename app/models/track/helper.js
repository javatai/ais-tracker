'use strict';

var _ = require('underscore');

var TrackHelper = function (track) {
  this.track = track;
};

_.extend(TrackHelper.prototype, {
  toPropertyList: function () {
    var positions = this.track.map(function (position, index) {
      return {
        index: index + 1,
        latitude: position.getHelper().format('Latitude'),
        longitude: position.getHelper().format('Longitude'),
        nav: position.getHelper().getNav(),
        timestamp: position.getHelper().format('Timestamp')
      }
    });
    positions.reverse();
    return positions;
  }
});

module.exports = TrackHelper;
