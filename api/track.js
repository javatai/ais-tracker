"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (server) {
  server.get('/api/track/:shipid', function (req, res, next) {
    var datetime__greater_than;

    if (req.query.datetime__greater_than) {
      datetime__greater_than = req.params.datetime__greater_than;
    } else {
      var d = new Date();
      d.setHours(d.getHours() - config.setup.track.hours);
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
        limit: config.setup.track.limit,
        order: 'datetime DESC'
      }).then(function (track) {
        res.send(_.map(track, function (position) {
          return position.toJSON()
        }));
      });
    });
  });
}
