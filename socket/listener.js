"use strict";

var events = require('../lib/events');
var findoneShip = require('../lib/findone-ship');

var Listener = function (socket) {
  this.socket = socket;
  this.socket.emit('connected', { id: socket.id });
}

Listener.prototype = {
  onShipUpdate: function (ship) {
    findoneShip(ship.id).done(function (json) {
      this.socket.emit('ship:update:' + json.userid, json);
      this.socket.emit('ship:update', json);
    }.bind(this));
  },

  onShipCreate: function (ship) {
    findoneShip(ship.id).done(function (json) {
      this.socket.emit('ship:create', json);
    }.bind(this));
  },

  onTrackAdd: function (json) {
    this.socket.emit('track:add:' + json.userid, {
      shipname: json.shipname,
      position: json.position
    });
    this.socket.emit('track:add', json);
  },

  connect: function () {
    events.on('ship:update', this.onShipUpdate.bind(this));
    events.on('ship:create', this.onShipCreate.bind(this));
    events.on('track:add', this.onTrackAdd.bind(this));
  },

  disconnect: function () {
    events.removeListener('ship:update', this.onShipUpdate.bind(this));
    events.removeListener('ship:create', this.onShipCreate.bind(this));
    events.removeListener('track:add', this.onTrackAdd.bind(this));
  }
};

module.exports = Listener;
