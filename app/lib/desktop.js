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

var selScrollable = '.scrollable';
$(document).on('touchmove',function(e){
  e.preventDefault();
});

$('body').on('touchstart', selScrollable, function(e) {
  if (e.currentTarget.scrollTop === 0) {
    e.currentTarget.scrollTop = 1;
  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
    e.currentTarget.scrollTop -= 1;
  }
});

$('body').on('touchmove', selScrollable, function(e) {
  e.stopPropagation();
});

var Ships = require('../models/ship/collection');
var Router = require('./router');
var ReceptionLayer = require('../map/reception-layer');
var ShipsLayer = require('../map/ships-layer');
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
    Socket.reconnect();
    this.notifications.startListening();
    this.ships.startListening();
    this.ships.fetch();
  },

  stop: function () {
    this.notifications.stopListening();
    this.ships.stopListening();
    Socket.disconnect();
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

  chkIsActive: function () {
    var self = this;

    (function() {
      var hidden = "hidden";

      // Standards:
      if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
      else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
      else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
      else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
      // IE 9 and lower:
      else if ("onfocusin" in document)
        document.onfocusin = document.onfocusout = onchange;
      // All others:
      else
        window.onpageshow = window.onpagehide
        = window.onfocus = window.onblur = onchange;

      function onchange (evt) {
        var v = "visible", h = "hidden",
          evtMap = {
            focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
          };

        evt = evt || window.event;
        if (evt.type in evtMap) {
          self.trigger(evtMap[evt.type]);
        }
        else
          self.trigger(this[hidden] ? "hidden" : "visible");
      }

      // set the initial state (but only if browser supports the Page Visibility API)
      if( document[hidden] !== undefined )
        onchange({type: document[hidden] ? "blur" : "focus"});
    })();
  },

  run: function () {
    $.ajaxSetup({
      beforeSend: _.bind(this.showLoading, this),
      complete: _.bind(this.hideLoading, this)
    });

    this.notifications = new Notifications();

    this.ships = new Ships();
    /* Debugging */
    window.ships = this.ships;

    this.listenTo(this.ships, 'expired', function (ships) {
      _.each(this.ships, function (ship) {
        this.notifications.onShipExpire(ship);
      }, this);
    });

    var router = new Router({
      ships: this.ships
    });

    var receptionLayer = new ReceptionLayer({
      app: this
    });

    var shipsLayer = new ShipsLayer({
      ships: this.ships,
      app: this
    });

    var desktopView = new DesktopView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });

    var onLoadedLazy = _.debounce(_.bind(function () {
      this.hideSplash();
      this.stopListening(this, 'shipslayer:update', onLoadedLazy);
    }, this), 1000);

    this.listenTo(this, 'splash:hide', this.hideSplash);
    this.listenTo(this, 'splash:show', this.showSplash);
    this.listenTo(this, 'shipslayer:update', onLoadedLazy);

    this.listenTo(this, 'hidden', this.stop);
    this.listenTo(this, 'visible', this.start);

    this.chkIsActive();
  }
});

module.exports = App;
