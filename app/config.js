var env = process.env.NODE_ENV || "development";
var config = require('../config/config.json')[env];

module.exports = config;
