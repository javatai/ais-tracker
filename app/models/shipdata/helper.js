'use strict';

var _ = require('underscore');

var ShipdataHelper = function (shipdata) {
  this.shipdata = shipdata;
};

_.extend(ShipdataHelper.prototype, {
  toPropertyList: function () {
    var items = [];
    _.each(this.shipdata.toJSON(), function (value, name) {
      if (('id,raw').indexOf(name) < 0) {
        items.push({
          name: name,
          value: value
        });
      }
    });
    return items;
  }
});

module.exports = ShipdataHelper;
