"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

var findoneShip = require('../lib/findone-ship');

module.exports = function (server) {
  server.get('/api/ship/:shipid', function (req, res, next) {
    findoneShip(req.params.shipid).done(function (json) {
      res.send(json);
    });
  });

  server.get('/api/ships', function (req, res, next) {
    var datetime__greater_than, where = { };

    if (req.query.datetime__greater_than) {
      where.datetime = {
        $gte: datetime__greater_than
      }
    } else {
      var d = new Date();
      d.setHours(d.getHours() - config.setup.ship.hours);
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

    if (req.query.limit) {
      q.limit = req.query.limit;
    } else {
      q.limit = config.setup.ship.limit;
    }

    if (req.query.order) {
      if (req.query.order.substr(0, 1) === '-') {
        q.order = req.query.order.substr(1) + ' DESC';
      } else {
        q.order = req.query.order + ' ASC';
      }
    } else {
      q.order = config.setup.ship.order;
    }

    if (req.query.offset) {
      q.offset = req.query.offset;
    }

    // console.log(q);

    Ship.findAll(q).then(function (ships) {
      res.send(_.map(ships, function (ship) {
        var json = ship.toJSON();

        delete json.shipdataid;
        delete json.positionid;

        if (json.shipdata) {
          json.shipdata.raw = JSON.parse(json.shipdata.raw);
        }

        if (json.position) {
          json.position.raw = JSON.parse(json.position.raw);
        }

        return json;
      }));
    });
  });
}