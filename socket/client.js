var _ = require('underscore');
var InitClient = require('./initclient');
var Track = require('./track');

var Client = function (socket, scheduler) {
  this.socket = socket;
  this.scheduler = scheduler;
}

Client.prototype = {
  update: function (items) {
    this.socket.emit('update', items);
  },

  init: function (items) {
    this.socket.emit('init', items);
    this.scheduler.on('update', this.update.bind(this));
  },

  track: function (mmsi) {
    var track = new Track();
    track.fetch(mmsi, function (track) {
      this.socket.emit('track:' + mmsi, track);
    }.bind(this));
  },

  connect: function () {
    this.socket.on('track', this.track.bind(this));

    _.delay(function () {
      var initClient = new InitClient();
      initClient.on('init', this.init.bind(this));
      initClient.fetch();
    }.bind(this), 1000);
  },

  disconnect: function () {
    this.scheduler.removeListener('update', this.update.bind(this));
    this.socket.removeListener('track', this.track.bind(this));
  }
};

module.exports = Client;