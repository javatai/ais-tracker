'use strict';

var _ = require('underscore');

var Backbone = require('backbone');
var GeographicLib = require('geographiclib');

var TrackPosition = Backbone.RelationalModel.extend({
  getCoordinate: function () {
    return [
      this.get('longitude'),
      this.get('latitude')
    ]
  }
});

module.exports = TrackPosition;
