'use strict';

var MapUtil = require('../../lib/map-util');
var moment = require('moment');
var _ = require('underscore');
var AisMessage = require('../../lib/ais-message');

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

  toTitel: function () {
    var title = [
      'Lat: ' + this.format('Latitude'),
      'Lon: ' + this.format('Longitude'),
      'Course/speed: ' + this.getNav(),
      '',
      this.format('Timestamp')
    ];

    return title.join('<br>');
  },

  fieldList: {
    'Navigation status': function (data) {
      return this.aismessage.lookup('navigationstatus', data.get('navigationstatus'));
    },
    'Rate of turning': function (data) {
      return data.has('rot') && data.get('rot') + ' °/min' || false;
    },
    'Speed over ground': function (data) {
      return this.getSOG();
    },
    'Course over ground': function (data) {
      return this.getCOG();
    },
    'True Heading': function (data) {
      return data.has('trueheading') && data.get('trueheading') + '°' || false;
    },
    Longitude: function (data) {
      return MapUtil.decimalLatToDms(data.get('longitude'));
    },
    Latitude: function (data) {
      return MapUtil.decimalLatToDms(data.get('latitude'));
    },
    Timestamp: function (data) {
      if (data.get('timestamp') > 59) {
        return this.aismessage.lookup('timestamp', data.get('timestamp'));
      } else {
        var timestamp = moment.utc(data.get('datetime'));
        timestamp.seconds(data.get('timestamp'));
        return timestamp.format("YYYY-MM-DD HH:mm:ss UTC");
      }
    },
    'Position accuracy': function (data) {
      return this.aismessage.lookup('positionaccuracy', data.get('positionaccuracy'));
    }
  },

  format: function (field) {
    return this.fieldList[field](this.position);
  },

  toPropertyList: function () {
    var items = [];
    _.each(this.fieldList, function (formatter, name) {
      var value = formatter.call(this, this.position);
      if (value) {
        items.push({
          name: name,
          value: value
        });
      }
    }, this);
    return items;
  }
});

module.exports = PositionHelper;
