"use strict";

var config = require('../config').server;

var io = require('socket.io-client');
var socket = io.connect('http://' + config.hostname + ':' + config.port);

module.exports = socket;
