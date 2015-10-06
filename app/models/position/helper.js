'use strict';

var _ = require('underscore');
var MapUtil = require('../../lib/MapUtil');

var PositionHelper = function (position) {
  this.position = position;
};

_.extend(PositionHelper.prototype, {
  getCOG: function () {
    if (this.position.has('cog')) {
      return _.str.sprintf('%03d&deg;', this.position.get('cog'));
    }
    return;
  },

  getSOG: function () {
    if (this.position.has('sog')) {
      return _.str.sprintf('%0.1f kts', this.position.get('sog'));
    }
    return;
  },

  getNav: function () {
    var cog = this.getCOG();
    var sog = this.getSOG();

    if (cog && sog) {
      return cog + ' at ' + sog;
    } else if (cog) {
      return cog + ' at n/a';
    } else if (sog) {
      return 'n/a at ' + sog;
    } else {
      return 'n/a';
    }
  },

  toTitel: function () {
    var title = [
      'Lat: ' + MapUtil.decimalLatToDms(this.position.get('latitude')),
      'Lon: ' + MapUtil.decimalLngToDms(this.position.get('longitude')),
      'Course/speed: ' + this.getNav(),
      '',
      this.position.get('timestamp')
    ];

    return title.join('<br>');
  },

  toPropertyList: function () {
    var items = [];
    _.each(this.position.toJSON(), function (value, name) {
      if (('id,raw,track').indexOf(name) < 0) {
        items.push({
          name: name,
          value: value
        });
      }
    });
    return items;
  }
});

module.exports = PositionHelper;
