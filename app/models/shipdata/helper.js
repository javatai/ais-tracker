'use strict';

var moment = require('moment');
var _ = require('underscore');
_.str = require('underscore.string');

var AisMessage = require('../../lib/helper/ais-message');

var json = require('ais-receiver/ais-messages/json/ais_msg_5.json');

var ShipdataHelper = function (shipdata) {
  this.shipdata = shipdata;
  this.aismessage = new AisMessage();
  this.aismessage.fromJSON(json.fields);
};

_.extend(ShipdataHelper.prototype, {
  fieldList: {
    MMSI: function (data) {
      return {
        cls: 'userid',
        value: data.get('userid')
      }
    },
    'IMO number': function (data) {
      return {
        cls: 'imonumber',
        value: data.get('imonumber')
      }
    },
    'Callsign': function (data) {
      return {
        cls: 'callsign',
        value: data.get('callsign')
      }
    },
    'Ship type': function (data) {
      return {
        cls: 'shiptype',
        value: this.aismessage.lookup('shiptype', data.get('shiptype'))
      }
    },
    Width: function (data) {
      if (data.has('dimc') || data.has('dimd')) {
        return {
          cls: 'dima dimc',
          value: data.get('dimc') + data.get('dimd') + ' m'
        }
      }
      return;
    },
    Lenght: function (data) {
      if (data.has('dima') || data.has('dimb')) {
        return {
          cls: 'dima dimb',
          value: data.get('dima') + data.get('dimb') + ' m'
        }
      }
      return;
    },
    Draught: function (data) {
      return {
        cls: 'draught',
        value: data.has('draught') && data.get('draught') + ' m' || false
      }
    },
    Destination: function (data) {
      return {
        cls: 'destination',
        value: data.get('destination')
      }
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

      return {
        cls: 'etamonth etaday etahour etaminute',
        value: timestamp.format('YYYY-MM-DD HH:mm:ss UTC')
      }
    },
    'AIS version': function (data) {
      return {
        cls: 'aisversion',
        value: this.aismessage.lookup('aisversion', data.get('aisversion'))
      }
    },
    'Position type': function (data) {
      return {
        cls: 'positiontype',
        value: this.aismessage.lookup('positiontype', data.get('positiontype'))
      }
    },
    Datetime: function (data) {
      var timestamp = moment.utc(data.get('datetime'));
      return {
        cls: 'datetime',
        value: timestamp.format('YYYY-MM-DD HH:mm:ss UTC')
      }
    }
  },

  format: function (field) {
    return this.fieldList[field](this.position);
  },

  toPropertyList: function () {
    var items = [];
    _.each(this.fieldList, function (formatter, name) {
      var res = formatter.call(this, this.shipdata);
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

module.exports = ShipdataHelper;
