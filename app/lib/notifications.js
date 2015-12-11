'use strict';

var moment = require('moment');

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var Socket = require('./socket');
var log = require('../models/log/collection');

var Ship = require('../models/ship/model');
var Position = require('../models/position/model');

var template = require('./notifications/notification-template.hbs');

var Notifications = function (options) {
  this.ships = options.ships;
};

_.extend(Notifications.prototype, Backbone.Events, {
  notify: function (message, type, delay) {
    $.notify(message, {
      type: type || 'info',
      delay: delay  === undefined ? 1000 : delay,
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
    }, 'alert', 1000);

    log.add({
      type: 'ship-expired',
      title: 'Ship expired',
      userid: ship.get('userid'),
      message: ship.getHelper().toTitle(),
      datetime: moment().format('YYYY-MM-DD HH:mm:ss')
    });
  },

  expireShips: function (ships) {
    _.each(ships, function (ship) {
      this.onShipExpire(ship);
    }, this);
  },

  start: function () {
    this.listenTo(this.ships, 'expired', this.expireShips);

    if (this.socket) return;

    Socket.connect().done(_.bind(function (socket) {
      this.socket = socket;
      this.socket.on('track:add', this.onTrackAdded.bind(this));
    }, this));
  },

  stop: function () {
    this.stopListening(this.ships, 'expired', this.expireShips);
    log.reset();

    if (!this.socket) return;
    this.socket.removeListener('track:add', this.onTrackAdded.bind(this));

    this.socket = null;
  }
});

module.exports = Notifications;
