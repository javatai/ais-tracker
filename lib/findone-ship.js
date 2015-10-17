"use strict";

var Q = require('q');

var Position = require('../models/position');
var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

var findoneShip = function (id) {
  var deferred = Q.defer();

  Ship.findOne({
    include: [
      { model: ShipData, as: 'shipdata' },
      { model: Position, as: 'position' }
    ],
    where: {
      id: id
    }
  }).then(function (ship) {
    if (!ship) {
      deferred.reject();
    } else {
      var json = ship.toJSON();

      delete json.shipdataid;
      delete json.positionid;

      if (json.shipdata) {
        json.shipdata.raw = JSON.parse(json.shipdata.raw);
      }

      if (json.position) {
        json.position.raw = JSON.parse(json.position.raw);
      }

      deferred.resolve(json);
    }
  });

  return deferred.promise;
}

module.exports = findoneShip;
