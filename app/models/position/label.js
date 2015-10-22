'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Label = require('../../map/label');

var PositionLabel = Label.extend({
  classname: 'position-label',

  getCoordinates: function () {
    return this.model.getCoordinate();
  },

  toTitle: function () {
    return this.model.getHelper().toTitle();
  }
});

module.exports = PositionLabel;
