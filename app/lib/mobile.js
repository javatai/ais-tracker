'use strict';

var _ = require('underscore');
var $ = require('jquery');

var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

require('bootstrap');
require('bootstrap-notify');
require('bootstrap-switch');
require('jquery-color');

window.$ = $;
window.Backbone = Backbone;

var Ships = require('../models/ship/collection');
var Router = require('./router');
var ReceptionLayer = require('../map/reception-layer');
var ShipsLayer = require('../map/ships-layer');
var DesktopView = require('../views/desktop-view');
var Notifications = require('./notifications');

var App = function () {
  this.showSplash();
  this.loading = null;
  this.counter = 0;
};

_.extend(App.prototype, Backbone.Events, {
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

    var notifications = new Notifications();
    notifications.start();

    var ships = new Ships();
    ships.fetch();

    this.listenTo(ships, 'expired', function (ships) {
      _.each(ships, function (ship) {
        notifications.onShipExpire(ship);
      });
    });

    /* Debugging */
    window.ships = ships;

    var router = new Router({
      ships: ships
    });

    var receptionLayer = new ReceptionLayer({
      app: this
    });

    var shipsLayer = new ShipsLayer({
      ships: ships,
      app: this
    });

    var desktopView = new DesktopView({
      el: $('#content'),
      collection: ships,
      app: this
    });

    var onLoadedLazy = _.debounce(_.bind(function () {
      this.hideSplash();
      this.stopListening(this, 'shipslayer:update', onLoadedLazy);
    }, this), 1000);

    this.listenTo(this, 'splash:hide', this.hideSplash);
    this.listenTo(this, 'splash:show', this.showSplash);
    this.listenTo(this, 'shipslayer:update', onLoadedLazy);
  }
});

module.exports = App;
