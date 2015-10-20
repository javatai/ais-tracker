"use strict";

var socket, config = require('../config').server;

var $ = require('jquery');
var io = require('socket.io-client');

var createSocket = function (location) {
  console.log(location);

  var url = location.protocol + '//' + location.hostname + ':' + location.port;

  if (location.protocol === 'https:') {
    return io.connect(url, { secure: true });
  }

  return io.connect(url);
}

module.exports = function () {
  var dfd = $.Deferred();

  if (socket) {
    dfd.resolve(socket);
  } else {
    if (typeof(cordova) !== 'undefined') {
      cordova.plugins.certificates.trustUnsecureCerts(true);

      document.addEventListener("deviceready", function () {
        socket = createSocket({
          protocol: 'https:',
          hostname: config.hostname,
          port: config.https
        });
        dfd.resolve(socket);
      });
    } else {

      if (location.protocol === 'https:') {
        socket = createSocket({
          protocol: 'https:',
          hostname: config.hostname,
          port: config.https
        });
      } else {
        socket = createSocket({
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
