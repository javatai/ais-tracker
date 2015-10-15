'use strict';

var _ = require('underscore');
var $ = require('jquery');

var Backbone = require('backbone');
require('backbone-relational');
Backbone.$ = $;

require('bootstrap');
require('bootstrap-notify');
require('jquery-color');

window.$ = $;
window.Backbone = Backbone;

var Ships = require('../models/ship/collection');
var Router = require('./router');
var ShipsLayer = require('../map/ships-layer');
var MasterView = require('../views/master-view');
var Notifications = require('./notifications');

var App = function () {
  this.showSplash();
};

_.extend(App.prototype, Backbone.Events, {
  showSplash: function () {
    $('#splash').show();
    $('.loading-progress').carousel({
      interval: 2000
    });
  },

  hideSplash: function () {
    $('.loading-progress').carousel('pause');
    $('#splash').hide();
  },

  run: function () {
    var notifications = new Notifications();
    notifications.start();

    var ships = new Ships();
    ships.fetch()
    /* Debugging */
    window.ships = ships;

    var router = new Router({
      ships: ships
    });

    var shipsLayer = new ShipsLayer({
      ships: ships,
      app: this
    });

    var masterView = new MasterView({
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
