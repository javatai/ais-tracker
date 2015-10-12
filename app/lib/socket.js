"use strict";

var io = require('socket.io-client');
var socket = io.connect(location.origin);

module.exports = socket;