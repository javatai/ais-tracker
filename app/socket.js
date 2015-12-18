var config = require('./config').server;

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Platform = require('./platform');

var io, ws = require('socket.io-client');

var Socket = function (options) {
  this.io = io;
};

_.extend(Socket.prototype, Backbone.Events, {
  disconnect: function () {
    if (this.io) {
      this.io.disconnect();
      this.trigger('disconnected', this.io);
    }
  },

  reconnect: function () {
    if (this.io) {
      this.io.connect();
      this.trigger('reconnected', this.io);
    }
  },

  connect: function () {
    var dfd = $.Deferred();

    if (this.io) {
      dfd.resolve(this.io);
    } else {
      Platform.onReady().done(function (platform) {
        var config = Platform.socketConfig();
        var url = config.protocol + '//' + config.hostname + ':' + config.port;

        if (location.protocol === 'https:' || Platform.isCordova) {
          this.io = ws.connect(url, { secure: true });
        } else {
          this.io = ws.connect(url);
        }

        dfd.resolve(this.io);
      }.bind(this));
    }

    return dfd.promise();
  }
});

module.exports = new Socket();
