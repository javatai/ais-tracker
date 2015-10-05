'use strict';

var Label = require('./label');
var _ = require('underscore');

var PositionLabel = Label.extend({
  classname: 'position-label',

  setPosition: function (position) {
    this.position = position;
  },

  getCoordinates: function () {
    return this.position.getCoordinate();
  },

  toTitel: function () {
    return this.position.toTitel();
  }
});

module.exports = PositionLabel;
