'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    "mmsi/:mmsi": "search"
  },

  initialize: function (options) {
    this.ships = options.ships;

    this.ships.once('sync', function () {
      Backbone.history.start();
    });

    var navigate = _.debounce(_.bind(function (route) {
      this.navigate(route);
    }, this), 300);

    this.listenTo(this.ships, 'change:selected', function (ship, selected) {
      if (selected) {
        navigate('mmsi/' + ship.get('userid'));
      } else {
        navigate('');
      }
    });
  },

  search: function (mmsi) {
    var ship = this.ships.findWhere({ userid: Number(mmsi) });
    if (ship) {
      this.ships.selectShip(ship);
    } else {
      this.navigate('');
    }
  }
});

module.exports = Router;