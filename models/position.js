"use strict";

var Sequelize = require('sequelize');
var sequelize = require('../lib/init');

var Position = sequelize.define("position", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: Sequelize.INTEGER,
  navigationstatus: Sequelize.INTEGER,
  rot: Sequelize.INTEGER,
  sog: Sequelize.DOUBLE,
  positionaccuracy: Sequelize.INTEGER,
  longitude: Sequelize.DECIMAL(9,6),
  latitude: Sequelize.DECIMAL(8,6),
  cog: Sequelize.DOUBLE,
  trueheading: Sequelize.DOUBLE,
  timestamp: Sequelize.INTEGER,
  raw: Sequelize.TEXT
}, {
  freezeTableName: true,
  tableName: 'position',

  timestamps: true,
  createdAt: 'datetime',
  updatedAt: false
});

module.exports = Position;
