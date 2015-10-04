var _ = require('underscore');
var Backbone = require('backbone');
var Ship = require('./model');

var Ships = Backbone.Collection.extend({
  url: '/api/ships',
  model: Ship,

  source: null,
  layer: null,

  addTo: function (map, options) {
    options = options || {};

    var ships = this.filter(function (ship) {
      return ship.has('position');
    });

    var features = _.map(ships, function (ship) {
      return ship.toFeature();
    });

    this.source = map.addSource("ships", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": features
      }
    });

    this.layer = map.addLayer(_.extend({
      "id": "ships",
      "type": "circle",
      "source": "ships",
      "interactive": true,
      "layout": {
        "circle-color": "rgba(200,200,200,1)"
      }
    }, options));

    _.each(ships, function (ship) {
      if (ship.has('position')) {
        ship.addTo(map);
      }
    });
  },

  removeFrom: function (map) {
    map.removeSource("ships");
    map.removeLayer("ships");
  },

  getShipsForLngLat: function (LngLat, min) {
    return this.filter(function (ship) {
      if (ship.has('position')) {
        return ship.distanceTo(LngLat) < min;
      }
      return false;
    });
  }
});

module.exports = Ships;
