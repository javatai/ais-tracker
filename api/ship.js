"use strict";

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

var Format = function (ships, type) {

  var formats = {
    geojson: function (ships) {
      var features = [];
      _.each(ships, function (_ship) {
        var ship = _ship.get({ plain: true });
        if (ship.position) {
          if (ship.shipdata) {
            ship.shipdata.raw = JSON.parse(ship.shipdata.raw);
          }

          if (ship.position) {
            ship.position.raw = JSON.parse(ship.position.raw);
          }

          features.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [ ship.position.longitude, ship.position.latitude ]
            },
            "properties": {
              "title": ship.shipdata && ship.shipdata.name || ship.position.userid,
              "marker-symbol": "circle-stroked",
              "id": ship.id,
              "shipdata": ship.shipdata,
              "position": ship.position
            }
          })
        }
      });

      return {
        "type": "FeatureCollection",
        "features": features
      }
    },
    json: function (ships) {
      return _.map(ships, function (_ship) {
        var ship = _ship.get({ plain: true });

        delete ship.shipdataid;
        delete ship.positionid;

        if (ship.shipdata) {
          ship.shipdata.raw = JSON.parse(ship.shipdata.raw);
        }

        if (ship.position) {
          ship.position.raw = JSON.parse(ship.position.raw);
        }

        return ship;
      });
    }
  };

  return (formats[type] || formats['json'])(ships);

}

module.exports = function (server, epilogue) {

  server.get('/api/ships', function (req, res, next) {
    var datetime__greater_than;

    if (req.params.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      d.setDate(d.getDate() - 1);
      datetime__greater_than = d.toISOString();
    }

    Ship.findAll({
      include: [
        { model: ShipData, as: 'shipdata' },
        { model: Position, as: 'position' }
      ],
      where: {
        datetime: {
          $gte: datetime__greater_than
        }
      }
    }).then(function (ships) {
      res.send(Format(ships, req.params.format));
    });

    return next();
  });

}