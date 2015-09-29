"use strict";

var ShipData = require('../models/shipdata');
var Ship = require('../models/ship');

module.exports = function (receiver) {
  receiver.nema.on('message:shipdata', function (ais) {
    ShipData.create({
      userid: ais.message.UserID,
      aisversion: ais.message.AISversion,
      imonumber: ais.message.IMOnumber,
      callsign: ais.message.CallSign,
      name: ais.message.Name,
      shiptype: ais.message.ShipType,
      dima: ais.message.DimA,
      dimb: ais.message.DimB,
      dimc: ais.message.DimC,
      dimd: ais.message.DimD,
      positiontype: ais.message.PositionType,
      etamonth:ais.message.ETAmonth,
      etaday: ais.message.ETAday,
      etahour: ais.message.ETAhour,
      etaminute: ais.message.ETAminute,
      draught: ais.message.Draught,
      destination: ais.message.Destination,
      dte: ais.message.DTE,
      raw: JSON.stringify(ais.ais)
    }).then(function(shipdata) {
      Ship.findOrCreate({
        where: { userid: shipdata.get('userid') }
      }).spread(function(ship, created) {
        ship.setShipData(shipdata);
      });
    });
  });
}
