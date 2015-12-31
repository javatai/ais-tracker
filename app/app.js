var _ = require('underscore');
var Backbone = require('backbone');
var Platform = require('./platform');

var Socket = require('./socket');

var App = function () {
  this.platform = Platform;

  Platform.onReady().done(this.run.bind(this));
};

_.extend(App.prototype, Backbone.Events, {
  start: function () {
    this.trigger('startListening');

    Socket.reconnect();

    this.listenToOnce(Platform, 'hidden', this.stop);
  },

  stop: function () {
    this.trigger('shopListening');

    Socket.disconnect();

    this.listenToOnce(Platform, 'visible', this.start);
  },

  run: function () {
    this.start();
  }
})

module.exports = App;
