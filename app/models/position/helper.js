'use strict';

var MapUtil = require('../../lib/helper/map-util');
var moment = require('moment');
var _ = require('underscore');
_.str = require('underscore.string');

var AisMessage = require('../../lib/helper/ais-message');

var json = require('ais-receiver/ais-messages/json/ais_msg_1.json');

var PositionHelper = function (position) {
  this.position = position;
  this.aismessage = new AisMessage();
  this.aismessage.fromJSON(json.fields);
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

  toTitle: function () {
    var title = [
      'Lat: ' + this.format('Latitude').value,
      'Lon: ' + this.format('Longitude').value,
      'Course/speed: ' + this.getNav(),
      '',
      this.format('Timestamp').value
    ];

    return title.join('<br>');
  },

  fieldList: {
    'Navigation status': function (data) {
      return {
        cls: 'navigationstatus',
        value: this.aismessage.lookup('navigationstatus', data.get('navigationstatus'))
      }
    },
    'Rate of turning': function (data) {
      if (!data.has('rot')) {
        return;
      }
      var rot = data.get('rot');
      if (rot > 126 || rot < -126) {
        return {
          cls: 'rot',
          value: this.aismessage.lookup('rot', rot)
        }
      }
      return {
        cls: 'rot',
        value: rot + '&deg;/min' || false
      }
    },
    'Speed over ground': function (data) {
      return {
        cls: 'sog',
        value: this.getSOG()
      }
    },
    'Course over ground': function (data) {
      return {
        cls: 'cog',
        value: this.getCOG()
      }
    },
    'True Heading': function (data) {
      return {
        cls: 'trueheading',
        value: data.has('trueheading') && data.get('trueheading') + '&deg;' || false
      }
    },
    Longitude: function (data) {
      return {
        cls: 'longitude',
        value: MapUtil.decimalLatToDms(data.get('longitude'))
      }
    },
    Latitude: function (data) {
      return {
        cls: 'latitude',
        value: MapUtil.decimalLatToDms(data.get('latitude'))
      }
    },
    Timestamp: function (data) {
      if (data.get('timestamp') > 59) {
        return {
          cls: 'timestamp',
          value: this.aismessage.lookup('timestamp', data.get('timestamp'))
        }
      } else {
        var timestamp = moment.utc(data.get('datetime'));
        timestamp.seconds(data.get('timestamp'));
        return {
          cls: 'timestamp',
          value: timestamp.format("YYYY-MM-DD HH:mm:ss UTC")
        }
      }
    },
    'Position accuracy': function (data) {
      return {
        cls: 'positionaccuracy',
        value: this.aismessage.lookup('positionaccuracy', data.get('positionaccuracy'))
      }
    },
    'Distance Moved': function (data) {
      return {
        cls: 'distancemoved',
        value: data.get('distancemoved') + 'm'
      }
    }
  },

  format: function (field) {
    return this.fieldList[field](this.position);
  },

  toPropertyList: function () {
    var items = [];
    _.each(this.fieldList, function (formatter, name) {
      var res = formatter.call(this, this.position);
      if (!res || !res.value) return;

      items.push({
        cls: res.cls,
        name: name,
        value: res.value
      });

    }, this);

    return items;
  }
});

module.exports = PositionHelper;
