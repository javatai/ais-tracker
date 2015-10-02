"use strict";

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (server, epilogue) {
  server.get('/api/track/:shipid', function (req, res, next) {
    var datetime__greater_than;

    if (req.params.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      d.setDate(d.getDate() - 30);
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
        }
      }).then(function (track) {
        res.send(_.map(track, function (position) {
          return position.get({ plain: true })
        }));
      });
    });

    return next();
  });
}
