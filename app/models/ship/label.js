'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Label = require('../../lib/label');

var ShipLabel = function (ship, mapgl) {
  this.model = ship;
  this.mapgl = mapgl;

  Label.apply(this);
};

_.extend(ShipLabel.prototype, Label.prototype, {
  classname: 'ship-label',

  getCoordinates: function () {
    return this.model.get('position').getCoordinate();
  },

  toTitel: function () {
    var titel = this.model.getHelper().toTitel();
    titel += '<hr noshade size="1">';
    titel += this.model.get('position').getHelper().toTitel();

    return titel;
  }
});

module.exports = ShipLabel;
