'use strict';

var socket = require('./socket');

var Ship = require('../models/ship/model');
var Position = require('../models/position/model');

var Notifications = function () { };

Notifications.prototype = {
  notify: function (message, type, delay) {
    $.notify(message, {
      type: type || 'info',
      delay: delay || 2000,
      newest_on_top: true,
      spacing: 5,
      offset: {
        x: 60,
        y: 20
      },
      url_target: '_self'
    });
  },

  onConnected: function (message) {
    this.notify({
      title: 'Socket',
      message: 'connected'
    }, 'success');
  },

  onDisonnected: function (message) {
    this.notify({
      title: 'Socket',
      message: 'disconnected'
    }, 'success');
  },

  onFailed: function (message) {
    this.notify({
      title: 'Socket',
      message: 'connection failed'
    }, 'alert');
  },

  onShipCreated: function (message) {
    var ship = Ship.findOrCreate(message);

    this.notify({
      title: 'Ship created',
      message: ship.getHelper().toTitel(),
      url: '#mmsi/' + ship.get('userid')
    });
  },

  onTrackAdded: function (message) {
    this.notify({
      title: 'Position added',
      message: 'Ship: ' + message.shipname + '<br>' + 'Distance moved: ' + Number(message.distancemoved).toFixed(2) + 'm',
      url: '#mmsi/' + message.userid
    });
  },

  start: function () {
    socket.on('connected', this.onConnected.bind(this));
    socket.on('disconnect', this.onDisonnected.bind(this));
    socket.on('connect_failed', this.onFailed.bind(this));

    socket.on('ship:create', this.onShipCreated.bind(this));
    socket.on('track:add', this.onTrackAdded.bind(this));
  },

  stop: function () {
    socket.removeListener('connected', this.onConnected.bind(this));
    socket.removeListener('disconnect', this.onDisonnected.bind(this));
    socket.removeListener('connect_failed', this.onFailed.bind(this));

    socket.removeListener('ship:create', this.onShipCreated.bind(this));
    socket.removeListener('track:add', this.onTrackAdded.bind(this));
  }
}

module.exports = Notifications;

