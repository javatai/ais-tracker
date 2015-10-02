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
      "type": "symbol",
      "source": "ships",
      "interactive": true,
      "layout": {
        "icon-image": "{marker-symbol}-11",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
      "paint": {
        "icon-halo-color": "rgba(0, 0, 0, 0)",
        "icon-color": "rgba(0, 0, 0, 1)"
      }
    }, options));
  },

  removeFrom: function (map) {
    map.removeSource("ships");
    map.removeLayer("ships");
  }
});

module.exports = Ships;
