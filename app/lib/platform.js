"use strict";

var config = require('../config').server;

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var PlatformSpecific = {
  'cordova': {
    'visibility-change': require('./platform/cordova/visibility-change')
  },
  'default': {
    'visibility-change': require('./platform/default/visibility-change'),
    'prevent-overscroll': require('./platform/default/prevent-overscroll')
  }
}

var Platform = function () {
  this.isTouchDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) || false;
  this.isMobile = null;

  this.isCordova = typeof(cordova) !== 'undefined';
  this.type = this.isCordova ? 'cordova' : 'default';

  this.isReady = this.isCordova ? false : true;

  this.initialize();
};

_.extend(Platform.prototype, Backbone.Events, {
  initialize: function () {
    var platformSpecific;

    if (this.isCordova) {
      platformSpecific = PlatformSpecific['cordova'];
    } else {
      platformSpecific = PlatformSpecific['default'];
    }

    this.onReady().done(function (platform) {
      _.each(platformSpecific, function (hook) {
        hook(platform);
      });
    });
  },

  onReady: function () {
    var self = this, dfd = $.Deferred();

    if (this.isReady) {
      dfd.resolve(this);
    }

    document.addEventListener("deviceready", function () {
      self.isReady = true;
      dfd.resolve(self);
    });

    return dfd.promise();
  },

  socketConfig: function () {
    if (this.isCordova) {

      return {
        protocol: 'http:',
        hostname: config.hostname,
        port: config.http
      }

    } else {

      if (location.protocol === 'https:') {
        return {
          protocol: 'https:',
          hostname: config.hostname,
          port: config.https
        };
      } else {
        return {
          protocol: 'http:',
          hostname: config.hostname,
          port: config.http
        };
      }
    }
  },

  setPrefix: function (suffix) {
    if (this.isCordova || location.protocol === 'https:') {
      return 'https://' + config.hostname + ':' + config.https + suffix;
    } else {
      return 'http://' + config.hostname + ':' + config.http + suffix;
    }
  }
});

module.exports = new Platform();
