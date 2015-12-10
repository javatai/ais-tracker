'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Map = require('../map/map');
var Socket = require('../lib/socket');

var ShipsLayer = function (options) {
  this.ships = options.ships;
  this.app = options.app;
};

_.extend(ShipsLayer.prototype, Backbone.Events, {
  setViewport: function (socket) {
    Map.onReady().done(_.bind(function () {
      var bounds = Map.getBounds();
      socket.emit('viewport', bounds);
    }, this));
  },

  updateViewport: function (bounds) {
    //Socket.socket.emit('viewport', bounds);
  },

  onClick: function (e) {
    var perimeter = Map.calculatePerimeter();
    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (!ship || (ship && ship.get('id') !== this.clickid)) {
      this.ships.invoke('set', 'selected', false);
      this.clickid = 0;
    }

    if (ship) {
      ship.set('selected', true);
      this.clickid = ship.get('id');
    } else {
      this.app.trigger('clickout');
    }
  },

  onMousemove: function (e) {
    Map.resetCursor();

    var perimeter = Map.calculatePerimeter();
    var ship = _.first(this.ships.getShipsForLngLat(e.lngLat, perimeter));

    if (!ship || (ship && ship.get('id') !== this.mouseoverid)) {
      this.ships.invoke('set', 'mouseover', false);
      this.mouseoverid = 0;
    }

    if (ship) {
      Map.setCursor("pointer");

      ship.set('mouseover', true);
      this.mouseoverid = ship.get('id');
    }
  },

  updateLayer: function () {
    Map.addToMap({
      name: 'markers',
      data: this.ships.toGeoJSON(),
      layer: [{
        name: 'markers',
        json: {
          "type": "symbol",
          "interactive": true,
          "layout": {
            "symbol-spacing": 0,
            "symbol-placement": "point",
            "icon-image": "{marker-symbol}",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "visibility": "visible"
          }
        }
      }, {
        name: 'labels',
        json: {
          "type": "symbol",
          "layout": {
            "text-field": "{title}",
            "text-font": [
              "DIN Offc Pro Medium",
              "Arial Unicode MS Regular"
            ],
            "text-offset": [0, 1.5],
            "text-anchor": "center",
            "text-size": {
              "base": 1,
              "stops": [
                [ 13, 12 ],
                [ 18, 16 ]
              ],
            },
            "text-allow-overlap": true,
            "visibility": "visible"
          },
          "maxzoom": 22,
          "minzoom": 14,
          "paint": {
            "text-color": "#000000",
            "text-halo-blur": 0.5,
            "text-halo-color": "#ffffff",
            "text-halo-width": 0.5
          }
        }
      }]
    });

    this.app.trigger('shipslayer:update');
  },

  onRemoveShip: function (ship) {
    var id = ship.get('id');

    if (this.mouseoverid === id) {
      this.mouseoverid = 0;
    }
    if (this.clickid === id) {
      this.clickid = 0;
    }

    _.delay(_.bind(this.updateLayer, this), 1);
  },

  onLoad: function () {
    this.updateLayer();

    this.listenTo(this.app,   'clickout',        this.updateLayer);
    this.listenTo(this.ships, 'sync:socket',     this.updateLayer);
    this.listenTo(this.ships, 'change:selected', this.updateLayer);

  },

  addToMap: function () {
    this.mouseoverid = 0;
    this.clickid = 0;

    this.listenTo(Map,    'mousemove', this.onMousemove);
    this.listenTo(Map,    'click', this.onClick);

    this.listenTo(Socket, 'connected', this.setViewport);
    this.listenTo(Map,    'boundschanged', this.updateViewport);

    Map.onReady().done(_.bind(function () {
      this.onLoad();
    }, this));
  },

  removeFromMap: function () {
    this.stopListening(this.app,   'clickout',        this.updateLayer);
    this.stopListening(this.ships, 'sync:socket',     this.updateLayer);
    this.stopListening(this.ships, 'change:selected', this.updateLayer);

    this.stopListening(Socket,     'connected',       this.setViewport);
    this.stopListening(Map,        'boundschanged',   this.updateViewport);

    this.stopListening(Map, 'mousemove', this.onMousemove);
    this.stopListening(Map, 'click', this.onClick);

    Map.removeFromMap({
      name: 'markers',
      layer: [ 'markers', 'labels' ]
    });
  }
})

module.exports = ShipsLayer;
