'use strict';

var Backbone = require('backbone');

var Router = Backbone.Router.extend({
  routes: {
    "mmsi/:mmsi": "search"
  },

  initialize: function (options) {
    this.collection = options.collection;
    this.appevents = options.appevents;
  },

  search: function(mmsi) {
    var ship = this.collection.findWhere({ userid: Number(mmsi) });
    if (ship) {
      this.appevents.trigger('router:select', ship);
    }
    else {
      this.navigate("");
    }
  }
});

module.exports = Router;