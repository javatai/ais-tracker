var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../config/config.json')[env];

var _ = require('underscore');
var moment = require('moment');

var Redis = require('redis');
var redis = Redis.createClient(config.redis);

var Socket = require('socket.io');
var Scheduler = require('./scheduler');

var startSocket = function (server) {
  redis.keys('client:*', function (err, keys) {
    if (!err) {
      var cmds = _.map(keys, function (key) {
        return [ 'del', key ];
      });
      redis.multi(cmds).exec();
    }
  });

  var io = Socket(server), listeners = [];

  io.on('connection', function (ws) {
    // console.log('connected', ws.id);
    listeners[ws.id] = new Scheduler(ws);

    ws.on('track', function (mmsi) {
      listeners[ws.id].track(mmsi);
    });

    ws.on('disconnect', function () {
      // console.log('disconnected', ws.id);
      listeners[ws.id].stop();
      delete listeners[ws.id];
    });
  });
}

module.exports = function (server, receiver) {
  if (server.http) startSocket(server.http, receiver);
  if (server.https) startSocket(server.https, receiver);
};