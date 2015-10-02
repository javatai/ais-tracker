var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

var BackboneRelational = require('backbone');

var map = require('./map/map');

window._map = map;

var Ships = require('./models/ship/collection');
var ships = new Ships();

window.ships = ships;

map.on('style.load', function () {

  ships.on('sync', function () {
    ships.addTo(map);
  });

  var debounceShipLabel = _.debounce(function (err, features) {
    if (err) throw err;

    map.getCanvas().style.cursor = features.length ? "pointer" : "";

    var ids = _.map(features, function (feature) { return feature.properties.id });
    _.each(ids, function (id) {
      var ship = ships.get(id);
      if (_.isNull(ship.label)) {
        ship.showLabel(map);
      }
    });

    ships.each(function (ship) {
      if (!_.isNull(ship.label) && _.indexOf(ids, ship.get('id')) < 0) {
        ship.hideLabel();
      }
    });
  }, 50);

  var debouncePositionLabel = _.debounce(function (err, features) {
    if (err) throw err;

    map.getCanvas().style.cursor = features.length ? "pointer" : "";

    if (!_.isEmpty(features)) {
      var feature = _.first(features);
      var id = feature.properties.id;
      var shipid = feature.properties.shipid;

      var ship = ships.get(shipid);
      var position = ship.get('track').get(id);

      if (_.isNull(position.label)) {
        position.showLabel(map);
      }

      ship.get('track').each(function (position) {
        if (!_.isNull(position.label) && position.get('id') != id) {
          position.hideLabel();
        }
      });
    }

  }, 50);

  var showTrack = function (err, features) {
    if (err) throw err;

    if (!_.isEmpty(features)) {
      var feature = _.first(features);
      map.flyTo({ center: feature.geometry.coordinates, zoom: 15 });

      var id = feature.properties.id;

      var ship = ships.get(id);
      ship.showLabel(map);

      ship.fetchTrack().done(function () {
        ship.get('track').addTo(map);
      });
    }
  }

  map.on('mousemove', function (e) {
    map.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, debounceShipLabel);
  });

  map.on('click', function (e) {
    map.featuresAt(e.point, { layer: 'ships', radius: 10, includeGeometry: true }, showTrack);
  });

  map.on('mousemove', function (e) {
    map.featuresAt(e.point, { layer: 'positions', radius: 10, includeGeometry: true }, debouncePositionLabel);
  });

  ships.fetch();
});

// var model = ships.get(1);
