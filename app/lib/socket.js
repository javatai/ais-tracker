"use strict";

var io = require('socket.io-client');
var socket = io.connect(location.protocol + '//' + location.hostname + ':' + location.port);

module.exports = socket;
