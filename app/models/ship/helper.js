'use strict';

var _ = require('underscore');

var ShipHelper = function (ship) {
  this.ship = ship;
};

_.extend(ShipHelper.prototype, {
  toTitle: function () {
    return this.ship.has('shipdata') && this.ship.get('shipdata').get('name') || this.ship.get('userid');
  }
});

module.exports = ShipHelper;
