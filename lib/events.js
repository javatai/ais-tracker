"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var EventBus = function () { };
util.inherits(EventBus, EventEmitter);

var eventBus = new EventBus();
eventBus.setMaxListeners(0);

module.exports = eventBus;