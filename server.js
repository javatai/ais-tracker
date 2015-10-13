"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var sequelize = require('./lib/init');

var express = require('express');
var app = express();

// Create REST resource
require('./api/ship')(app);
require('./api/track')(app);

// Service static files
app.use(config.server.public.route,
  express.static(config.server.public.dir));

var server = require('http').Server(app);

module.exports = server;
