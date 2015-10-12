"use strict";

var sequelize = require('./lib/init');

var express = require('express');
var app = express();

// Create REST resource
require('./api/ship')(app);
require('./api/track')(app);

// Service static files
app.use('/html', express.static('html'));

var server = require('http').Server(app);

module.exports = server;
