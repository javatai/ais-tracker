"use strict";

var _ = require('underscore');
var Position = require('../models/position');
var Ship = require('../models/ship');

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 +
          c(lat1 * p) * c(lat2 * p) *
          (1 - c((lon2 - lon1) * p))/2;

  return 12742000 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

module.exports = function (receiver) {
  receiver.nema.on('message:position', function (ais) {
    if (_.isNull(ais.message.Latitude) || _.isNull(ais.message.Longitude)) {
      return;
    }

    Position.create({
      userid: ais.message.UserID,
      navigationstatus: ais.message.NavigationStatus,
      rot: ais.message.ROT,
      sog: ais.message.SOG,
      positionaccuracy: ais.message.PositionAccuracy,
      longitude: ais.message.Longitude,
      latitude: ais.message.Latitude,
      cog: ais.message.COG,
      trueheading: ais.message.TrueHeading,
      timestamp: ais.message.TimeStamp,
      raw: JSON.stringify(ais.ais)
    }).then(function(position) {
      Ship.findOrCreate({
        where: { userid: position.get('userid') }
      }).spread(function(ship, created) {
        ship.setPosition(position);
        ship.getTrack({
          order: [['id', 'DESC']],
          limit: 1
        }).then(function(track) {
          var last = track[0];
          if (!last || distance(position.get('latitude'), position.get('longitude'), last.get('latitude'), last.get('longitude')) > 5) {
            ship.addTrack(position);
          }
        });
      });
    });

  });
}
