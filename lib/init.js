"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, config.sequelize);

module.exports = sequelize;