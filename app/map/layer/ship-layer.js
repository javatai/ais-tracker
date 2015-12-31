'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Map = require('../map');

var ShipLayer = function (ships) {
  this.ships = ships;
  this.listenTo(this.ships, 'socket:sync', this.update);
};

_.extend(ShipLayer.prototype, Backbone.Events, {
  toFeature: function (ship) {
    var position = ship.get('position');

    var angle = position.has('trueheading') && position.get('trueheading')
      || position.has('cog') && position.get('cog')
      || 0;

    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": position.getCoordinate()
      },
      "properties": {
        "title": ship.toTitle(),
        "marker-symbol": 'triangle-' + Math.round(angle) + '-stroked',
        "angle": angle,
        "id": ship.get('userid')
      }
    }
  },

  toFeatureCollection: function (ships) {
    var geojson = {
      "type": "FeatureCollection",
      "features": ships.map(function (ship) {
        return this.toFeature(ship);
      }, this)
    };

    return geojson;
  },

  update: function (ships) {
    Map.addToMap({
      name: 'markers',
      data: this.toFeatureCollection(ships),
      layer: [{
        name: 'markers',
        json: {
          "type": "symbol",
          "interactive": true,
          "layout": {
            "symbol-spacing": 0,
            "symbol-placement": "point",
            "icon-image": "{marker-symbol}",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "visibility": "visible"
          }
        }
      }, {
        name: 'labels',
        json: {
          "type": "symbol",
          "layout": {
            "text-field": "{title}",
            "text-font": [
              "DIN Offc Pro Medium",
              "Arial Unicode MS Regular"
            ],
            "text-offset": [0, 1.5],
            "text-anchor": "center",
            "text-size": {
              "base": 1,
              "stops": [
                [ 13, 12 ],
                [ 18, 16 ]
              ],
            },
            "text-allow-overlap": true,
            "visibility": "visible"
          },
          "maxzoom": 22,
          "minzoom": 14,
          "paint": {
            "text-color": "#000000",
            "text-halo-blur": 0.5,
            "text-halo-color": "#ffffff",
            "text-halo-width": 0.5
          }
        }
      }]
    });
  }
})

module.exports = ShipLayer;
