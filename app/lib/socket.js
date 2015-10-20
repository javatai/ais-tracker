"use strict";

var $ = require('jquery');

var socket, config = require('../config').server;
var io = require('socket.io-client');

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
      if (typeof(cordova) !== 'undefined') {
        cordova.plugins.certificates.trustUnsecureCerts(true);

        document.addEventListener("deviceready", function () {
          socket = create({
            protocol: 'https:',
            hostname: config.hostname,
            port: config.https
          });
          dfd.resolve(socket);
        });

      } else {

        if (location.protocol === 'https:') {
          socket = create({
            protocol: 'https:',
            hostname: config.hostname,
            port: config.https
          });
        } else {
          socket = create({
            protocol: 'http:',
            hostname: config.hostname,
            port: config.http
          });
        }

        dfd.resolve(socket);
      }
    }

    return dfd.promise();
  }
}
