'use strict';

var moment = require('moment');

var socket = require('./socket');
var log = require('../models/log/collection');

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
      url_target: '_self',
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 notification" role="alert">' +
        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
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
}

module.exports = Notifications;

