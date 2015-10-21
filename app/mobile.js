"use strict";

require('./plugins');

var $ = require('jquery');
var _ = require('underscore');

var Platform = require('./lib/platform');
var Map = require('./map/map');

var MobileView = require('./views/mobile-view');
var MapNav = require('./views/map-nav');

var App = require('./lib/app');

var Mobile = function () {
  App.call(this);
};

_.extend(Mobile.prototype, App.prototype, {
  render: function () {
    return new MobileView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });
  },

  toggleMenu: function () {
    $('#content').toggleClass('is-visible');
  },

  run: function () {
    App.prototype.run.call(this);

    $('html').addClass('mobile');

    var self = this;
    Map.onReady().done(function () {
      var nav = new MapNav({
        container: $('.mapboxgl-ctrl-top-right'),
        buttons: [{
          cls: 'menu-hamburger',
          trigger: 'openMenu'
        }]
      });

      Map.listenTo(nav, 'zoomIn', Map.zoomIn);
      Map.listenTo(nav, 'zoomOut', Map.zoomOut);
      Map.listenTo(nav, 'toHome', Map.toHome);
      Map.listenTo(nav, 'toNorth', Map.toNorth);

      self.listenTo(nav, 'openMenu', self.toggleMenu);
    });

    $('.menu-close').on('click', this.toggleMenu);
  }
});

var mobile = new Mobile();

Platform.onReady().done(function () {
  mobile.run();
});

window.app = mobile;
