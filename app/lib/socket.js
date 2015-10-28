"use strict";

var $ = require('jquery');
var socket, io = require('socket.io-client');

var config = require('../config').server;
var Platform = require('./platform');

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
        var config = Platform.socketConfig();
        var url = config.protocol + '//' + config.hostname + ':' + config.port;

        console.log(url, Platform.isCordova);

        if (location.protocol === 'https:' || Platform.isCordova) {
          socket = io.connect(url, { secure: true });
        } else {
          socket = io.connect(url);
        }

        dfd.resolve(socket);
      });
    }

    return dfd.promise();
  }
}
