'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Label = require('../../lib/label');

var PositionLabel = function (position, mapgl) {
  this.model = position;
  this.mapgl = mapgl;

  Label.apply(this);
};

_.extend(PositionLabel.prototype, Label.prototype, {
  classname: 'position-label',

  getCoordinates: function () {
    return this.model.getCoordinate();
  },

  toTitel: function () {
    return this.model.getHelper().toTitel();
  }
});

module.exports = PositionLabel;
