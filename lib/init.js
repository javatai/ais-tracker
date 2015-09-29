var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', config);

module.exports = sequelize;