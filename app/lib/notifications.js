'use strict';

var moment = require('moment');

var _ = require('underscore');
var Backbone = require('backbone');

var socket = require('./socket');
var log = require('../models/log/collection');

var Ship = require('../models/ship/model');
var Position = require('../models/position/model');

var template = require('./notification-template.hbs');

var Notifications = function () { };

_.extend(Notifications.prototype, Backbone.Events, {
  notify: function (message, type, delay) {
    $.notify(message, {
      type: type || 'info',
      delay: delay  === undefined ? 2000 : delay,
      newest_on_top: true,
      spacing: 5,
      url_target: '_self',
      template: template(),
      placement: {
        from: "bottom",
        align: "center"
      }
    });
  },

  onConnected: function (message) {
    this.notify({
      title: 'Socket',
      message: 'connected'
    }, 'success');

    log.add({
      type: 'socket',
      title: 'Socket connected',
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onDisonnected: function (message) {
    this.notify({
      title: 'Socket',
      message: 'disconnected'
    }, 'success');

    log.add({
      type: 'socket',
      title: 'Socket disconnected',
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onFailed: function (message) {
    this.notify({
      title: 'Socket',
      message: 'connection failed'
    }, 'alert');

    log.add({
      type: 'socket',
      title: 'Socket connection failed',
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onShipUpdated: function (message) {
    var ship = Ship.findOrCreate(message);

    log.add({
      type: 'ship-updated',
      title: 'Ship updated',
      userid: ship.get('userid'),
      message: ship.getHelper().toTitle(),
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onShipCreated: function (message) {
    var ship = Ship.findOrCreate(message);

    log.add({
      type: 'ship-created',
      title: 'Ship created',
      userid: ship.get('userid'),
      message: ship.getHelper().toTitle(),
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onTrackAdded: function (message) {
    log.add({
      type: 'position-added',
      title: 'Position added',
      userid: message.position.userid,
      message: 'Ship: ' + message.shipname + '<br/>Distance moved: ' + Number(message.distancemoved).toFixed(2) + 'm',
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  onShipExpire: function (ship) {
    this.notify({
      title: 'Expired',
      message: ship.getHelper().toTitle(),
    }, 'alert', 0);

    log.add({
      type: 'ship-expired',
      title: 'Ship expired',
      userid: ship.get('userid'),
      message: ship.getHelper().toTitle(),
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  start: function () {
    socket.on('connected', this.onConnected.bind(this));
    socket.on('disconnect', this.onDisonnected.bind(this));
    socket.on('connect_failed', this.onFailed.bind(this));

    socket.on('ship:create', this.onShipCreated.bind(this));
    socket.on('ship:update', this.onShipUpdated.bind(this));
    socket.on('track:add', this.onTrackAdded.bind(this));
  },

  stop: function () {
    socket.removeListener('connected', this.onConnected.bind(this));
    socket.removeListener('disconnect', this.onDisonnected.bind(this));
    socket.removeListener('connect_failed', this.onFailed.bind(this));

    socket.removeListener('ship:create', this.onShipCreated.bind(this));
    socket.removeListener('ship:update', this.onShipUpdated.bind(this));
    socket.removeListener('track:add', this.onTrackAdded.bind(this));
  }
});

module.exports = Notifications;
