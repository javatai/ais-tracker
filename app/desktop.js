"use strict";

require('./plugins');

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var Platform = require('./lib/platform');
var Map = require('./map/map');

var DesktopView = require('./views/desktop-view');
var MapNav = require('./views/map-nav');

var App = require('./lib/app');

var Desktop = function () {
  App.call(this);
  this.map = Map;
};

_.extend(Desktop.prototype, App.prototype, {
  render: function () {
    return new DesktopView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });
  },
  run: function () {
    $('html').addClass('desktop');

    Map.onReady().done(function () {
      var nav = new MapNav();

      Map.listenTo(nav, 'zoomIn', Map.zoomIn);
      Map.listenTo(nav, 'zoomOut', Map.zoomOut);
      Map.listenTo(nav, 'toHome', Map.toHome);
    });

    App.prototype.run.call(this);
  }
});

var desktop = new Desktop();

Platform.isMobile = false;

Platform.onReady().done(function () {
  desktop.run();
});

window.app = desktop;
