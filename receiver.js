"use strict";

var Receiver = require('ais-receiver');

var receiver = new Receiver({
  port: '29421',
  address: '0.0.0.0'
});

require('./receiver/position')(receiver);
require('./receiver/ship')(receiver);

module.exports = receiver;