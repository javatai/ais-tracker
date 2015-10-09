"use strict";

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (server, epilogue) {
  server.get('/api/ship/:shipid', function (req, res, next) {
    Ship.findOne({
      include: [
        { model: ShipData, as: 'shipdata' },
        { model: Position, as: 'position' }
      ],
      where: {
        id: req.params.shipid
      }
    }).then(function (ship) {
      ship = ship.get({ plain: true });

      delete ship.shipdataid;
      delete ship.positionid;

      if (ship.shipdata) {
        ship.shipdata.raw = JSON.parse(ship.shipdata.raw);
      }

      if (ship.position) {
        ship.position.raw = JSON.parse(ship.position.raw);
      }

      res.send(ship);
    });

    return next();
  });

  server.get('/api/ships', function (req, res, next) {
    var datetime__greater_than;

    if (req.params.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      d.setHours(d.getHours() - 2);
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
      },
      limit: 10,
      order: 'datetime DESC'
    }).then(function (ships) {
      res.send(_.map(ships, function (_ship) {
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
      }));
    });

    return next();
  });
}