"use strict";

var Sequelize = require('sequelize');
var sequelize = require('../lib/init');

var Position = require('./position');
var ShipData = require('./shipdata');

var Ship = sequelize.define("ship", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userid: Sequelize.INTEGER
}, {
  timestamps: true,
  createdAt: false,
  updatedAt: 'datetime',
  freezeTableName: true,
  tableName: 'ship'
});

Ship.belongsTo(Position, { as: 'Position', foreignKey: 'positionid' });
Ship.belongsTo(ShipData, { as: 'ShipData', foreignKey: 'shipdataid' });

Ship.belongsToMany(Position, { through: 'track', as: 'Track', foreignKey: 'shipid', timestamps: false });
Position.belongsToMany(Ship, { through: 'track', as: 'Track', foreignKey: 'positionid', timestamps: false });

module.exports = Ship;
