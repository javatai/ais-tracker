'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Ship = require('./model');

var Ships = Backbone.Collection.extend({
  url: '/api/ships',
  model: Ship,

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
    this.selectedId = 0;
    this.initSort("name", "asc");

    this.on('remove', function (ship) {
      if (ship.get('id') === this.selectedId) {
        this.selectedId = 0;
      }
    }, this);

    this.on('change:selected', function (ship) {
      if (ship.get('id') === this.selectedId) {
        this.selectedId = 0;
      }
    });
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
    this.comparator = this.strategies[direction || 'asc'][sortProperty];
  },

  changeSort: function (sortProperty, direction) {
    this.initSort(sortProperty, direction);
    this.sort();
  },

  getShipsForLngLat: function (LngLat, min) {
    return this.filter(function (ship) {
      if (ship.has('position')) {
        return ship.distanceTo(LngLat) < min;
      }
      return false;
    });
  },

  _removeModels: function (toRemove) {
    _.invoke(toRemove, 'beforeRemove');
    Backbone.Collection.prototype._removeModels.apply(this, arguments);
  }
});

module.exports = Ships;
