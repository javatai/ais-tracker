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
  sog: Sequelize.DECIMAL,
  positionaccuracy: Sequelize.INTEGER,
  longitude: Sequelize.DECIMAL,
  latitude: Sequelize.DECIMAL,
  cog: Sequelize.DECIMAL,
  trueheading: Sequelize.DECIMAL,
  timestamp: Sequelize.INTEGER,
  datetime: Sequelize.DATE,
  raw: Sequelize.TEXT
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'position'
});

module.exports = Position;
