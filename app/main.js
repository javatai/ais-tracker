var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var MapUtil = require('./lib/MapUtil');

var map = require('./map/map');

window._map = map;

var Ships = require('./models/ship/collection');
var ships = new Ships();

window.ships = ships;

map.on('style.load', function () {

  ships.on('sync', function () {
    ships.addTo(map);
  });

  map.on('mousemove', function (e) {
    var bounds = map.getBounds();
    var nw = bounds.getNorthWest();
    var ne = bounds.getNorthEast();

    var dist = Math.round(MapUtil.distance(nw.lat, nw.lng, ne.lat, ne.lng));
    var width = $('#map').width();

    var models = ships.getShipsForLngLat(e.lngLat, 10 * (dist/width));

    if (_.isEmpty(models)) {
      ships.each(function (ship) {
        if (!_.isEmpty(ship.get('track'))) {
          var positions = ship.get('track').getPositionsForLngLat(e.lngLat, 10 * (dist/width));
          _.each(positions, function (position) {
            models.push(position);
          });
        }
      });
    }

    var cur = null;
    if (!_.isEmpty(models)) {
      map.getCanvas().style.cursor = "pointer";
      cur = _.first(models);
      cur.showLabel(map);
    } else {
      map.getCanvas().style.cursor = "";
    }

    ships.each(function (model) {
      if (cur && !_.isEqual(cur, model)) {
        model.hideLabel();
      }
    });

    ships.each(function (ship) {
      if (ship.get('track').length) {
        ship.get('track').each(function (position) {
          if (cur && !_.isEqual(cur, position)) {
           position.hideLabel();
          }
        });
      }
    });
  });

  var current = {
    track: null,
    ship: null
  }
  map.on('click', function (e) {
    map.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, function (err, features) {
      if (err) throw err;

      if (!_.isEmpty(features)) {
        var feature = _.first(features);
        map.flyTo({ center: feature.geometry.coordinates, zoom: 15 });

        if (current.track) {
          current.track.removeFrom(map);
        }
        if (current.ship) {
          current.ship.selected(map, false);
        }

        var id = feature.properties.id;
        current.ship = ships.get(id);
        current.ship.selected(map, true);

        current.ship.fetchTrack().done(function () {
          if (current.ship.get('track').length > 1) {
            current.track = current.ship.get('track');
            current.track.addTo(map);
          }
        });
      }
    });
  });

  ships.fetch();
});
