"use strict";

var sequelize = require('./lib/init');

var epilogue = require('epilogue');
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

// Initialize epilogue
epilogue.initialize({
  app: server,
  sequelize: sequelize
});

// Create REST resource
require('./api/position')(server, epilogue);
require('./api/shipdata')(server, epilogue);
require('./api/ship')(server, epilogue);
require('./api/track')(server, epilogue);

server.get(/\/app\/?.*/, restify.serveStatic({
  directory: __dirname,
  default: 'index.html'
}));

module.exports = server;
