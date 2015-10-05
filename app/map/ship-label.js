'use strict';

var _ = require('underscore');
var Label = require('./label');

var ShipLabel = Label.extend({
  classname: 'ship-label',

  setShip: function (ship) {
    this.ship = ship;
  },

  getCoordinates: function () {
    return this.ship.get('position').getCoordinate();
  },

  toTitel: function () {
    var title = this.ship.toTitel();
    title += '<hr noshade size="1">';
    title += this.ship.get('position').toTitel();

    return title;
  }
});

module.exports = ShipLabel;