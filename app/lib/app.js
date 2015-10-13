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

var App = function () { };

_.extend(App.prototype, Backbone.Events, {
  run: function () {
    var notifications = new Notifications();
    notifications.start();

    var ships = new Ships();

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
  }
});

module.exports = App;