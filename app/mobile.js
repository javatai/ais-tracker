"use strict";

require('./plugins');

var $ = require('jquery');
var _ = require('underscore');

var Platform = require('./lib/platform');

var DesktopView = require('./views/desktop-view');
var App = require('./lib/app');

var Mobile = function () {
  App.call(this);
};

_.extend(Mobile.prototype, App.prototype, {
  render: function () {
    return new DesktopView({
      el: $('#content'),
      collection: this.ships,
      app: this
    });
  }
});

var mobile = new Mobile();

Platform.onReady().done(function () {
  mobile.run();
});

window.app = mobile;
