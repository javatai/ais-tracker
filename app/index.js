var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var App = require('./app');
var app = new App();

var Socket = require('./socket');

Socket.connect().done(function (io) {
  io.on('init', function (payload) {
    console.log(payload);
  });
  io.on('update', function (payload) {
    console.log(payload);
  });
});
