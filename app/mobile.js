"use strict";

require('./plugins');

var config = require('./config').frontend;

var $ = require('jquery');
var _ = require('underscore');

var Platform = require('./lib/platform');

var mapboxgljs = require('./map/mapboxgljs/map');
var Map = require('./map/map');

var MobileView = require('./views/mobile-view');
var MapNav = require('./views/map-nav');

var App = require('./lib/app');

var Mobile = function () {
  App.call(this);
  this.map = Map;
};

_.extend(Mobile.prototype, App.prototype, {
  render: function () {
    return new MobileView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });
  },

  run: function () {
    App.prototype.run.call(this);

    this.listenTo(this, 'reception:layer', this.contentView.slideIn);

    $('html').addClass('mobile');

    var self = this;
    Map.onReady().done(function () {
      var buttons = {
        before: [{
          cls: 'menu-hamburger',
          trigger: 'openMenu'
        }]
      };

      if (Platform.isTouchDevice && Map instanceof mapboxgljs) {
        buttons.after = [{
          cls: 'screenshot',
          trigger: 'toNorth'
        }];
      }

      var nav = new MapNav({
        buttons: buttons
      });

      Map.listenTo(nav, 'zoomIn', Map.zoomIn);
      Map.listenTo(nav, 'zoomOut', Map.zoomOut);
      Map.listenTo(nav, 'toHome', Map.toHome);

      if (Platform.isTouchDevice && Map instanceof mapboxgljs) {
        Map.listenTo(nav, 'toNorth', Map.toNorth);
      }

      self.contentView.listenTo(nav, 'openMenu', self.contentView.slideOut);
    });
  }
});

var mobile = new Mobile();

Platform.isMobile = true;

Platform.onReady().done(function () {
  mobile.run();
});

window.app = mobile;
