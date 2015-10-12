"use strict";

var events = require('../lib/events');

var Sequelize = require('sequelize');
var sequelize = require('../lib/init');

var ShipData = sequelize.define("shipdata", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: Sequelize.INTEGER,
  aisversion: Sequelize.INTEGER,
  imonumber: Sequelize.INTEGER,
  callsign: Sequelize.TEXT,
  name: Sequelize.TEXT,
  shiptype: Sequelize.INTEGER,
  dima: Sequelize.INTEGER,
  dimb: Sequelize.INTEGER,
  dimc: Sequelize.INTEGER,
  dimd: Sequelize.INTEGER,
  positiontype: Sequelize.INTEGER,
  etamonth: Sequelize.INTEGER,
  etaday: Sequelize.INTEGER,
  etahour: Sequelize.INTEGER,
  etaminute: Sequelize.INTEGER,
  draught: Sequelize.DECIMAL(5,2),
  destination: Sequelize.TEXT,
  dte: Sequelize.INTEGER,
  raw: Sequelize.TEXT
}, {
  freezeTableName: true,
  tableName: 'shipdata',

  timestamps: true,
  createdAt: 'datetime',
  updatedAt: false,

  hooks: {
    afterCreate: function(shipdata, options) {
      events.emit('shipdata:create', shipdata.toJSON());
    }
  }
});

module.exports = ShipData;
