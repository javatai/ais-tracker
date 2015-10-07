'use strict';

var moment = require('moment');
var _ = require('underscore');
var AisMessage = require('../../lib/ais-message');

var json = require('ais-receiver/ais-messages/json/ais_msg_5.json');

var ShipdataHelper = function (shipdata) {
  this.shipdata = shipdata;
  this.aismessage = new AisMessage();
  this.aismessage.fromJSON(json.fields);
};

_.extend(ShipdataHelper.prototype, {
  fieldList: {
    MMSI: function (data) {
      return data.get('userid');
    },
    'IMO number': function (data) {
      return data.get('imonumber');
    },
    'AIS version': function (data) {
      return this.aismessage.lookup('aisversion', data.get('aisversion'));
    },
    'Callsign': function (data) {
      return data.get('callsign');
    },
    'Ship type': function (data) {
      return this.aismessage.lookup('shiptype', data.get('shiptype'));
    },
    Width: function (data) {
      if (data.has('dima') || data.has('dimb')) {
        return data.get('dima') + data.get('dimb') + ' m';
      }
      return;
    },
    Lenght: function (data) {
      if (data.has('dimc') || data.has('dimd')) {
        return data.get('dimc') + data.get('dimd') + ' m';
      }
      return;
    },
    Draught: function (data) {
      return data.has('draught') && data.get('draught') + ' m' || false;
    },
    'Position type': function (data) {
      return this.aismessage.lookup('positiontype', data.get('positiontype'));
    },
    Destination: function (data) {
      return data.get('destination');
    },
    ETA: function (data) {
      var M = data.get('etamonth');
      var d = data.get('etaday');
      var h = data.get('etahour');
      var m = data.get('etaminute');

      if (!M && !d && !h && !m) {
        return;
      }

      var timestamp = moment.utc(data.get('datetime'));

      if (M) timestamp.month(M);
      if (d) timestamp.date(d);
      if (h) timestamp.hour(h);
      if (m) timestamp.minute(m);

      return timestamp.format('YYYY-MM-DD HH:mm:ss UTC');
    },
    Datetime: function (data) {
      var timestamp = moment.utc(data.get('datetime'));
      return timestamp.format('YYYY-MM-DD HH:mm:ss UTC');
    }
  },

  format: function (field) {
    return this.fieldList[field](this.position);
  },

  toPropertyList: function () {
    var items = [];
    _.each(this.fieldList, function (formatter, name) {
      var value = formatter.call(this, this.shipdata);
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

module.exports = ShipdataHelper;
