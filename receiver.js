"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var Receiver = require('ais-receiver');
var receiver = new Receiver(config.receiver);

require('./receiver/position')(receiver);
require('./receiver/ship')(receiver);

module.exports = receiver;