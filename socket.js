"use strict";

var Socket = require('socket.io');
var Listener = require('./socket/listener');

var startSocket = function (server, receiver) {
  var io = Socket(server);
  var listeners = { };
  io.on('connection', function (socket) {
    this.listeners[socket.id] = new Listener(socket);
    this.listeners[socket.id].connect();

    // console.log('connect', Object.keys(this.listeners));

    socket.on('disconnect', function () {
      // console.log(arguments);
      // console.log('disconnect', socket.id);
      this.listeners[socket.id].disconnect();
      delete this.listeners[socket.id];

      // console.log('connected', Object.keys(this.listeners));
    });
  });
}

module.exports = function (server, receiver) {
  startSocket(server.http, receiver);
  startSocket(server.https, receiver);
};
