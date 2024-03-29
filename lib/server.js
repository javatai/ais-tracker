var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env].server;

var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');

var privateKey  = fs.readFileSync(__dirname + '/../sslcert/' + config.ssl.privateKey, 'utf8');
var certificate = fs.readFileSync(__dirname + '/../sslcert/' + config.ssl.certificate, 'utf8');
var ca = config.ssl.ca && fs.readFileSync(__dirname + '/../sslcert/' + config.ssl.ca, 'utf8') || null;

var credentials = { key: privateKey, cert: certificate, ca: ca };
if (ca) {
  credentials.ca = ca;
}


var compression = require('compression')
var express = require('express');

var http = require('http');
var https = require('https');

var morgan = require('morgan');

var app = express();

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

// Service static files
app.use(config.public.route, express.static(config.public.dir, { maxAge: config.maxAge }));
app.use(config.fonts.route, express.static(config.fonts.dir, { maxAge: config.maxAge }));

module.exports = {
  'http': http.createServer(app),
  'https': https.createServer(credentials, app)
}
