'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var PositionMarker = Backbone.Model.extend({
  source: null,
  layer: null,

  initialize: function (model, options) {
    this.mapgl = options.map;
  },

  toFeature: function () {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": this.get('position').getCoordinate()
      },
      "properties": {
        "title": this.get('position').toTitel(),
        "id": this.get('id')
      }
    }
  }
});

module.exports = PositionMarker;
