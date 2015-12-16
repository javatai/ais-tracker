"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var Receiver = require('ais-receiver');
var receiver = new Receiver(config.receiver);

var onPosition = require('ais-receiver/lib/receiver/onPosition');
receiver.nema.on('message:position', onPosition);

var onShipdata = require('ais-receiver/lib/receiver/onShipdata');
receiver.nema.on('message:shipdata', onShipdata);

module.exports = receiver;
