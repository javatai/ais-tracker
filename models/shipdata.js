"use strict";

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
  draught: Sequelize.DECIMAL,
  destination: Sequelize.TEXT,
  dte: Sequelize.INTEGER,
  datetime: Sequelize.DATE,
  raw: Sequelize.TEXT
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'shipdata'
});

module.exports = ShipData;
