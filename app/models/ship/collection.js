'use strict';

var setup = require('../../config').setup.ship;
var config = require('../../config').server;

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');

var Platform = require('../../lib/platform');
var Socket = require('../../lib/socket');

var Ship = require('./model');
var ShipData = require('../shipdata/model');

var Ships = Backbone.Collection.extend({
  model: Ship,

  url: function () {
    return Platform.setPrefix('/api/ships');
  },

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

  initialize: function (options) {
    this.options = options;

    this.selectedId = 0;
    this.initSort(this.currentSort.strategy, this.currentSort.direction);

    this.on('remove', function (ship) {
      if (ship.get('id') === this.selectedId) {
        this.selectedId = 0;
      }
    }, this);

    this.on('change:selected', function (ship, selected) {
      if (selected) {
        this.each(function (_ship) {
          if (_ship.get('id') !== ship.get('id')) {
            _ship.set('selected', false);
          }
        });
      }

      if (ship.get('id') === this.selectedId) {
        this.selectedId = 0;
      }
    });

    this.listenTo(this.options.app, 'shopListening', function () {
      console.log('abort');
      if (this.xhr.abort) this.xhr.abort();
    });
  },

  start: function () {
    this.fetch();

    if (this.socket) return;

    Socket.connect().done(_.bind(function (socket) {
      this.socket = socket;

      this.socket.on('ship:create', this.onShipCreated.bind(this));
      this.socket.on('ship:update', this.onShipUpdated.bind(this));
    }, this));

    this.timer = setInterval(_.bind(function () {
      this.removeExpiredModels();
    }, this), 15 * 6000);
  },

  stop: function () {
    clearInterval(this.timer);

    this.invoke('stopListening');

    if (this.socket) {
      this.socket.removeListener('ship:create', this.onShipCreated.bind(this));
      this.socket.removeListener('ship:update', this.onShipUpdated.bind(this));

      this.socket = null;
    }

    this.reset();
  },

  removeExpiredModels: function () {
    var expired = this.filter(function (ship) {
      var now = moment.utc();
      var d = moment.utc(ship.get('datetime'));
      var diff = now.diff(d, 'minutes');
      return diff > setup.minutes;
    });

    this.trigger('expired', expired, this);
    this.remove(expired);
  },

  reset: function(models, options) {
    models  || (models = []);
    options || (options = {});

    for (var i = 0, l = this.models.length; i < l; i++) {
      this._removeReference(this.models[i]);

      this.trigger('remove', this.models[i], this);
      this.models[i].trigger('remove', this.models[i], this);
    }

    this._reset();
    this.add(models, _.extend({ silent: true }, options));

    if (!options.silent) this.trigger('reset', this, options);
    return this;
  },

  onShipCreated: function (message) {
    this.add(Ship.findOrCreate(message));
  },

  onShipUpdated: function (message) {
    if (!this.get(message.id)) {
      var ship = Ship.findOrCreate(message);
      this.add(ship);
    }
  },

  selectShip: function (idOrModel) {
    var id;
    if (idOrModel instanceof Ship) {
      id = idOrModel.get('id');
    } else {
      id = idOrModel;
    }

    if (this.selectedId) {
      var ship = this.get(this.selectedId);
      var position = ship.get('track').findWhere({ selected: true });
      if (id !== this.selectedId && !position) {
        ship.set('selected', false);
        this.selectedId = 0;
      } else {
        return true;
      }
    }

    if (id) {
      this.get(id).set('selected', true);
      this.selectedId = id;
      return true;
    } else {
      return false;
    }
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
  },

  toGeoJSON: function () {
    var geojson = {
      "type": "FeatureCollection",
      "features": []
    };

    if (this.length < 1) return geojson;

    this.each(function (ship) {
      var marker = ship.getMarker().toMarker();
      if (!marker) return;

      ship.getMarker().chkUpdate();

      geojson.features.push(marker);
    })

    return geojson;
  },

  fetch: function () {
    this.xhr = Backbone.Collection.prototype.fetch.apply(this, arguments);
    return this.xhr;
  }
});

module.exports = Ships;
