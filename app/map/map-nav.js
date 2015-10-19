'use strict';

var config = require('../config').frontend.map;

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
    this.mapgl.zoomIn();
  },

  zoomOut: function () {
    this.mapgl.zoomOut();
  },

  toHome: function () {
    this.mapgl.flyTo({
      center: config.center,
      zoom: config.zoom
    });
  },

  toNorth: function () {
    this.mapgl.resetNorth();
  },

  initialize: function (options) {
    this.mapgl = options.mapgl;

    this.mapgl.on('load', _.bind(function () {
      this.container = $(options.selector);
      this.render();
    }, this));
  },

  render: function () {
    this.$el.html(this.template());
    this.container.append(this.$el);
  }
});

module.exports = MapNav;

