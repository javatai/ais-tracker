"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');

var privateKey  = fs.readFileSync(__dirname + '/sslcert/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslcert/server.crt', 'utf8');

var compression = require('compression')
var express = require('express');

var http = require('http');
var https = require('https');

var morgan = require('morgan');

var app = express();
var sequelize = require('./lib/init');

// create a write stream (in append mode)
var logDirectory = __dirname + '/logs'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
}

app.use(allowCrossDomain);
app.use(compression());

// Create REST resource
require('./api/ship')(app);
require('./api/track')(app);
require('./api/reception')(app);

// Service static files
app.use(config.server.public.route, express.static(config.server.public.dir, { maxAge: config.server.maxAge }));
app.use(config.server.fonts.route, express.static(config.server.fonts.dir, { maxAge: config.server.maxAge }));

app.use('/cordova', express.static('cordova/www'));

var credentials = { key: privateKey, cert: certificate };

module.exports = {
  'http': http.createServer(app),
  'https': https.createServer(credentials, app)
}
