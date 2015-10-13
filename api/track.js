"use strict";

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (server) {
  server.get('/api/track/latest/:shipid', function (req, res, next) {
    Ship.findOne({
      where: {
        id: req.params.shipid
      }
    }).then(function (ship) {
      ship.getTrack({
        where: {
          sog: { $gt: 0 },
          cog: { $gt: 0 }
        },
        limit: 1,
        order: 'datetime DESC'
      }).then(function (position) {
        res.send(position[0].toJSON());
      });
    });
  });

  server.get('/api/track/:shipid', function (req, res, next) {
    var datetime__greater_than;

    if (req.query.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      //d.setDate(d.getDate() - 3);
      d.setHours(d.getHours() - 12);
      datetime__greater_than = d.toISOString();
    }

    Ship.findById(req.params.shipid).then(function (ship) {
      if (_.isNull(ship)) {
        res.send(404);
        return;
      }
      ship.getTrack({
        where: {
          datetime: {
            $gte: datetime__greater_than
          }
        },
        limit: 100,
        order: 'datetime DESC'
      }).then(function (track) {
        res.send(_.map(track, function (position) {
          return position.toJSON()
        }));
      });
    });
  });
}
