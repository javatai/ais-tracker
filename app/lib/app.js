'use strict';

var _ = require('underscore');
var $ = require('jquery');

var Backbone = require('backbone');
var Platform = require('./platform');

var Ships = require('../models/ship/collection');
var Router = require('./router');

var ReceptionLayer = require('../layer/reception-layer');
var ShipsLayer = require('../layer/ships-layer');
var TrackLayer = require('../layer/track-layer');

var DesktopView = require('../views/desktop-view');
var Notifications = require('./notifications');

var Socket = require('../lib/socket');

var App = function () {
  this.showSplash();
  this.loading = null;
  this.counter = 0;
};

_.extend(App.prototype, Backbone.Events, {
  start: function () {
    this.trigger('startListening');

    this.shipsLayer.addToMap();
    this.trackLayer.start();
    this.notifications.start();
    this.ships.start();

    Socket.reconnect();

    this.listenToOnce(Platform, 'hidden', this.stop);
  },

  stop: function () {
    this.trigger('shopListening');
    Socket.disconnect();

    this.shipsLayer.removeFromMap();
    this.trackLayer.stop();
    this.notifications.stop();
    this.ships.stop();

    this.listenToOnce(Platform, 'visible', this.start);
  },

  showSplash: function () {
    $('#splash').show();
    $('.loading-progress').carousel({
      interval: 500
    });
  },

  hideSplash: function () {
    $('.loading-progress').carousel('pause');
    $('#splash').hide();
  },

  showLoading: function () {
    this.counter++;
    if (this.loading) return;

    this.loading = $.notify('loading', {
      spacing: 5,
      allow_dismiss: false,
      delay: 0,
      template: '<div class="loading"></div>',
      placement: {
        from: "top",
        align: "center"
      }
    });
  },

  hideLoading: function () {
    this.counter--;
    if (this.counter > 0) return;

    this.loading.close();
    this.loading = null;
  },

  run: function () {
    $.ajaxSetup({
      beforeSend: _.bind(this.showLoading, this),
      complete: _.bind(this.hideLoading, this)
    });

    this.ships = new Ships({ app: this.app });

    this.notifications = new Notifications({
      ships: this.ships
    });

    this.router = new Router({
      ships: this.ships
    });

    this.receptionLayer = new ReceptionLayer({
      app: this
    });

    this.shipsLayer = new ShipsLayer({
      ships: this.ships,
      app: this
    });

    this.trackLayer = new TrackLayer({
      ships: this.ships,
      app: this
    });

    this.contentView = this.render();

    var onLoadedLazy = _.debounce(_.bind(function () {
      this.hideSplash();
      this.stopListening(this, 'shipslayer:update', onLoadedLazy);
    }, this), 1000);

    this.listenTo(this, 'splash:hide', this.hideSplash);
    this.listenTo(this, 'splash:show', this.showSplash);
    this.listenTo(this, 'shipslayer:update', onLoadedLazy);

    this.start();
  }
});

module.exports = App;
