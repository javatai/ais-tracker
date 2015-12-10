"use strict";

var $ = require('jquery');
var socket, io = require('socket.io-client');

var config = require('../config').server;
var Platform = require('./platform');

var _ = require('underscore');
var Backbone = require('backbone');

var Socket = function (options) {
  this.socket = socket;
};

_.extend(Socket.prototype, Backbone.Events, {
  disconnect: function () {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();

      this.trigger('disconnected', this.socket);
    }
  },

  reconnect: function () {
    if (this.socket) {
      this.socket.connect();
      this.trigger('connected', this.socket);
    }
  },

  connect: function () {
    var self = this, dfd = $.Deferred();

    if (this.socket) {
      dfd.resolve(this.socket);
    } else {
      Platform.onReady().done(function (platform) {
        var config = Platform.socketConfig();
        var url = config.protocol + '//' + config.hostname + ':' + config.port;

        if (location.protocol === 'https:' || Platform.isCordova) {
          self.socket = io.connect(url, { secure: true });
        } else {
          self.socket = io.connect(url);
        }

        dfd.resolve(self.socket);
      });
    }

    return dfd.promise();
  }
});

module.exports = new Socket();

