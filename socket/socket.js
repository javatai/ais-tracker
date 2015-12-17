var _ = require('underscore');
var Socket = require('socket.io');
var Client = require('./client');
var Scheduler = require('./scheduler');

var startSocket = function (server) {
  var io = Socket(server), listeners = { };
  var scheduler = new Scheduler();

  io.on('connection', function (socket) {
    this.listeners[socket.id] = new Client(socket, scheduler);
    this.listeners[socket.id].connect();

    socket.on('disconnect', function () {
      this.listeners[socket.id].disconnect();
      delete this.listeners[socket.id];
    });
  });

  scheduler.run();
}

module.exports = function (server, receiver) {
  if (server.http) startSocket(server.http, receiver);
  if (server.https) startSocket(server.https, receiver);
};