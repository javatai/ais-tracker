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

    global.ships = this;
    global.ShipDatum = ShipDatum;
  },

  run: function () {
    Socket.connect().done(function (io) {
      this.io = io;
      this.io.on('init', this.onInit.bind(this));
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

    this.io.on('update', this.onUpdate.bind(this));
  },

  doUpdate: function (item) {
    var userid = item.data.userid;
    var ship = this.get(userid);

    var log = 'update';
    if (item.model === 'position') {
      var position = Position.findOrCreate({ userid: userid });
      position.set(item.data);

      if (!ship) {
        ship = Ship.findOrCreate({ userid: userid });
        ship.set('shipdata', ShipDatum.findOrCreate({ userid: userid }));
        this.add(ship);

        log = 'add';
      }

      ship.set('position', position);
      ship.get('track').update(position);

      this.trigger('change:ship:position', ship, position.changed, this);
      this.trigger('socket:' + log, ship, this);
    }

    if (ship && item.model === 'shipdata') {
      var shipdatum = ShipDatum.findOrCreate({ userid: userid });
      shipdatum.set(item.data);

      ship.set('shipdata', shipdatum);
      ship.set('datetime', moment.utc().toISOString());

      this.trigger('change:ship:shipdata', ship, shipdatum.changed, this);
      this.trigger('socket:' + log, ship, this);
    }
  },

  doExpire: function (item) {
    var userid = item.data.userid;
    var ship = this.get(userid);

    if (ship) {
      this.trigger('socket:expire', ship, this);
      this.trigger('expired', ship, this);

      this.remove(ship);
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
