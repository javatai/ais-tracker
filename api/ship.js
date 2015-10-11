"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (server) {
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
  });

  server.get('/api/ships', function (req, res, next) {
    var datetime__greater_than, where = { };

    if (req.params.datetime__greater_than) {
      where.datetime = {
        $gte: datetime__greater_than
      }
    } else {
      var d = new Date();
      d.setHours(d.getHours() - 2);
      where.datetime = {
        $gte: d.toISOString()
      }
    }

    var q = {
      include: [
        { model: ShipData, as: 'shipdata' },
        { model: Position, as: 'position' }
      ],
      where: where
    }

    if (req.params.limit) {
      q.limit = req.params.limit;
    } else {
      q.limit = config.setup.ship.limit;
    }

    if (req.params.order) {
      if (req.params.order.substr(0, 1) === '-') {
        q.order = req.params.order.substr(1) + ' DESC';
      } else {
        q.order = req.params.order + ' ASC';
      }
    } else {
      q.order = config.setup.ship.order;
    }

    if (req.params.offset) {
      q.offset = req.params.offset;
    }

    // console.log(req.params, q);

    Ship.findAll(q).then(function (ships) {
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
  });
}