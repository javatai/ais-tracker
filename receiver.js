"use strict";

var Receiver = require('ais-receiver');

var receiver = new Receiver({
  udp_port: '29421'
});

require('./receiver/position')(receiver);
require('./receiver/ship')(receiver);

module.exports = receiver;