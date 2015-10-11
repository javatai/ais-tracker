"use strict";

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/config/config.json')[env];

var sequelize = require('./lib/init');

var receiver = require('./receiver');
var server = require('./server');

sequelize.sync({ force: false }).then(function() {
  receiver.start();

  server.listen(config.server.port, config.server.hostname, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
  });
});
