"use strict";

var events = require('../lib/events');

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
  freezeTableName: true,
  tableName: 'ship',

  timestamps: true,
  createdAt: false,
  updatedAt: 'datetime',

  hooks: {
    afterUpdate: function(ship, options) {
      events.emit('ship:update', ship.toJSON());
    },
    afterCreate: function(ship, options) {
      events.emit('ship:create', ship.toJSON());
    }
  }
});

Ship.belongsTo(Position, { as: 'position', foreignKey: 'positionid' });
Ship.belongsTo(ShipData, { as: 'shipdata', foreignKey: 'shipdataid' });

Ship.belongsToMany(Position, { through: 'track', as: 'track', foreignKey: 'shipid', timestamps: false });
Position.belongsToMany(Ship, { through: 'track', as: 'track', foreignKey: 'positionid', timestamps: false });

module.exports = Ship;
