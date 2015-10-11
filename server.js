"use strict";

var sequelize = require('./lib/init');
var restify = require('restify');

// Initialize server
var server = restify.createServer();

server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  }
);

server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Create REST resource
require('./api/ship')(server);
require('./api/track')(server);

server.get(/\/app\/?.*/, restify.serveStatic({
  directory: __dirname,
  default: 'index.html'
}));

module.exports = server;
