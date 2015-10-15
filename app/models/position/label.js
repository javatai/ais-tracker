'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Label = require('../../lib/label');

var PositionLabel = function (position) {
  this.model = position;

  Label.apply(this);
};

_.extend(PositionLabel.prototype, Label.prototype, {
  classname: 'position-label',

  getCoordinates: function () {
    return this.model.getCoordinate();
  },

  toTitle: function () {
    return this.model.getHelper().toTitle();
  }
});

module.exports = PositionLabel;
