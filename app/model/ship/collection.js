'use strict';

var config = require('../../config').frontend;

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');

var Platform = require('../../platform');
var Socket = require('../../socket');

var Ship = require('./model');
var ShipDatum = require('../shipdata/model');
var Position = require('../position/model');

var Ships = Backbone.Collection.extend({
  model: Ship,

  currentSort: { strategy: "name", direction: "asc" },
  selectedStrategy: null,

  comparator: function (a, b) {
    return this.selectedStrategy.apply(this, arguments);
  },

  strategies: {
    asc: {
      name: function(a, b) {
        if (a.has('shipdata') && !b.has('shipdata')) return -1;
        if (!a.has('shipdata') && b.has('shipdata')) return 1;

        if (!a.has('shipdata') && !b.has('shipdata')) {
          return a.get('userid') - b.get('userid');
        }

        if (a.get('shipdata').get('name') < b.get('shipdata').get('name')) return -1;
        if (a.get('shipdata').get('name') > b.get('shipdata').get('name')) return 1;

        return 0;
      },
      userid: function(a, b) {
        return a.get('userid') - b.get('userid');
      },
      datetime: function(a, b) {
        return new Date(a.get('datetime')) - new Date(b.get('datetime'));
      }
    },
    desc: {
      name: function(a, b) {
        if (a.has('shipdata') && !b.has('shipdata')) return 1;
        if (!a.has('shipdata') && b.has('shipdata')) return -1;

        if (!a.has('shipdata') && !b.has('shipdata')) {
          return b.get('userid') - a.get('userid');
        }

        if (a.get('shipdata').get('name') < b.get('shipdata').get('name')) return 1;
        if (a.get('shipdata').get('name') > b.get('shipdata').get('name')) return -1;

        return 0;
      },
      userid: function(a, b) {
        return b.get('userid') - a.get('userid');
      },
      datetime: function(a, b) {
        return new Date(b.get('datetime')) - new Date(a.get('datetime'));
      }
    }
  },

  initialize: function () {
    this.initSort(this.currentSort.strategy, this.currentSort.direction);
    Socket.on('disconnected', this.teardown.bind(this));
  },

  run: function () {
    Socket.connect().done(function (io) {
      io.on('init', this.onInit.bind(this));
    }.bind(this));
  },

  teardown: function (io) {
    io.removeAllListeners('update');
    this.reset();

    this.trigger('socket:sync', this);
  },

  onInit: function (payload) {
    this.once('update', function () {
      this.trigger('socket:sync', this);
    }, this);

    this.trigger('socket:init', this);
    this.add(payload);

    Socket.connect().done(function (io) {
      io.on('update', this.onUpdate.bind(this));
    }.bind(this));
  },

  doUpdate: function (item) {
    var userid = item.data.userid;

    var ship = Ship.findOrCreate({ userid: userid });

    var log = 'update';
    if (!ship.has('position')) {
      log = 'add'
    }

    if (item.model === 'position') {
      var position = Position.findOrCreate({ userid: userid });
      position.set(item.data);

      ship.set('position', position);
      ship.get('track').update(position);

      this.trigger('change:ship:position', ship, position.changed, this);
    }

    if (item.model === 'shipdata') {
      var shipdatum = ShipDatum.findOrCreate({ userid: userid });
      shipdatum.set(item.data);

      ship.set('shipdata', shipdatum);

      this.trigger('change:ship:shipdata', ship, shipdatum.changed, this);
    }

    this.trigger('socket:' + log, ship, this);

    ship.set('datetime', moment.utc().toISOString());
  },

  doExpire: function (item) {
    var userid = item.data.userid;
    var expired = Ship.findOrCreate({ userid: userid });

    if (expired) {
      this.trigger('expired', expired, this);
      this.remove(expired);
    }
  },

  onUpdate: function (payload) {
    if (_.isEmpty(payload)) {
      return;
    }

    _.each(payload, function (item) {
      if (item.method == 'update') {
        this.doUpdate(item);
      }
      if (item.method == 'expire') {
        this.doExpire(item);
      }
    }, this);

    this.trigger('socket:sync', this);
  },

  initSort: function (sortProperty, direction) {
    this.currentSort = {
      strategy: sortProperty,
      direction: direction
    }

    this.comparator = this.strategies[direction || 'asc'][sortProperty];
  },

  changeSort: function (sortProperty, direction) {
    this.initSort(sortProperty, direction);
    this.sort();
  },

  getShipsForLngLat: function (LngLat, min) {
    return this.filter(function (ship) {
      return ship.affectedByLngLat(LngLat, min);
    });
  }
});

module.exports = Ships;
