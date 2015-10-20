"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var sequelize = require('./lib/init');

var receiver = require('./receiver');
var server = require('./server');
var socket = require('./socket')(server.https);

sequelize.sync({ force: false }).then(function() {
  receiver.start();

  server.http.listen(config.server.http, config.server.hostname, function() {
    var host = server.http.address().address,
        port = server.http.address().port;

    console.log('listening at http://%s:%s', host, port);
  });

  server.https.listen(config.server.https, config.server.hostname, function() {
    var host = server.https.address().address,
        port = server.https.address().port;

    console.log('listening at http://%s:%s', host, port);
  });
});
