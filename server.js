"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var Sequelize = require('sequelize');
var sequelize = new Sequelize('', '', '', config);

var epilogue = require('epilogue');
epilogue.Controllers.list.prototype.fetch = require('./lib/epilogue.Controllers.list.fetch');

var restify = require('restify');

// Initialize server
var server = restify.createServer();
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

// Create database and listen
sequelize
  .sync({ force: false })
  .then(function() {
    server.listen(3000, function() {
      var host = server.address().address,
          port = server.address().port;

      console.log('listening at http://%s:%s', host, port);
    });
  });