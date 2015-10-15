'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var PositionMarker = function (position) {
  this.position = position;
};

_.extend(PositionMarker.prototype, Backbone.Events, {
  toMarker: function () {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": this.position.getCoordinate()
      },
      "properties": {
        "title": this.position.getHelper().toTitle(),
        "id": 'p' + this.position.get('id')
      }
    }
  }
});

module.exports = PositionMarker;
