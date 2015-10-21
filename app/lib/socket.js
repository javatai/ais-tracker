"use strict";

var $ = require('jquery');
var socket, io = require('socket.io-client');

var Platform = require('./platform');

var create = function (location) {
  var url = location.protocol + '//' + location.hostname + ':' + location.port;

  if (location.protocol === 'https:') {
    return io.connect(url, { secure: true });
  }

  return io.connect(url);
}

module.exports = {
  disconnect: function () {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
  },

  reconnect: function () {
    if (socket) {
      socket.connect();
    }
  },

  connect: function () {
    var dfd = $.Deferred();

    if (socket) {
      dfd.resolve(socket);
    } else {
      Platform.onReady().done(function (platform) {
        socket = create(platform.socketConfig());
        dfd.resolve(socket);
      });
    }

    return dfd.promise();
  }
}
