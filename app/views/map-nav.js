'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var template = require('./map-nav.hbs');

var MapNav = Backbone.View.extend({
  tagName: 'div',
  template: template,
  className: 'map-nav',

  events: {
    "click .glyphicon-zoom-in" : "zoomIn",
    "click .glyphicon-zoom-out" : "zoomOut",
    "click .glyphicon-home" : "toHome",
    "click .glyphicon-screenshot" : "toNorth",
  },

  zoomIn: function () {
    this.trigger('zoomIn');
  },

  zoomOut: function () {
    this.trigger('zoomOut');
  },

  toHome: function () {
    this.trigger('toHome');
  },

  toNorth: function () {
    this.trigger('toNorth');
  },

  initialize: function (options) {
    this.container = options.container;
    this.render();
  },

  render: function () {
    this.$el.html(this.template());
    this.container.append(this.$el);
  }
});

module.exports = MapNav;

