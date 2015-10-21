"use strict";

require('./plugins');

var $ = require('jquery');
var _ = require('underscore');

var Platform = require('./lib/platform');

var DesktopView = require('./views/desktop-view');
var App = require('./lib/app');

var Desktop = function () {
  App.call(this);
};

_.extend(Desktop.prototype, App.prototype, {
  render: function () {
    return new DesktopView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });
  }
});

var desktop = new Desktop();

Platform.onReady().done(function () {
  desktop.run();
});

window.app = desktop;
