'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Label = require('../../lib/label');

var ShipLabel = function (ship) {
  this.model = ship;

  Label.apply(this);
};

_.extend(ShipLabel.prototype, Label.prototype, {
  classname: 'ship-label',

  getCoordinates: function () {
    return this.model.get('position').getCoordinate();
  },

  onClick: function () {
    this.model.set('selected', true);
  },

  toTitle: function () {
    var titel = this.model.getHelper().toTitle();
    titel += '<hr noshade size="1">';
    titel += this.model.get('position').getHelper().toTitle();

    return titel;
  }
});

module.exports = ShipLabel;
